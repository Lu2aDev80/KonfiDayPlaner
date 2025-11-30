import React from 'react';
import styles from '../../pages/Admin.module.css';

const FlipchartBackground: React.FC = () => {
  return (
    <>
      {/* Flipchart holes */}
      <div className={styles.holeLeft} aria-hidden="true"></div>
      <div className={styles.holeCenter} aria-hidden="true"></div>
      <div className={styles.holeRight} aria-hidden="true"></div>
      
      {/* Torn edge */}
      <div className={styles.tornEdge} aria-hidden="true"></div>
      
      {/* Background doodles */}
      <div className={styles.doodleStar} aria-hidden="true"></div>
      <div className={styles.doodleCircle} aria-hidden="true"></div>
      <div className={styles.doodleSquiggle} aria-hidden="true"></div>
    </>
  );
};

export default FlipchartBackground;