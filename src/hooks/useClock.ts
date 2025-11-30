import { useEffect, useState } from 'react';

export function useClock(enabled: boolean) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [enabled]);
  return currentTime;
}
