import { useState } from "react";
import { useLetters } from "./hooks/useLetters";
import type { Letter } from "./types/letter";
import Header from "./components/Header/Header";
import ComposeModal from "./components/ComposeModal/ComposeModal";
import LetterCard from "./components/LetterCard/LetterCard";
import styles from "./App.module.css";

export default function App() {
  const { letters, addLetter, deleteLetter } = useLetters();
  const [composing, setComposing] = useState(false);

  function handleAddLetter(draft: Omit<Letter, "id" | "createdAt">) {
    addLetter(draft);
  }

  const now = Date.now();
  const lockedCount = letters.filter(
    (l) => new Date(l.unlockAt).getTime() > now,
  ).length;
  const unlockedCount = letters.length - lockedCount;

  return (
    <div className={styles.app}>
      <Header onCompose={() => setComposing(true)} />

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

      {composing && (
        <ComposeModal
          onClose={() => setComposing(false)}
          onSubmit={handleAddLetter}
        />
      )}
    </div>
  );
}
