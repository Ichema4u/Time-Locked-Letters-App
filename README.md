# Time-Locked Letters

A single-page React + Vite + TypeScript app for writing letters that stay sealed until a chosen future date and time. Letters persist in `localStorage`, show a live countdown while locked, and reveal the message when unlocked.

## Features

- Create letters with recipient, message, and unlock date/time
- Persist letters in `localStorage` under `time_locked_letters`
- Locked cards show a live countdown
- Unlocked letters reveal content with a subtle animation
- Delete letters with confirmation
- Responsive layout and polished UI using a custom colour palette

## Project structure

- `src/types/letter.ts` — `Letter` interface
- `src/hooks/useLetters.ts` — localStorage CRUD and state management
- `src/hooks/useCountdown.ts` — live countdown ticker
- `src/components/Header/` — app header and compose CTA
- `src/components/ComposeModal/` — modal form for new letters
- `src/components/LetterCard/` — locked/unlocked letter card
- `src/components/CountdownDisplay/` — countdown display UI
- `src/App.tsx` — app shell and letter grid
- `src/index.css` — design tokens, typography, reset, and animations

## Setup

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

The app builds with TypeScript and Vite without errors.

## Manual verification

1. Compose a letter with a future date/time.
2. Confirm the locked card shows a countdown.
3. Wait for the unlock time and confirm the letter content reveals.
4. Refresh the page and confirm the letter still exists.
5. Delete a letter and confirm it disappears.
6. Use blank fields or a past date to verify validation messages.

## Notes

- The app uses `date-fns` for readable date formatting.
- The letter unlock time is stored as an ISO 8601 string.
- The countdown updates every second and stops once unlocked.
