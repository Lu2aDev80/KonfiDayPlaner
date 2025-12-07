import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string; // Optional: specific path to navigate to
  label?: string; // Optional: custom button text
  style?: React.CSSProperties; // Optional: custom styles
  iconOnly?: boolean; // render only the icon in compact mode
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = 'Zurück',
  style = {},
  iconOnly = false,
  className
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back in history
    }
  };

  const baseStyle: React.CSSProperties = iconOnly ? {
    padding: '0.4rem',
    border: '2px solid var(--color-ink)',
    borderRadius: '8px',
    width: '2.4rem',
    height: '2.4rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-paper)',
    color: 'var(--color-ink)',
    cursor: 'pointer',
    boxShadow: '2px 4px 0 #e5e7eb',
    transition: 'transform 0.15s, box-shadow 0.15s',
  } : {
    padding: '0.625rem 1rem',
    border: '2px solid var(--color-ink)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    backgroundColor: 'var(--color-paper)',
    color: 'var(--color-ink)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '2px 4px 0 #e5e7eb',
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      style={{ ...baseStyle, ...style }}
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
      {!iconOnly && label}
    </button>
  );
};

export default BackButton;
