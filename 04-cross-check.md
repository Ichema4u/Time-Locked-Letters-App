# Cross-Check: Audit Findings and Recommendations

This document revisits the audit findings, compares options for handling edge cases, and provides reasoning for the chosen recommendations.

## 1. `localStorage` edge cases

### Problem:

- Writing to `localStorage` can fail if the storage is full or disabled.
- Current code does not handle write failures, which may crash the app.

### Options:

1. **Add `try/catch` around `localStorage.setItem(...)`:**
   - Pros: Prevents crashes, allows the app to continue running.
   - Cons: Does not inform the user about the failure.
2. **Fallback UI for storage issues:**
   - Pros: Provides user feedback, improves UX.
   - Cons: More complex to implement.

### Recommendation:

- **Option 1:** Add `try/catch` to handle write failures gracefully. This aligns with the principle of resilient side effect management.
- Rationale: Preventing crashes is the minimum requirement. User feedback can be added later if needed.

---

## 2. System clock changes

### Problem:

- Unlock logic depends on the client clock (`Date.now()`), which can be manipulated.
- Early unlocks or relocking can occur if the user changes their system clock.

### Options:

1. **Document the limitation:**
   - Pros: Simple, no code changes.
   - Cons: Relies on user trust.
2. **Use a server-based time source:**
   - Pros: Prevents manipulation, ensures consistent unlock behavior.
   - Cons: Requires backend infrastructure.

### Recommendation:

- **Option 1:** Document the limitation for now.
- Rationale: The app is client-only, and adding a backend is outside the current scope. This limitation is acceptable for a lightweight app.

---

## 3. Same unlock minute / same unlock time

### Problem:

- Multiple letters can share the same unlock time.

### Options:

1. **Allow same unlock times:**
   - Pros: Simple, no changes needed.
   - Cons: None identified.
2. **Enforce unique unlock times:**
   - Pros: Ensures distinct unlock moments.
   - Cons: Adds unnecessary complexity.

### Recommendation:

- **Option 1:** Allow same unlock times.
- Rationale: The app already handles this correctly. There is no need to enforce uniqueness.

---

## 4. XSS / text rendering

### Problem:

- User input is rendered directly in JSX (`{letter.recipient}`, `{letter.content}`).
- React escapes text by default, but future support for rich text or HTML could introduce XSS risks.

### Options:

1. **Sanitize input before saving:**
   - Pros: Prevents malicious input from being stored.
   - Cons: Adds overhead, unnecessary for plain text.
2. **Validate input on render:**
   - Pros: Ensures safety at the point of use.
   - Cons: Redundant for plain text.

### Recommendation:

- **Option 1:** Sanitize input before saving.
- Rationale: This future-proofs the app against potential XSS risks if rich text or HTML is introduced later.

---

## 5. Principle violations

### Problem:

- `useLetters.ts` does not handle write failures, violating resilient side effect management.
- `useCountdown.ts` disables the `react-hooks/exhaustive-deps` warning, violating dependency discipline.

### Options:

1. **Fix both issues immediately:**
   - Pros: Aligns with best practices.
   - Cons: Requires additional effort.
2. **Fix `useLetters` now, defer `useCountdown`:**
   - Pros: Addresses the more critical issue first.
   - Cons: Leaves technical debt in `useCountdown`.

### Recommendation:

- **Option 2:** Fix `useLetters` now by adding `try/catch`. Defer the `useCountdown` refactor.
- Rationale: Write failures are more likely to impact users. The `useCountdown` issue is less critical and can be addressed later.

---

## Summary of Recommendations

1. Add `try/catch` around `localStorage.setItem(...)` to handle write failures.
2. Document the limitation of client clock dependency.
3. Allow same unlock times; no changes needed.
4. Sanitize user input before saving to prevent future XSS risks.
5. Fix `useLetters` side effect handling now; defer `useCountdown` refactor.

These recommendations balance immediate improvements with long-term maintainability.
