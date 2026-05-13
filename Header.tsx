import styles from './Header.module.css';

interface HeaderProps {
  onCompose: () => void;
}

export default function Header({ onCompose }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.icon}>✉️</span>
          <div>
            <h1 className={styles.title}>Time-Locked Letters</h1>
            <span className={styles.subtitle}>Messages from the past</span>
          </div>
        </div>

        <button id="compose-btn" className={styles.composeBtn} onClick={onCompose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Write a Letter</span>
        </button>
      </div>
    </header>
  );
}
