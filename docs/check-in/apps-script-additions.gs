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

  const reservationNumber = String(
    (e && e.parameter && e.parameter.reservationNumber) || "",
  ).trim().toUpperCase();
  const city = String(
    (e && e.parameter && e.parameter.city) || "",
  ).trim();
  const staffId = String(
    (e && e.parameter && e.parameter.staffId) || "",
  ).trim();

  if (
    !/^MBG-(TGR|CBR|YGY|MLG)-\d{3,}$/.test(reservationNumber) ||
    !Object.prototype.hasOwnProperty.call(EVENT_INFO, city)
  ) {
    return checkInJson_({
      success: false,
      code: "INVALID_REQUEST",
      message: "Nomor reservasi atau kota tidak valid.",
    });
  }

  if (action === "checkin_search") {
    return checkInJson_(searchCheckInReservation_(reservationNumber, city));
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

function searchCheckInReservation_(reservationNumber, selectedCity) {
  const record = findCheckInRegistration_(reservationNumber);

  if (!record) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "Nomor reservasi tidak ditemukan.",
    };
  }

  if (String(record.status || "").trim().toLowerCase() === "dibatalkan") {
    return {
      success: false,
      code: "CANCELLED",
      message: "Reservasi ini sudah dibatalkan.",
    };
  }

  if (record.city !== selectedCity) {
    return {
      success: false,
      code: "WRONG_CITY",
      message: "Reservasi terdaftar di kota lain.",
      participant: publicCheckInParticipant_(
        record,
        findCheckInLog_(reservationNumber),
      ),
    };
  }

  const existing = findCheckInLog_(reservationNumber);
  return {
    success: true,
    alreadyCheckedIn: Boolean(existing),
    participant: publicCheckInParticipant_(record, existing),
  };
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
