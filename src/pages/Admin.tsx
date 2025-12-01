import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import FlipchartBackground from '../components/layout/FlipchartBackground';
import styles from './Admin.module.css';

const Admin: React.FC = () => {
  const location = useLocation();
  const isRootAdmin =
    location.pathname === "/admin" || location.pathname === "/login";
  const isDashboard =
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/login/dashboard");

  return (
    <div className={styles.adminWrapper} role="main" aria-label="Admin Bereich">
      <FlipchartBackground />

      <main className={styles.adminContent}>
        {isRootAdmin ? (
          // Redirect to organization selection
          <Navigate
            to={
              location.pathname === "/login" ? "/login/select" : "/admin/select"
            }
            replace
          />
        ) : isDashboard ? (
          // Show dashboard without card wrapper
          <Outlet />
        ) : (
          // Show outlet content for specific routes with card
          <div className={styles.adminCard}>
            <div className={styles.tape} aria-hidden="true"></div>
            <div className={styles.cardContent}>
              <Outlet />
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerIcon} aria-hidden="true">
          <Settings size={16} />
        </span>
        <span>Handgezeichneter Admin Bereich</span>
      </footer>
    </div>
  );
};

export default Admin;
