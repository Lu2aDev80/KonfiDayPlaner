import React, { useState, useEffect } from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className, 
  style 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 480);
      setIsTablet(window.innerWidth >= 480 && window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const responsiveStyle: React.CSSProperties = {
    ...style,
    padding: isMobile ? '0.5rem' : isTablet ? '0.75rem' : '1rem',
    gap: isMobile ? '0.5rem' : isTablet ? '0.75rem' : '1rem',
    fontSize: isMobile ? '0.9rem' : '1rem'
  };

  return (
    <div 
      className={className} 
      style={responsiveStyle}
      data-mobile={isMobile}
      data-tablet={isTablet}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;