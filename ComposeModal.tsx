import { useState, useRef, useEffect } from "react";
import type { Letter } from "../../types/letter";
import styles from "./ComposeModal.module.css";

interface ComposeModalProps {
  onClose: () => void;
  onSubmit: (draft: Omit<Letter, "id" | "createdAt">) => void;
}

export default function ComposeModal({ onClose, onSubmit }: ComposeModalProps) {
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [error, setError] = useState("");

  const recipientRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    recipientRef.current?.focus();
  }, []);

  // Close on backdrop click
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function getMinDatetime() {
    const now = new Date(Date.now() + 60 * 1000); // at least 1 minute ahead
    return now.toISOString().slice(0, 16);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!recipient.trim()) {
      setError("Please enter a recipient name.");
      return;
    }
    if (!content.trim()) {
      setError("Your letter is empty. Write something!");
      return;
    }
    if (!unlockAt) {
      setError("Please choose an unlock date and time.");
      return;
    }

    const unlockDate = new Date(unlockAt);
    if (unlockDate <= new Date()) {
      setError("The unlock date must be in the future.");
      return;
    }

    onSubmit({
      recipient: recipient.trim(),
      content: content.trim(),
      unlockAt: unlockDate.toISOString(),
    });
    onClose();
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-title"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="compose-title">
            ✍️ Write a Letter
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="recipient">
              To
            </label>
            <input
              ref={recipientRef}
              id="recipient"
              className={styles.input}
              type="text"
              placeholder="e.g. Future Me, Mum, Old Friend…"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="unlock-date">
              Unlock Date &amp; Time
            </label>
            <input
              id="unlock-date"
              className={styles.dateInput}
              type="datetime-local"
              min={getMinDatetime()}
              value={unlockAt}
              onChange={(e) => setUnlockAt(e.target.value)}
            />
            <span className={styles.hint}>
              The letter will be sealed until this moment.
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="letter-content">
              Your Letter
            </label>
            <textarea
              id="letter-content"
              className={styles.textarea}
              placeholder="Dear reader, by the time you open this…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="send-letter-btn"
              className={styles.submitBtn}
            >
              Seal &amp; Save ✉️
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
