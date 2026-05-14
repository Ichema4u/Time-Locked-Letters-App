# Five Statements, One Lie

Here are five new statements, one of which is a lie. The lie is identified and explained below:

1. The `CountdownDisplay` component in the app dynamically updates the time left until a letter unlocks.
2. The `ComposeModal` component allows users to schedule letters to be sent to the past.
3. The `Header` component contains the app's title and a navigation menu.
4. The `useCountdown` hook calculates the remaining time until a specific date.
5. The `LetterCard` component displays letters with their unlock status and allows editing after they are unlocked.

## The Lie

**Statement 2: The `ComposeModal` component allows users to schedule letters to be sent to the past.**

### Explanation

This is the lie because the `ComposeModal` component is designed to schedule letters for future delivery, not to the past. The app's functionality revolves around time-locked letters that unlock at a specified future date, and there is no feature to send letters to the past.
