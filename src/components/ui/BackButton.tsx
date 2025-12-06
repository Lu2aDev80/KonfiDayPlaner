import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string; // Optional: specific path to navigate to
  label?: string; // Optional: custom button text
  style?: React.CSSProperties; // Optional: custom styles
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = 'Zurück',
  style = {}
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back in history
    }
  };

  return (
    <button
      onClick={handleClick}
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
        boxShadow: '2px 4px 0 #e5e7eb',
        ...style,
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
      {label}
    </button>
  );
};

export default BackButton;
