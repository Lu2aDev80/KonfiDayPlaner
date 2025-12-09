import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  color?: string;
  borderStyle?: string;
  title?: string;
  extraStyles?: React.CSSProperties;
  disabled?: boolean;
  badge?: React.ReactNode;
}

const defaultStyle: React.CSSProperties = {
  padding: "clamp(0.875rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)",
  border: "2px solid #181818",
  borderRadius: "8px",
  fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
  fontWeight: 700,
  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
  backgroundColor: "#fbbf24",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  transition: "all 0.2s ease",
  boxShadow: "2px 4px 0 #181818",
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
  outline: "none",
  position: "relative",
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  children,
  color = "#fbbf24",
  borderStyle = "solid",
  title,
  extraStyles = {},
  disabled = false,
  badge,
}) => {
  const [hover, setHover] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...defaultStyle,
        backgroundColor: color,
        border: `2px ${borderStyle} #181818`,
        boxShadow: hover ? "3px 6px 0 #181818" : "2px 4px 0 #181818",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        opacity: disabled ? 0.6 : 1,
        ...extraStyles,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      title={title}
    >
      {icon}
      {children}
      {badge && (
        <span style={{ marginLeft: "0.7rem", position: "relative" }}>{badge}</span>
      )}
    </button>
  );
};

export default ActionButton;
