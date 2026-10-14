/**
 * MBG Check-in — multi-field search migration for the ACTIVE Apps Script project.
 *
 * IMPORTANT: Do not paste this entire file at the bottom unchanged.
 *
 * 1) Replace the existing complete function handleCheckInAction_(e, action)
 *    in the active Code.gs with the version below.
 * 2) Append the two new helper functions at the end of Code.gs:
 *    searchCheckInReservations_ and normalizeCheckInPhone_.
 * 3) The old searchCheckInReservation_ function may remain unused.
 * 4) Save, then Deploy > Manage deployments > Edit > New version > Deploy.
 *    Keep the existing Web App URL.
 *
 * Searches stay restricted to the city supplied by the signed Vercel session.
 * Returned attendee results do not expose email or WhatsApp values.
 */

/* REPLACE THE EXISTING handleCheckInAction_ FUNCTION WITH THIS VERSION */

function handleCheckInAction_(e, action) {
  const supportedActions = [
    "checkin_search",
    "checkin_confirm",
    "checkin_summary",
  ];

  if (supportedActions.indexOf(action) === -1) {
    return checkInJson_({
      success: false,
      code: "INVALID_REQUEST",
      message: "Aksi check-in tidak dikenal.",
    });
  }

  const properties = PropertiesService.getScriptProperties();
  const expectedSecret = String(
    properties.getProperty("CHECKIN_API_SECRET") || "",
  );
  const suppliedSecret = String(
    (e && e.parameter && e.parameter.apiSecret) || "",
  );

  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return checkInJson_({
      success: false,
      code: "UNAUTHORIZED",
      message: "Permintaan check-in tidak terotorisasi.",
    });
  }

  if (action === "checkin_summary") {
    return checkInJson_(getCheckInSummary_());
  }

  const city = String(
    (e && e.parameter && e.parameter.city) || "",
  ).trim();
  const staffId = String(
    (e && e.parameter && e.parameter.staffId) || "",
  ).trim();

  if (!Object.prototype.hasOwnProperty.call(EVENT_INFO, city)) {
    return checkInJson_({
      success: false,
      code: "INVALID_REQUEST",
      message: "Kota venue tidak valid.",
    });
  }

  if (action === "checkin_search") {
    const query = String(
      (e && e.parameter && e.parameter.query) || "",
    ).trim();

    if (query.length < 2 || query.length > 100) {
      return checkInJson_({
        success: false,
        code: "INVALID_REQUEST",
        message: "Kata kunci pencarian harus berisi 2–100 karakter.",
      });
    }

    return checkInJson_(searchCheckInReservations_(query, city));
  }

  const reservationNumber = String(
    (e && e.parameter && e.parameter.reservationNumber) || "",
  ).trim().toUpperCase();

  if (!/^MBG-(TGR|CBR|YGY|MLG)-\d{3,}$/.test(reservationNumber)) {
    return checkInJson_({
      success: false,
      code: "INVALID_REQUEST",
      message: "Nomor reservasi tidak valid.",
    });
  }

  if (!/^[A-Za-z0-9._-]{2,24}$/.test(staffId)) {
    return checkInJson_({
      success: false,
      code: "INVALID_REQUEST",
      message: "Identitas petugas tidak valid.",
    });
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    // Re-read the live registration and check-in log under lock.
    // This prevents two simultaneous check-ins for one reservation.
    const record = findCheckInRegistration_(reservationNumber);

    if (!record) {
      return checkInJson_({
        success: false,
        code: "NOT_FOUND",
        message: "Nomor reservasi tidak ditemukan.",
      });
    }

    if (String(record.status || "").trim().toLowerCase() === "dibatalkan") {
      return checkInJson_({
        success: false,
        code: "CANCELLED",
        message: "Reservasi ini sudah dibatalkan.",
      });
    }

    if (record.city !== city) {
      return checkInJson_({
        success: false,
        code: "WRONG_CITY",
        message: "Reservasi terdaftar di kota lain.",
        participant: publicCheckInParticipant_(record, null),
      });
    }

    const existing = findCheckInLog_(reservationNumber);
    if (existing) {
      return checkInJson_({
        success: true,
        alreadyCheckedIn: true,
        message: "Peserta sudah check-in sebelumnya.",
        participant: publicCheckInParticipant_(record, existing),
      });
    }

    const logSheet = getCheckInSheet_();
    const checkedInAt = new Date();

    logSheet.appendRow([
      record.reservationNumber,
      record.name,
      record.city,
      checkedInAt,
      staffId,
      "SUDAH HADIR",
    ]);
    SpreadsheetApp.flush();

    return checkInJson_({
      success: true,
      alreadyCheckedIn: false,
      message: "Check-in berhasil dicatat.",
      participant: publicCheckInParticipant_(record, {
        checkedInAt: Utilities.formatDate(
          checkedInAt,
          Session.getScriptTimeZone(),
          "yyyy-MM-dd HH:mm:ss",
        ),
        staffId: staffId,
        status: "SUDAH HADIR",
      }),
    });
  } catch (error) {
    console.error(
      "Check-in confirmation error:",
      error instanceof Error ? error.message : String(error),
    );
    return checkInJson_({
      success: false,
      code: "CHECKIN_ERROR",
      message: "Check-in belum berhasil dicatat. Periksa koneksi dan coba lagi.",
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {
      // Ignore release errors; Apps Script releases the lock on execution end.
    }
  }
}

/* APPEND THESE TWO NEW HELPER FUNCTIONS */

function searchCheckInReservations_(query, selectedCity) {
  const sheet = getRegistrationSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "Belum ada peserta terdaftar di venue ini.",
    };
  }

  // B:H = reservation number, name, Instagram, WhatsApp, email, city, status.
  const rows = sheet.getRange(2, 2, lastRow - 1, 7).getDisplayValues();
  const rawQuery = String(query || "").trim();
  const queryLower = rawQuery.toLowerCase();
  const queryUpper = rawQuery.toUpperCase();
  const queryDigits = rawQuery.replace(/\D/g, "");
  const queryPhone = normalizeCheckInPhone_(rawQuery);
  const scoredMatches = [];

  rows.forEach(function (row) {
    const reservationNumber = String(row[0] || "").trim();
    const name = String(row[1] || "").trim();
    const phone = String(row[3] || "").trim();
    const email = String(row[4] || "").trim();
    const city = String(row[5] || "").trim();
    const status = String(row[6] || "").trim();

    // Always isolate search to the venue bound to the staff session.
    if (!reservationNumber || city !== selectedCity) return;

    const normalizedReservation = reservationNumber.toUpperCase();
    const normalizedName = name.toLowerCase();
    const normalizedEmail = email.toLowerCase();
    const normalizedPhone = normalizeCheckInPhone_(phone);
    let score = 0;

    if (normalizedReservation === queryUpper) {
      score = 100;
    } else if (normalizedEmail && normalizedEmail === queryLower) {
      score = 95;
    } else if (
      queryDigits.length >= 7 &&
      normalizedPhone &&
      (normalizedPhone === queryPhone ||
        normalizedPhone.includes(queryPhone) ||
        normalizedPhone.includes(queryDigits))
    ) {
      score = 95;
    } else if (normalizedName === queryLower) {
      score = 90;
    } else if (normalizedName.startsWith(queryLower)) {
      score = 80;
    } else if (queryLower.length >= 3 && normalizedEmail.includes(queryLower)) {
      score = 70;
    } else if (normalizedName.includes(queryLower)) {
      score = 60;
    }

    if (score > 0) {
      scoredMatches.push({
        score: score,
        record: {
          reservationNumber: reservationNumber,
          name: name,
          city: city,
          status: status,
        },
      });
    }
  });

  scoredMatches.sort(function (a, b) {
    return b.score - a.score || a.record.name.localeCompare(b.record.name);
  });

  if (scoredMatches.length === 0) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "Peserta tidak ditemukan di venue ini. Periksa kembali kata kunci.",
    };
  }

  const MAX_RESULTS = 10;
  const selectedMatches = scoredMatches.slice(0, MAX_RESULTS);
  const participants = selectedMatches.map(function (match) {
    const existing = findCheckInLog_(match.record.reservationNumber);
    return publicCheckInParticipant_(match.record, existing);
  });

  if (scoredMatches.length === 1) {
    const cancelled =
      String(participants[0].registrationStatus || "").trim().toLowerCase() === "dibatalkan";

    return {
      success: !cancelled,
      code: cancelled ? "CANCELLED" : undefined,
      message: cancelled ? "Reservasi ini sudah dibatalkan." : "Reservasi ditemukan.",
      alreadyCheckedIn: participants[0].checkInStatus === "SUDAH HADIR",
      participant: participants[0],
    };
  }

  return {
    success: true,
    multipleMatches: true,
    matchCount: scoredMatches.length,
    truncated: scoredMatches.length > MAX_RESULTS,
    participants: participants,
    message: "Pilih peserta yang sesuai dari hasil pencarian.",
  };
}

function normalizeCheckInPhone_(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.indexOf("62") === 0) {
    digits = "0" + digits.substring(2);
  } else if (digits.indexOf("8") === 0) {
    digits = "0" + digits;
  }

  return digits;
}
