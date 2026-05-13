import { useState } from "react";
import { format } from "date-fns";
import type { Letter } from "../../types/letter";
import { useCountdown } from "../../hooks/useCountdown";
import CountdownDisplay from "../CountdownDisplay/CountdownDisplay";
import styles from "./LetterCard.module.css";

interface LetterCardProps {
  letter: Letter;
  onDelete: (id: string) => void;
  index: number;
}

export default function LetterCard({
  letter,
  onDelete,
  index,
}: LetterCardProps) {
  const { isUnlocked } = useCountdown(letter.unlockAt);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sentOn = format(new Date(letter.createdAt), "MMM d, yyyy · h:mm a");
  const unlockOn = format(new Date(letter.unlockAt), "MMM d, yyyy · h:mm a");

  return (
    <article
      className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.recipientRow}>
          <span className={styles.statusIcon}>{isUnlocked ? "📬" : "🔒"}</span>
          <div>
            <p className={styles.recipientLabel}>To</p>
            <p className={styles.recipient}>{letter.recipient}</p>
          </div>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={() => setConfirmDelete(true)}
          aria-label="Delete letter"
          title="Delete"
        >
          🗑
        </button>
      </div>

      {/* Badge */}
      {isUnlocked ? (
        <span className={styles.unlockBadge}>✦ Unlocked</span>
      ) : (
        <span className={styles.lockBadge}>🔒 Sealed</span>
      )}

      {/* Meta */}
      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Sent {sentOn}
        </span>
        <span className={styles.metaDot} />
        <span className={styles.metaItem}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Opens {unlockOn}
        </span>
      </div>

      {/* Countdown or Content */}
      {isUnlocked ? (
        <div className={styles.contentWrap}>
          <div className={styles.contentDivider} />
          <p className={styles.contentLabel}>📖 Letter</p>
          <p className={styles.content}>{letter.content}</p>
        </div>
      ) : (
        <CountdownDisplay unlockAt={letter.unlockAt} />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className={styles.deleteConfirm}>
          <p className={styles.deleteConfirmText}>
            Delete this letter permanently?
          </p>
          <div className={styles.deleteConfirmActions}>
            <button
              className={styles.confirmNo}
              onClick={() => setConfirmDelete(false)}
            >
              Keep
            </button>
            <button
              className={styles.confirmYes}
              onClick={() => onDelete(letter.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
