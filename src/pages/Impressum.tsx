



import React from "react";
import { BackButton } from "../components/ui";
import { getLastNonLegalRoute } from "../hooks/useLastNonLegalRoute";
import FlipchartBackground from '../components/layout/FlipchartBackground';
import styles from './Admin.module.css';


const Impressum: React.FC = () => (
  <div className={styles.adminWrapper}>
    <FlipchartBackground />
    <main className={styles.adminContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.2rem 1.35rem 1.15rem 1.25rem',
        boxShadow: '2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)',
        padding: '2rem',
        border: '2px solid #181818',
        width: '100%',
        position: 'relative',
        transform: 'rotate(-0.3deg)',
        zIndex: 1
      }}>
        <div className={styles.tape} />
        <span style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
          <BackButton iconOnly to={getLastNonLegalRoute()} />
        </span>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1 style={{
            fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: '#181818',
            marginBottom: '0.5rem',
            letterSpacing: '0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            Impressum
          </h1>
          <p style={{ fontFamily: '"Inter", "Roboto", Arial, sans-serif', fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.6' }}>
            Luca Steinhagen<br />
            Am Frettholz 4<br />
            59929 Brilon<br />
            E-Mail: info@lu2adevelopment.de
          </p>
        </div>
      </div>
    </main>
  </div>
);

export default Impressum;
