import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import FlipchartBackground from '../components/layout/FlipchartBackground';
import styles from './Admin.module.css';

const Admin: React.FC = () => {
  const location = useLocation();
  const isRootAdmin = location.pathname === "/admin";

  return (
    <div className={styles.adminWrapper} role="main" aria-label="Admin Bereich">
      <FlipchartBackground />

      <main className={styles.adminContent}>
        {isRootAdmin ? (
          // Redirect to login page for organization selection
          <Navigate to="/login" replace />
        ) : (
          // Show dashboard content
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Admin;
