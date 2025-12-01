import React from 'react';

// Direct imports for each gremlin
import loginGremlin from '../../assets/gremlins/login.png';
import successGremlin from '../../assets/gremlins/erfolg.png';
import loadingGremlin from '../../assets/gremlins/loadingbar.png';
import hideGremlin from '../../assets/gremlins/hide.png';
import sleepGremlin from '../../assets/gremlins/sleep.png';
import mailGremlin from '../../assets/gremlins/mail.png';
import maintanceGremlin from '../../assets/gremlins/maintance.png';
import downGremlin from '../../assets/gremlins/down.png';
import buyGremlin from '../../assets/gremlins/buy.png';
import error404Gremlin from '../../assets/gremlins/404.png';

const gremlins = {
  login: loginGremlin,
  success: successGremlin,
  loading: loadingGremlin,
  hide: hideGremlin,
  sleep: sleepGremlin,
  mail: mailGremlin,
  maintenance: maintanceGremlin,
  down: downGremlin,
  buy: buyGremlin,
  error404: error404Gremlin,
};

export type GremlinType = keyof typeof gremlins;

interface GremlinProps {
  type: GremlinType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

const GremlinComponent: React.FC<GremlinProps> = ({ 
  type, 
  size = 'medium', 
  className = '', 
  style = {},
  alt 
}) => {
  const sizeMap = {
    small: { width: '32px', height: '32px' },
    medium: { width: '64px', height: '64px' },
    large: { width: '128px', height: '128px' },
  };

  const defaultStyle: React.CSSProperties = {
    ...sizeMap[size],
    objectFit: 'contain',
    filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.1))',
    ...style,
  };

  return (
    <img
      src={gremlins[type]}
      alt={alt || `Gremlin ${type}`}
      className={className}
      style={defaultStyle}
    />
  );
};

export default GremlinComponent;