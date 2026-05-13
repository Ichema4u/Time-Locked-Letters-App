# Audit: Edge Cases, Risks, and Principle Questions

This audit covers edge cases for `localStorage`, system clock changes, duplicate unlock times, and potential XSS. It also calls out possible principle violations.

## 1. `localStorage` edge cases

- `useLetters.ts` reads storage safely:
  - `loadFromStorage()` catches errors and returns an empty list if reading fails. (lines 006-013)
- Writing is not protected:
  - `useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(letters)); }, [letters]);` is vulnerable if `localStorage` is full or disabled. (lines 019-021)

Potential failure modes:

- If storage is full, `localStorage.setItem(...)` may throw `QuotaExceededError` and the effect may crash or stop saving letters.
- If `localStorage` is disabled by browser settings or privacy mode, the write will also throw and there is no fallback.
- The current code handles read failure gracefully but not write failure.

## 2. `localStorage` disabled / unavailable

- On read, `loadFromStorage()` catches exceptions and returns `[]`. Good.
- On write, there is no `try/catch` around `localStorage.setItem(...)`, so the app is not resilient if storage is unavailable.

Questions:

- Should we add a fallback UI or a graceful error message for storage write failure?
- Should we wrap the save effect in a `try/catch` and avoid breaking the app if the browser blocks storage?

## 3. System clock changes

- The app uses the client clock for all unlock logic:
  - `App.tsx` uses `const now = Date.now();` and compares `new Date(l.unlockAt).getTime() > now`. (lines 017-020)
  - `useCountdown.ts` uses `Date.now()` and `new Date(unlockAt).getTime()` to compute time remaining. (lines 013-015)
  - `ComposeModal.tsx` validates `unlockAt` against `new Date()` and `Date.now()`. (lines 037, 058-060)

Potential issues:

- If the user changes their system clock forward, letters may unlock early.
- If the user changes the clock backward, letters may appear locked again or the countdown may reset.
- The unlock validation in the modal can be bypassed by changing the local clock before submission.

Questions:

- Is it acceptable that unlock behavior depends on the client clock?
- Should the app document this limitation or use a server-based time source in the future?

## 4. Same unlock minute / same unlock time

- Two letters can share the same unlock minute without issue.
- The core logic compares timestamps in milliseconds, not just minute precision, so same-minute letters unlock together as expected.
- Unique IDs are generated with `crypto.randomUUID()`, so there is no collision risk from identical unlock times. (line 026)

Observation:

- `letter.unlockAt` is stored as an ISO string, and both `App.tsx` and `useCountdown.ts` can handle multiple letters with the same unlock moment.

## 5. XSS / text rendering

- Text appears as plain JSX content in `LetterCard.tsx`:
  - Recipient is rendered as `{letter.recipient}`. (line 036)
  - Letter body is rendered as `{letter.content}`. (line 096)
- React escapes text by default, so these are safe if the app stays on plain text rendering.

Questions:

- Are we planning to support rich text, HTML, or markdown in letters? If so, this creates an XSS risk.
- Should we sanitize or validate user input before saving it to `localStorage`?

## 6. Principle violations to consider

- Side effects safety:
  - The write effect in `useLetters.ts` is a side effect without error handling. That weakens the principle of resilient side effect management. (lines 019-021)
- React hook dependency discipline:
  - `useCountdown.ts` uses `countdown.isUnlocked` inside `useEffect`, but the dependency array is only `[unlockAt]` and the linter comment is disabled. (lines 032-043)
  - This is a deliberate deviation from the principle that effect dependencies should include all referenced reactive values.
- Robustness:
  - `useLetters` handles read failures but not write failures, so the app only partially obeys the principle of graceful degradation.

Questions:

- Should we treat the disabled `react-hooks/exhaustive-deps` warning as a design debt to fix later?
- Do we want to enforce full error handling around storage writes to align with defensive programming principles?

## 7. Summary of actionable risks

- Add `try/catch` around `localStorage.setItem(...)` so a full or disabled storage environment does not break the app.
- Decide whether client clock-based unlocks are acceptable or whether a trusted time source is required.
- Confirm whether plain text rendering is the only valid content path so XSS remains low risk.
- Review the hook dependency comment in `useCountdown.ts` and decide if it should be refactored for clearer effect semantics.
