# MBG Check-in MVP — Setup dan aktivasi

## Status

The web UI and Vercel API routes are developed on the `development` branch. The application is **not operational against live registrations** until the Apps Script addition and environment secrets below are configured and tested.

## 1. Vercel environment variables

The existing `GOOGLE_APPS_SCRIPT_URL` variable is already used by the current registration and quota APIs. Do not replace or rotate it as part of this feature.

Add these new variables to the Vercel project `embege` for the **Preview** environment first:

- `CHECKIN_STAFF_PIN`: a strong staff passphrase/PIN. Prefer a long, non-guessable value rather than a short numeric PIN.
- `CHECKIN_SESSION_SECRET`: a random secret with at least 32 bytes of entropy; used to sign the HTTP-only staff session cookie.
- `CHECKIN_API_SECRET`: a separate random secret used only between the Vercel server and Apps Script.

Do not put these values in source control or expose them to browser code. Do not use a `NEXT_PUBLIC_` prefix.

## 2. Add the Apps Script handler

1. Open the active Apps Script project bound to the MBG registration spreadsheet.
2. Make a copy of the current `Code.gs` before editing.
3. In Script editor > Project Settings > Script properties, add `CHECKIN_API_SECRET` with exactly the same value configured in Vercel.
4. Open the existing `doPost(e)`. Immediately after its opening brace, before `let lock = null;`, add:

```javascript
  const incomingAction = String(
    (e && e.parameter && e.parameter.action) || ""
  ).trim().toLowerCase();

  if (incomingAction.indexOf("checkin_") === 0) {
    return handleCheckInAction_(e, incomingAction);
  }
```

5. Append the contents of `apps-script-additions.gs` to the end of the existing `Code.gs`. Do not replace the existing code with this addition.
6. Save and test. The addition creates a separate `Check-in` tab on first use with columns: No. Reservasi, Nama Lengkap, Kota Acara, Waktu Check-in, Petugas, Status.
7. In Deploy > Manage deployments, edit the existing web-app deployment and publish a new version while preserving the existing deployment URL and its current access configuration. Do not create a replacement deployment URL unless you also deliberately update Vercel.

## 3. Preview tests

Test the preview page at `/check-in` with a test PIN and only with a known test reservation first.

Required tests:

- A valid reservation in the selected city is found.
- A number that does not exist returns NOT_FOUND.
- A reservation selected under another city returns WRONG_CITY.
- A cancelled reservation cannot be checked in.
- The first check-in is written once to the Check-in tab.
- A repeated or simultaneous check-in returns the existing log instead of adding a second row.
- Check-in log entries contain no attendee phone number or email.
- Existing registration submission, number generation, quota endpoint, and optional confirmation email still work.

## 4. Release

Do not merge to `main` or add production secrets until preview tests pass. After approval, configure the production environment variables and release the reviewed changes. Keep a printed/exported participant list for each city as a fallback for internet or service outages.

## Security notes

- The Vercel API validates the staff session before sending a request to Apps Script.
- Apps Script validates `CHECKIN_API_SECRET` before performing check-in actions.
- The check-in writer uses `LockService.getScriptLock()` to serialize the duplicate check and append operation.
- The log contains minimum operational data only. Do not add WhatsApp numbers or attendee emails to the check-in log.
- The staff identifier is an audit label entered at login; this MVP uses a shared PIN, not individually managed user accounts.
