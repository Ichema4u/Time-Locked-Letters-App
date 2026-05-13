# Time-Locked Letters: Line-by-Line Explanation for Kids

This explanation helps a seven-year-old understand the code. It focuses on the important parts like `useEffect`, `localStorage`, and date comparisons.

## 1. `src/hooks/useLetters.ts`

This file is like a little memory box for letters. It keeps track of all the letters and saves them in the browser.

```ts
import { useState, useEffect } from "react";
import type { Letter } from "../types/letter";
```

- We bring in two helpers from React: `useState` and `useEffect`.
- `useState` is like a special box that remembers things.
- `useEffect` is like a helper that runs when things change.
- We also bring in the shape of a `Letter` so TypeScript knows what a letter should look like.

```ts
const STORAGE_KEY = "time_locked_letters";
```

- This is the secret name we use to store letters in the browser’s storage.
- Think of it like a label on a jar: `time_locked_letters`.

```ts
function loadFromStorage(): Letter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Letter[];
  } catch {
    return [];
  }
}
```

- `loadFromStorage` is a function that looks inside the browser’s storage for saved letters.
- `localStorage.getItem(STORAGE_KEY)` asks the browser: “Do you have something saved with this name?”
- If nothing is saved, `raw` is empty and we return an empty list `[]`.
- If something is saved, `JSON.parse(raw)` turns the saved text back into a list of letters.
- The `try` and `catch` are like saying: “Try opening the box. If it’s broken, just return an empty list.”

```ts
export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>(() => loadFromStorage());
```

- We create a special box called `letters` that holds the letter list.
- `setLetters` is the way to put new letters into that box.
- `useState(() => loadFromStorage())` means: when the app starts, first check the browser storage and use those letters.
- This is important because it makes sure the saved letters come back even after you refresh the page.

```ts
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}, [letters]);
```

- This is the special helper that runs when `letters` changes.
- `useEffect` means: “Do this after the screen updates.”
- Inside, `localStorage.setItem` saves the letters back to the browser.
- `JSON.stringify(letters)` turns the letter list into text so the browser can store it.
- `[letters]` is the important part: it says “only run this saving step when letters change.”
- So when a new letter is added or one is deleted, this code saves the new list.

```ts
function addLetter(draft: Omit<Letter, "id" | "createdAt">) {
  const newLetter: Letter = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  setLetters((prev) => [newLetter, ...prev]);
}
```

- `addLetter` is the function that makes a new letter and adds it to the list.
- `draft` is the letter the person typed, but without an `id` or `createdAt` yet.
- `crypto.randomUUID()` gives the letter a unique name, like a secret code.
- `new Date().toISOString()` says exactly when the letter was created.
- `setLetters((prev) => [newLetter, ...prev])` puts the new letter at the front of the list.
- `prev` means the old letters that were already there.

```ts
function deleteLetter(id: string) {
  setLetters((prev) => prev.filter((l) => l.id !== id));
}
```

- `deleteLetter` removes a letter by its unique `id`.
- `prev.filter((l) => l.id !== id)` keeps every letter except the one with the matching id.

```ts
  return { letters, addLetter, deleteLetter };
}
```

- This gives other parts of the app access to the letters and the two actions: add and delete.

---

## 2. `src/hooks/useCountdown.ts`

This file helps count down the time until a letter can be opened.

```ts
import { useState, useEffect } from "react";

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUnlocked: boolean;
}
```

- We again bring in `useState` and `useEffect`.
- `CountdownResult` is a shape that tells us how much time is left and if the letter is unlocked.

```ts
export function useCountdown(unlockAt: string): CountdownResult {
  const getRemaining = (): CountdownResult => {
    const now = Date.now();
    const target = new Date(unlockAt).getTime();
    const diff = target - now;
```

- `useCountdown` gets the time the letter unlocks, as a string like `2026-05-13T12:00:00.000Z`.
- `Date.now()` is like asking the clock: “What time is it right now?” It returns a number.
- `new Date(unlockAt).getTime()` turns the unlock time into a number too.
- `diff = target - now` is the difference between the unlock time and now.
- If `diff` is positive, the unlock time is still in the future.
- If `diff` is zero or negative, the time has already arrived or passed.

```ts
if (diff <= 0) {
  return { days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true };
}
```

- This line checks if the letter can already be opened.
- `diff <= 0` means the unlock time is now or before now.
- If that is true, we say the letter is unlocked and the countdown is zero.

```ts
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isUnlocked: false };
  };
```

- This turns the leftover time into days, hours, minutes, and seconds.
- `86400` is how many seconds are in a day.
- `3600` is how many seconds are in an hour.
- `%` means “leftover after taking away whole days or hours.”
- That way we get the correct countdown numbers.

```ts
const [countdown, setCountdown] = useState<CountdownResult>(getRemaining);
```

- We make a box called `countdown` to remember the current countdown.
- It starts by running `getRemaining()` once.

```ts
useEffect(() => {
  if (countdown.isUnlocked) return;

  const interval = setInterval(() => {
    const next = getRemaining();
    setCountdown(next);
    if (next.isUnlocked) clearInterval(interval);
  }, 1000);

  return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [unlockAt]);
```

