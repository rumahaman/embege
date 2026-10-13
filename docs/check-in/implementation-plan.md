# MBG Check-in — Development Plan

## Purpose

Build a staff-only, mobile-friendly check-in page for Manggung Bergizi Gratis. The check-in workflow must be separate from public registration and must not disrupt the existing production website.

## Repository and deployment

- Repository: `rumahaman/embege`
- Production branch: `main`
- Feature development branch: `development`
- Stack: Next.js App Router, React, TypeScript, deployed on Vercel.
- Existing production API routes:
  - `POST /api/reservasi` submits reservations to the existing Google Apps Script.
  - `GET /api/kuota` reads quota data from the existing Google Apps Script.
- Existing environment variable: `GOOGLE_APPS_SCRIPT_URL`.
- Do not change production until feature work is reviewed and explicitly promoted from a preview.

## Scope for MVP

1. Staff-only access; credentials and authorization checks must be enforced server-side.
2. Select one event city/venue before searching.
3. Search an attendee by reservation number first; use name search only as a manual fallback.
4. Show the minimum required attendee details for validation: reservation number, name, registered city, and check-in status.
5. Confirm check-in with one action.
6. Record check-in time and staff identifier in a separate `Check-in` sheet/tab.
7. Prevent duplicate check-in, including two simultaneous requests, with a server-side lock / atomic operation.
8. Display clear outcomes for not found, wrong city, already checked in, success, and service/network error.
9. Provide an operational fallback: export/print city lists before doors open and reconcile any offline marks later.

## Data safety constraints

- Keep the existing `Registrasi` tab and its columns unchanged.
- Do not replace the existing Apps Script code or deployment blindly. The active deployed `Code.gs` must be reviewed before integrating new actions.
- Preserve registration numbering, quota handling, and optional email confirmation.
- Do not expose Apps Script secrets, staff PINs, or other server configuration in browser code.
- Do not log attendee phone numbers or email addresses unless genuinely required.
- Never treat a reservation screenshot as the source of truth; verify against the live registration record when connectivity permits.

## Suggested route structure (to be confirmed during implementation)

- Page: `/check-in`
- Server routes: `/api/check-in/search`, `/api/check-in/confirm`
- If staff access needs a session, implement server-side validation and secure, HTTP-only cookies; do not rely on hiding the page or a client-only PIN check.

## Acceptance tests

- Valid reservation finds the correct person in the selected city.
- Unknown reservation is not checked in.
- A reservation from another city is flagged for coordinator review.
- Repeated check-in is blocked and shows the prior result.
- Two concurrent confirmations result in exactly one successful check-in.
- Registration submission, quota reads, reservation number generation, and optional email confirmation remain functional.
- Mobile layout is usable at a venue check-in desk.
- A fallback city list and reconciliation procedure are documented.

## Workflow

1. Develop only on `development`.
2. Confirm Vercel preview deployment and run checks there.
3. Test with non-production/test reservations first.
4. Review all code and Apps Script changes before merging.
5. Merge into `main` only after acceptance tests pass and production release is approved.

This document is a plan only; it does not implement or activate check-in functionality.
