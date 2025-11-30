import React from 'react';
import styles from './Planer.module.css';

interface ClockProps {
  time: Date;
}

const Clock: React.FC<ClockProps> = ({ time }) => {
  return (
    <aside className={styles.clockSide} aria-label="Aktuelle Uhrzeit Seitenanzeige">
      <span className={styles.clockLabel}>UHR</span>
      <span>{time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
    </aside>
  );
};

export default Clock;
