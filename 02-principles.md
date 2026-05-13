# Principles in Time-Locked Letters

This document identifies the core software principles used in the app, with source line references.

## 1. Persistence

- `localStorage` is used to save letters between page loads.
- Source: `src/hooks/useLetters.ts`
  - `loadFromStorage()` reads saved data from storage. (lines 006-013)
  - `useEffect(() => { localStorage.setItem(...) }, [letters]);` writes the current letters list back to storage whenever it changes. (lines 019-021)

Why it matters:

- Persistence keeps data alive even when the user closes or refreshes the browser.
- It turns temporary app state into long-lived storage.

## 2. Side Effects Management

- `useEffect` controls work that happens outside the normal render flow.
- Source: `src/hooks/useLetters.ts` and `src/hooks/useCountdown.ts`
  - Saving letters to `localStorage` is a side effect. It runs only when `letters` changes. (lines 019-021)
  - The countdown timer is a side effect. `setInterval` is created and cleared inside `useEffect`. (lines 032-043)

Why it matters:

- React components should describe UI, not perform external work during render.
- `useEffect` keeps effects separate from render logic and avoids repeated or stale behavior.

## 3. Single Source of Truth

- The `letters` state in `useLetters` is the one true list of letters.
- Source: `src/hooks/useLetters.ts`
  - `const [letters, setLetters] = useState<Letter[]>(() => loadFromStorage());` establishes the source of truth. (line 017)
  - `setLetters(...)` updates the list in one place. (lines 029, 033)

Why it matters:

- One canonical copy of data makes the app easier to reason about.
- Derived values like counts and UI display always come from the same `letters` state.

## 4. Derived State

- Some values are computed from other state rather than stored separately.
- Source: `src/App.tsx`
  - `lockedCount` is derived from `letters` by filtering based on unlock time. (lines 018-020)
  - `unlockedCount` is derived from the total minus `lockedCount`. (line 021)

Why it matters:

- Derived state reduces duplication and keeps data consistent.
- If the source changes, the derived values automatically update on the next render.

## 5. Separation of Concerns

- The code is split into focused pieces: data storage, countdown logic, and UI.
- Source:
  - `src/hooks/useLetters.ts` handles letter persistence and state logic.
  - `src/hooks/useCountdown.ts` handles date math and timer updates.
  - `src/App.tsx` handles rendering the page and wiring components together.

Why it matters:

- Each file has one main job, so the app is easier to maintain and change.
- Smaller pieces can be tested or updated independently.

## 6. Immutability

- The app updates state without modifying the old array directly.
- Source: `src/hooks/useLetters.ts`
  - `setLetters((prev) => [newLetter, ...prev]);` creates a new array for added letters. (line 029)
  - `setLetters((prev) => prev.filter((l) => l.id !== id));` creates a new filtered array for deletion. (line 033)

Why it matters:

- Immutable updates help React detect changes and avoid accidental bugs.
- It prevents older versions of the list from being mutated unexpectedly.

## 7. Declarative UI

- The app describes what should be shown rather than how to mutate the DOM.
- Source: `src/App.tsx`
  - JSX renders the letter list, stats bar, empty state, and modal conditionally. (lines 023-081)
  - `composing && <ComposeModal ... />` shows the modal only when needed. (lines 075-080)

Why it matters:

- Declarative code is easier to understand because it reads like a description of the UI.
- React handles the details of updating the DOM.

## 8. Encapsulation

- The hooks hide implementation details behind a simple interface.
- Source:
  - `useLetters()` returns `{ letters, addLetter, deleteLetter }`. (line 036)
  - `useCountdown(unlockAt)` returns a countdown object. (line 045)

Why it matters:

- Other components don’t need to know how letters are loaded or saved.
- This makes the rest of the app simpler and safer to change.
