# Time-Locked Letters — Implementation Plan

A single-page React + Vite + TypeScript app where users write letters to recipients that unlock on a future date/time. Letters are persisted in `localStorage` and display countdowns when locked, then reveal their content when unlocked.

---

## Colour Palette

| Role | Colour | Value |
|---|---|---|
| Primary | Army/Forest Green | `#3B5323` |
| Primary Light | Sage Green | `#6B8F5E` |
| Background | Milk / Cream | `#F8F4E9` |
| Surface | Off-white | `#EDE9DC` |
| Accent | Warm Amber | `#C9860C` |
| Danger | Terracotta | `#B5451B` |
| Text Dark | Charcoal | `#2A2A2A` |

---

## App Architecture

```
src/
├── types/
│   └── letter.ts           # Letter interface
├── hooks/
│   └── useLetters.ts       # localStorage read/write + CRUD
│   └── useCountdown.ts     # Live countdown ticker
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   ├── ComposeModal/
│   │   ├── ComposeModal.tsx   # Modal form to write a letter
│   │   └── ComposeModal.module.css
│   ├── LetterCard/
│   │   ├── LetterCard.tsx     # Single card — locked or unlocked view
│   │   └── LetterCard.module.css
│   └── CountdownDisplay/
│       ├── CountdownDisplay.tsx
│       └── CountdownDisplay.module.css
├── App.tsx
├── App.module.css
└── main.tsx
```

---

## Data Model

```ts
interface Letter {
  id: string;           // crypto.randomUUID()
  recipient: string;
  content: string;
  unlockAt: string;     // ISO 8601 string (future datetime chosen by user)
  createdAt: string;    // ISO 8601 string (time of saving)
}
```

Stored under the localStorage key `"time_locked_letters"` as a JSON array.

---

## Proposed Changes

### Bootstrap — Vite project
#### [NEW] Scaffold via `npx create-vite@latest ./ --template react-ts`
- Run inside the `Time-Locked Letters/` directory
- Then install `date-fns` for readable countdown formatting

---

### `src/types/letter.ts` [NEW]
- Exports the `Letter` interface above

---

### `src/hooks/useLetters.ts` [NEW]
- Reads initial state from `localStorage.getItem("time_locked_letters")`
- Provides `letters`, `addLetter(draft)`, `deleteLetter(id)`
- Persists via `useEffect` on every change

---

### `src/hooks/useCountdown.ts` [NEW]
- Accepts an ISO date string
- Uses `setInterval` (1 s tick) to return `{ days, hours, minutes, seconds, isUnlocked }`
- Cleans up interval when `isUnlocked` becomes true

---

### `src/components/Header/Header.tsx` [NEW]
- App title + "Write a Letter" CTA button
- Glassmorphism strip on the cream background

---

### `src/components/ComposeModal/ComposeModal.tsx` [NEW]
- Controlled form: recipient name, textarea (letter content), datetime-local picker (min = now+1 min)
- Validates all fields non-empty and unlock date is in the future
- On submit: calls `addLetter` and closes modal
- Animated slide-in/fade-in on open

---

### `src/components/LetterCard/LetterCard.tsx` [NEW]
- **Locked state**: Shows 🔒 icon, recipient name, "Sent on" date, live countdown via `useCountdown`
- **Unlocked state**: Shows 📬 icon, full letter content with a `reveal` CSS animation (fade + slight upward translate), plus delete button
- Green border accent for unlocked, muted for locked
- Delete button (terracotta) with confirmation

---

### `src/App.tsx` [MODIFY]
- Renders `<Header>` with `onCompose` toggle
- Conditionally renders `<ComposeModal>`
- Maps `letters` → `<LetterCard>` in a responsive CSS grid
- Empty state illustration / text when no letters exist

---

### `src/index.css` [MODIFY]
- CSS custom properties for the full colour palette and typography tokens
- `@import url(Google Fonts — Playfair Display + Inter)`
- Base reset

---

## Verification Plan

### Automated
- Run `npm run build` — must complete with zero TypeScript errors

### Manual (browser)
1. Compose a letter with a date 30 seconds in the future → confirm countdown appears
2. Wait for unlock → confirm reveal animation fires
3. Refresh page → letter still present (localStorage)
4. Delete a letter → card disappears
5. Compose with blank fields → validation error shown
6. Compose with a past date → validation error shown
