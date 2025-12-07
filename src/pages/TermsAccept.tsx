import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AGB from './AGB';
import DSGVO from './DSGVO';

// Accept both AGB and DSGVO and store acceptance per user in localStorage
const TermsAccept: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect = searchParams.get('redirect') || '/';
  const userId = searchParams.get('userId') || 'guest';

  const STORAGE_KEY = `accepted_terms_${userId}`;

  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setAccepted(true);
  }, [STORAGE_KEY]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    try {
      const dest = decodeURIComponent(redirect);
      navigate(dest);
    } catch {
      navigate(redirect);
    }
  };

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto 1.5rem' }}>
        <h1 style={{ fontFamily: 'Gloria Hallelujah, Caveat, sans-serif', fontSize: '2rem' }}>Bitte AGB und Datenschutzerklärung akzeptieren</h1>
        <p style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>Um fortzufahren, bestätige bitte, dass du unsere AGB und Datenschutzerklärung gelesen und akzeptiert hast.</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
        <AGB />
        <DSGVO />

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
            <span style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>Ich habe die AGB und Datenschutzerklärung gelesen und akzeptiere sie.</span>
          </label>

          <button
            disabled={!accepted}
            onClick={handleAccept}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 8,
              border: '2px solid var(--color-ink)',
              background: 'var(--color-amber-700)',
              color: 'var(--color-paper)',
              fontWeight: 700,
              cursor: accepted ? 'pointer' : 'not-allowed'
            }}
          >
            Akzeptieren und Fortfahren
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAccept;
