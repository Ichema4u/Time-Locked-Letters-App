import { useState, useEffect } from 'react';

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUnlocked: boolean;
}

export function useCountdown(unlockAt: string): CountdownResult {
  const getRemaining = (): CountdownResult => {
    const now = Date.now();
    const target = new Date(unlockAt).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isUnlocked: false };
  };

  const [countdown, setCountdown] = useState<CountdownResult>(getRemaining);

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

  return countdown;
}
