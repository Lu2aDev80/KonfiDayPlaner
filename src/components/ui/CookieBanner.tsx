
import React, { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';

const COOKIE_KEY = 'cookieConsent';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.cookieBanner}>
      <span className={styles.cookieBanner__text}>
        Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern. Mit der Nutzung akzeptierst du unsere Cookies.
      </span>
      <button
        className={styles.cookieBanner__button}
        onClick={acceptCookies}
      >
        Akzeptieren
      </button>
    </div>
  );
};

export default CookieBanner;
