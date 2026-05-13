import { useCountdown } from '../../hooks/useCountdown';
import styles from './CountdownDisplay.module.css';

interface CountdownDisplayProps {
  unlockAt: string;
}

export default function CountdownDisplay({ unlockAt }: CountdownDisplayProps) {
  const { days, hours, minutes, seconds, isUnlocked } = useCountdown(unlockAt);

  if (isUnlocked) {
    return <p className={styles.unlocked}>This letter is now open</p>;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={styles.countdown}>
      <div className={styles.unit}>
        <span className={styles.number}>{pad(days)}</span>
        <span className={styles.label}>Days</span>
      </div>
      <div className={styles.unit}>
        <span className={styles.number}>{pad(hours)}</span>
        <span className={styles.label}>Hrs</span>
      </div>
      <div className={styles.unit}>
        <span className={styles.number}>{pad(minutes)}</span>
        <span className={styles.label}>Min</span>
      </div>
      <div className={styles.unit}>
        <span className={styles.number}>{pad(seconds)}</span>
        <span className={styles.label}>Sec</span>
      </div>
    </div>
  );
}
