import { useEffect, useRef } from 'react';
import type { ScheduleItem } from '../types/schedule';

function parseTimeToDate(base: Date, time: string) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

function getCurrentIndex(schedule: ScheduleItem[], now: Date): number {
  for (let i = 0; i < schedule.length; i++) {
    const start = parseTimeToDate(now, schedule[i].time);
    const next = schedule[i + 1];
    if (!next) {
      if (now >= start) return i;
    } else {
      const nextStart = parseTimeToDate(now, next.time);
      if (now >= start && now < nextStart) return i;
    }
  }
  return 0;
}

export function useAutoCenter(autoCenter: boolean, schedule: ScheduleItem[], currentTime: Date, cardRefs: React.MutableRefObject<HTMLElement[]>) {
  const initialCenterDone = useRef(false);
  useEffect(() => {
    if (!autoCenter || schedule.length === 0) return;
    if (initialCenterDone.current) {
      if (currentTime.getSeconds() !== 0) return;
    } else {
      initialCenterDone.current = true;
    }
    const idx = getCurrentIndex(schedule, currentTime);
    const el = cardRefs.current[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetScroll = rect.top + window.scrollY - (window.innerHeight / 2 - rect.height / 2);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [autoCenter, schedule, currentTime]);
}
