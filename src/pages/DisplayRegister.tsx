import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, QrCode, Hash, RefreshCw, CheckCircle } from 'lucide-react';
import FlipchartBackground from '../components/layout/FlipchartBackground';
import styles from './Admin.module.css';

const DisplayRegister: React.FC = () => {
  const navigate = useNavigate();
  
  const generateNewCode = () => {
    // Generate a 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const [displayCode, setDisplayCode] = useState(() => generateNewCode());

  const handleGenerateNewCode = () => {
    setDisplayCode(generateNewCode());
  };

  return (
    <div className={styles.adminWrapper} role="main" aria-label="Display registrieren">
      <FlipchartBackground />
      
      <main className={styles.adminContent} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '2rem',
        padding: '2rem 1rem'
      }}>
        {/* Back Button */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.625rem 1rem',
              border: '2px solid #181818',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              backgroundColor: '#fff',
              color: '#181818',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: '2px 4px 0 #e5e7eb'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '3px 6px 0 #e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '2px 4px 0 #e5e7eb';
            }}
          >
            <ArrowLeft size={16} />
            Zurück
          </button>
        </div>

        {/* Main Card */}
        <div style={{
          background: '#fff',
          borderRadius: '1.2rem 1.35rem 1.15rem 1.25rem',
          boxShadow: '2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)',
          padding: '2.5rem 2rem',
          border: '2px solid #181818',
          width: '100%',
          maxWidth: '600px',
          position: 'relative',
          transform: 'rotate(-0.3deg)',
          zIndex: 1
        }}>
          {/* Tape */}
          <div className={styles.tape} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '2px solid #181818',
              boxShadow: '2px 4px 0 #181818'
            }}>
              <Monitor size={36} color="#0284c7" strokeWidth={2.5} />
            </div>

            <h1 style={{ 
              fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.2rem)',
              fontWeight: '800',
              color: '#181818',
              marginBottom: '0.75rem',
              letterSpacing: '0.01em',
              textShadow: '1px 2px 0 #fff, 0 2px 8px #38bdf8'
            }}>
              Display registrieren
            </h1>
            
            <p style={{ 
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              color: '#4a5568',
              lineHeight: '1.6'
            }}>
              Aktiviere dieses Gerät als Display für deine Organisation
            </p>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#181818',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={20} color="#f59e0b" />
              Aktivierung in 2 Schritten
            </h3>
            <ol style={{
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              fontSize: '0.95rem',
              color: '#4a5568',
              lineHeight: '1.6',
              paddingLeft: '1.5rem',
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Scanne den QR-Code mit deinem Handy oder gib den Code manuell ein
              </li>
              <li>
                Wähle deine Organisation aus und bestätige die Aktivierung
              </li>
            </ol>
          </div>

          {/* QR Code Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#181818'
            }}>
              <QrCode size={20} color="#0284c7" />
              QR-Code scannen
            </div>

            {/* Placeholder for QR Code - In real app, use a QR code library */}
            <div style={{
              width: '240px',
              height: '240px',
              border: '3px solid #181818',
              borderRadius: '12px',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '3px 6px 0 #181818',
              position: 'relative'
            }}>
              {/* Mock QR Code Pattern */}
              <div style={{
                width: '200px',
                height: '200px',
                background: `
                  repeating-linear-gradient(
                    0deg,
                    #181818 0px,
                    #181818 10px,
                    transparent 10px,
                    transparent 20px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    #181818 0px,
                    #181818 10px,
                    transparent 10px,
                    transparent 20px
                  )
                `,
                opacity: 0.9
              }} />
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#dbeafe',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #181818'
              }}>
                <QrCode size={32} color="#0284c7" strokeWidth={2.5} />
              </div>
            </div>

            <p style={{
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              fontSize: '0.85rem',
              color: '#9ca3af',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Im Production-Build wird hier ein echter QR-Code angezeigt
            </p>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '2rem 0',
            color: '#9ca3af',
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <div style={{ flex: 1, height: '2px', backgroundColor: '#e5e7eb' }} />
            ODER
            <div style={{ flex: 1, height: '2px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Display Code Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#181818'
            }}>
              <Hash size={20} color="#0284c7" />
              Code manuell eingeben
            </div>

            <div style={{
              backgroundColor: '#f3f4f6',
              border: '3px solid #181818',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              boxShadow: '3px 6px 0 #181818'
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", "Courier New", monospace',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '800',
                color: '#0284c7',
                letterSpacing: '0.2em',
                textAlign: 'center'
              }}>
                {displayCode}
              </div>
            </div>

            <button
              onClick={handleGenerateNewCode}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #181818',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                backgroundColor: '#fff',
                color: '#181818',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: '2px 4px 0 #e5e7eb',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '3px 6px 0 #e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '2px 4px 0 #e5e7eb';
              }}
            >
              <RefreshCw size={16} />
              Neuen Code generieren
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem 1.2rem 1.1rem 1.15rem',
          boxShadow: '2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)',
          padding: '1.5rem',
          border: '2px solid #181818',
          width: '100%',
          maxWidth: '600px',
          transform: 'rotate(0.3deg)'
        }}>
          <h3 style={{
            fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#181818',
            marginBottom: '1rem'
          }}>
            Was passiert nach der Aktivierung?
          </h3>
          <ul style={{
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            fontSize: '0.95rem',
            color: '#4a5568',
            lineHeight: '1.7',
            paddingLeft: '1.5rem',
            margin: 0
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Das Display wird deiner Organisation zugeordnet
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Aktuelle Tagespläne werden automatisch angezeigt
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Updates werden in Echtzeit synchronisiert
            </li>
            <li>
              Das Display kann jederzeit über das Admin-Panel verwaltet werden
            </li>
          </ul>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <span className={styles.footerIcon} aria-hidden="true">
          <Monitor size={16} />
        </span>
        <span>Display-Aktivierung – KonfiDayPlaner</span>
      </footer>
    </div>
  );
};

export default DisplayRegister;
