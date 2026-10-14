/**
 * MBG Check-in — additive Apps Script handlers.
 *
 * SAFETY:
 * 1) Back up the active Apps Script project before editing.
 * 2) Add the dispatch snippet shown in docs/check-in/SETUP.md
 *    at the very beginning of the existing doPost(e), before its
 *    current reservation-processing code.
 * 3) Append this file's functions after the existing Code.gs code.
 * 4) Add Script Property CHECKIN_API_SECRET with the same long
 *    random value configured as CHECKIN_API_SECRET in Vercel.
 * 5) Update the existing web-app deployment to a new version.
 *
 * This file is a patch/addition, not a replacement for Code.gs.
 */

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

function findCheckInRegistration_(reservationNumber) {
  const sheet = getRegistrationSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return null;

  // B:H = reservation number, name, Instagram, WhatsApp, email, city, status.
  const rows = sheet.getRange(2, 2, lastRow - 1, 7).getDisplayValues();

  for (const row of rows) {
    if (String(row[0] || "").trim().toUpperCase() !== reservationNumber) {
      continue;
    }

    return {
      reservationNumber: String(row[0] || "").trim(),
      name: String(row[1] || "").trim(),
      city: String(row[5] || "").trim(),
      status: String(row[6] || "").trim(),
    };
  }

  return null;
}

function getCheckInSheet_() {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName("Check-in");

  if (!sheet) {
    sheet = spreadsheet.insertSheet("Check-in");
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 6).setValues([[
      "No. Reservasi",
      "Nama Lengkap",
      "Kota Acara",
      "Waktu Check-in",
      "Petugas",
      "Status",
    ]]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function findCheckInLog_(reservationNumber) {
  const sheet = getCheckInSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return null;

  const rows = sheet.getRange(2, 1, lastRow - 1, 6).getDisplayValues();

  for (const row of rows) {
    if (String(row[0] || "").trim().toUpperCase() === reservationNumber) {
      return {
        reservationNumber: String(row[0] || "").trim(),
        name: String(row[1] || "").trim(),
        city: String(row[2] || "").trim(),
        checkedInAt: String(row[3] || "").trim(),
        staffId: String(row[4] || "").trim(),
        status: String(row[5] || "").trim(),
      };
    }
  }

  return null;
}

function publicCheckInParticipant_(record, logRecord) {
  return {
    reservationNumber: record.reservationNumber,
    name: record.name,
    city: record.city,
    registrationStatus: record.status,
    checkInStatus: logRecord ? "SUDAH HADIR" : "BELUM HADIR",
    checkedInAt: logRecord ? logRecord.checkedInAt || "" : "",
    staffId: logRecord ? logRecord.staffId || "" : "",
  };
}

function getCheckInSummary_() {
  const registrations = getQuotaData();
  const checkInSheet = getCheckInSheet_();
  const lastRow = checkInSheet.getLastRow();
  const logRows =
    lastRow >= 2
      ? checkInSheet.getRange(2, 1, lastRow - 1, 6).getDisplayValues()
      : [];

  const validReservationNumbers = {};
  const registrationSheet = getRegistrationSheet();
  const registrationLastRow = registrationSheet.getLastRow();

  if (registrationLastRow >= 2) {
    const rows = registrationSheet
      .getRange(2, 2, registrationLastRow - 1, 7)
      .getDisplayValues();

    rows.forEach(function (row) {
      const reservationNumber = String(row[0] || "").trim().toUpperCase();
      const city = String(row[5] || "").trim();
      const status = String(row[6] || "").trim().toLowerCase();

      if (
        reservationNumber &&
        city &&
        status !== "dibatalkan"
      ) {
        validReservationNumbers[reservationNumber] = city;
      }
    });
  }

  const checkedInCounts = {};
  let totalCheckedIn = 0;

  logRows.forEach(function (row) {
    const reservationNumber = String(row[0] || "").trim().toUpperCase();
    const loggedCity = String(row[2] || "").trim();
    const status = String(row[5] || "").trim().toUpperCase();

    if (
      status === "SUDAH HADIR" &&
      validReservationNumbers[reservationNumber] === loggedCity
    ) {
      checkedInCounts[loggedCity] = (checkedInCounts[loggedCity] || 0) + 1;
      totalCheckedIn += 1;
    }
  });

  const cities = registrations.map(function (item) {
    return {
      city: item.city,
      registered: item.registered,
      checkedIn: checkedInCounts[item.city] || 0,
    };
  });

  return {
    success: true,
    totalRegistered: cities.reduce(function (sum, item) {
      return sum + item.registered;
    }, 0),
    totalCheckedIn: totalCheckedIn,
    cities: cities,
  };
}

function checkInJson_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
