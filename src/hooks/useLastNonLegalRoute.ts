import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LEGAL_PATHS = ['/impressum', '/agb', '/dsgvo'];
const STORAGE_KEY = 'lastNonLegalRoute';

export function useLastNonLegalRouteTracker() {
  const location = useLocation();
  useEffect(() => {
    if (!LEGAL_PATHS.includes(location.pathname.toLowerCase())) {
      sessionStorage.setItem(STORAGE_KEY, location.pathname + location.search);
    }
  }, [location]);
}

export function getLastNonLegalRoute(): string {
  return sessionStorage.getItem(STORAGE_KEY) || '/';
}