- This effect is what makes the countdown update every second.
- `if (countdown.isUnlocked) return;` means: if the letter is already unlocked, we don't need to keep counting.
- `setInterval(() => { ... }, 1000)` is like a timer that runs the code every 1 second.
- Each second, we get the new remaining time and update the countdown.
- If the letter becomes unlocked, we stop the timer with `clearInterval(interval)`.
- `return () => clearInterval(interval);` means: when the component stops showing this countdown, clean up the timer.
- `[unlockAt]` means this effect runs when the unlock time changes.

```ts
  return countdown;
}
```

- This gives the countdown result back to the component that needs it.

---

## 3. `src/App.tsx`

This is the main app screen. It shows the letters and the buttons.

```ts
import { useState } from "react";
import { useLetters } from "./hooks/useLetters";
import type { Letter } from "./types/letter";
import Header from "./components/Header/Header";
import ComposeModal from "./components/ComposeModal/ComposeModal";
import LetterCard from "./components/LetterCard/LetterCard";
import styles from "./App.module.css";
```

- We bring in `useState` to remember whether the compose modal is open.
- `useLetters` is our special hook from above that saves and loads letters.
- We import components for the header, the compose popup, and the letter cards.
- `styles` is the look and feel for the page.

```ts
export default function App() {
  const { letters, addLetter, deleteLetter } = useLetters();
  const [composing, setComposing] = useState(false);
```

- `App` is the main function for the app screen.
- `letters` is the list of saved letters.
- `addLetter` and `deleteLetter` are the tools to change the letter list.
- `composing` is a true/false value that says if the write-letter modal is open.

```ts
function handleAddLetter(draft: Omit<Letter, "id" | "createdAt">) {
  addLetter(draft);
}
```

- This function is called when someone submits a new letter.
- It just forwards the draft letter to `addLetter`.

```ts
const now = Date.now();
const lockedCount = letters.filter(
  (l) => new Date(l.unlockAt).getTime() > now,
).length;
const unlockedCount = letters.length - lockedCount;
```

- `now` is the current time as a number.
- `letters.filter(...)` looks at every letter and keeps only the ones that are still sealed.
- `new Date(l.unlockAt).getTime()` turns the unlock time into a number.
- `> now` means the unlock time is still in the future, so the letter is sealed.
- `.length` counts how many sealed letters there are.
- `unlockedCount` is just the total letters minus sealed letters.
- This is the date comparison part where the app decides if a letter is locked or unlocked.

```ts
  return (
    <div className={styles.app}>
      <Header onCompose={() => setComposing(true)} />
```

- We start drawing the app screen.
- The header gets a button that says “write a letter.” When clicked, `setComposing(true)` opens the compose modal.

```ts
      <main className={styles.main}>
        {letters.length > 0 && (
          <div className={styles.statsBar}>
            <span className={styles.stat}>
              <span className={`${styles.statDot} ${styles.statDotAll}`} />
              <span className={styles.statCount}>{letters.length}</span> total
            </span>
            <span className={styles.stat}>
              <span className={`${styles.statDot} ${styles.statDotLocked}`} />
              <span className={styles.statCount}>{lockedCount}</span> sealed
            </span>
            <span className={styles.stat}>
              <span className={`${styles.statDot} ${styles.statDotUnlocked}`} />
              <span className={styles.statCount}>{unlockedCount}</span> unlocked
            </span>
          </div>
        )}
```

- If there are letters, we show a little stats bar.
- It shows total letters, sealed letters, and unlocked letters.

```ts
        <div className={styles.grid}>
          {letters.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📮</span>
              <h2 className={styles.emptyTitle}>No letters yet</h2>
              <p className={styles.emptyText}>
                Write your first time-locked letter — a message that only
                reveals itself when the moment is right.
              </p>
              <button
                id="empty-compose-btn"
                className={styles.emptyBtn}
                onClick={() => setComposing(true)}
              >
                Write Your First Letter ✉️
              </button>
            </div>
          ) : (
            letters.map((letter, i) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                onDelete={deleteLetter}
                index={i}
              />
            ))
          )}
        </div>
      </main>
```

- If there are no letters, we show a friendly message and a button to write the first one.
- If there are letters, we show them using `LetterCard` components.
- `letters.map(...)` goes through each letter and draws a card for it.
- `key={letter.id}` helps React remember each card.

```ts
      {composing && (
        <ComposeModal
          onClose={() => setComposing(false)}
          onSubmit={handleAddLetter}
        />
      )}
    </div>
  );
}
```

- If `composing` is true, we show the write-letter popup.
- `onClose={() => setComposing(false)}` closes it.
- `onSubmit={handleAddLetter}` sends the new letter to the app.

---

## Big Ideas for Beginners

- `useEffect` is like a clean-up or update helper that runs when something changes. In `useLetters`, it saves letters to `localStorage` whenever the letter list changes.
- `localStorage` is a small area in the browser where the app can keep data. It remembers things even after the page is refreshed.
- `JSON.stringify` turns objects into text so the browser can store them. `JSON.parse` turns that text back into objects.
- Date comparisons use numbers from `Date.now()` and `new Date(...).getTime()`. If the unlock time is bigger than now, the letter is still sealed.
- `setInterval` in `useCountdown` runs code every second to update the timer. When the letter unlocks, it stops the timer.

## Extra Simple Summary

- `useLetters` loads saved letters and saves new ones.
- `useCountdown` watches the clock and tells the app if the letter is ready.
- `App.tsx` shows the letters and buttons on the screen.
- The app checks time with `now` and `unlockAt` so letters unlock only when the right day has arrived.
