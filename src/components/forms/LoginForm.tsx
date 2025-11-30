import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogIn, ChevronDown, Mail, Lock } from 'lucide-react';
import styles from '../../pages/Admin.module.css';

interface Organisation {
  id: string;
  name: string;
  description: string;
}

interface LoginFormProps {
  organisations: Organisation[];
}

const LoginForm: React.FC<LoginFormProps> = ({ organisations }) => {
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', { selectedOrg, email, password });
    // Navigate to dashboard after successful login
    navigate('/admin/dashboard');
  };

  const isFormValid = selectedOrg && email && password;

  return (
    <div className={styles.adminCard} style={{ width: '100%' }}>
      <div className={styles.tape} aria-hidden="true"></div>
      <h2 className={styles.cardTitle}>
        <LogIn size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Anmeldung
      </h2>
      <form onSubmit={handleLogin} className={styles.cardContent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Organization Dropdown */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="organization" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#181818'
            }}>
              <Users size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Organisation
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="organization"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                  border: '2px solid #181818',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  backgroundColor: '#fff',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Organisation auswählen...</option>
                {organisations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <ChevronDown 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  right: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  pointerEvents: 'none',
                  color: '#181818'
                }} 
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#181818'
            }}>
              <Mail size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@beispiel.de"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #181818',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                backgroundColor: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#181818'
            }}>
              <Lock size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Passwort
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Passwort eingeben"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #181818',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                backgroundColor: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '2px solid #181818',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              backgroundColor: isFormValid ? '#fbbf24' : '#e5e7eb',
              color: isFormValid ? '#fff' : '#888',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: isFormValid ? '2px 4px 0 #181818' : 'none',
              transform: 'translateY(0)',
              letterSpacing: '0.02em'
            }}
            onMouseDown={(e) => {
              if (isFormValid) {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '0px 2px 0 #181818';
              }
            }}
            onMouseUp={(e) => {
              if (isFormValid) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '2px 4px 0 #181818';
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '2px 4px 0 #181818';
              }
            }}
          >
            Anmelden
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;