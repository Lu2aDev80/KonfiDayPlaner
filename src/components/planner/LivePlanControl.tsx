import React from "react";
import { Clock, Edit2, Pen, Send } from "lucide-react";
import styles from "../../pages/Admin.module.css";
import ActionButton from "../ui/ActionButton";

interface DisplayInfo {
  id: string;
  name: string;
}

interface LivePlanControlProps {
  isConnected: boolean;
  onDelay: () => void;
  onSendUpdate: () => void;
  delayActive: boolean;
  displays?: DisplayInfo[];
  planName?: string;
  eventName?: string;
  compactMode?: boolean;
}

const cardStyle = {
  background: "#fff",
  borderRadius: "1.2rem 1.35rem 1.15rem 1.25rem",
  boxShadow: "2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)",
  padding: "2rem",
  border: "2px solid #181818",
  position: "relative" as const,
  transform: "rotate(-0.2deg)",
};

const LivePlanControl: React.FC<LivePlanControlProps> = ({
  isConnected,
  onDelay,
  onSendUpdate,
  delayActive,
  displays = [],
  planName,
  eventName,
  compactMode = false,
}) => {
  if (!isConnected) return null;
  return (
    <div style={{
      ...cardStyle,
      padding: compactMode ? "1rem" : "2rem",
      minWidth: compactMode ? "260px" : "340px",
      fontSize: compactMode ? "0.95rem" : "1.1rem",
    }}>
      <div className={styles.tape} />
      <div style={{ display: "flex", flexDirection: "column", gap: compactMode ? "0.3rem" : "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Clock size={compactMode ? 20 : 28} color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: compactMode ? "1rem" : "1.1rem", color: "#78350f" }}>
              Live-Plan Steuerung
            </span>
          </div>
          {!compactMode && (
            <ActionButton
              onClick={() => navigate("/documentation")}
              icon={<Pen size={20} />}
              color="#fa3f48ff"
            >
              Live Plan Bearbeiten
            </ActionButton>
          )}
        </div>
        {displays.length > 0 && (
          <div style={{ fontSize: compactMode ? "0.95rem" : "1rem", color: "#78350f", fontWeight: 600 }}>
            Verbundene Displays:
            <ul style={{ margin: "0.3rem 0 0 0.5rem", padding: 0 }}>
              {displays.map((d) => (
                <li key={d.id} style={{ listStyle: "disc", marginLeft: "1rem" }}>
                  {d.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {planName && (
          <div style={{ fontSize: compactMode ? "0.95rem" : "1rem", color: "#78350f", fontWeight: 600 }}>
            Plan: {planName}
          </div>
        )}
        {eventName && (
          <div style={{ fontSize: compactMode ? "0.95rem" : "1rem", color: "#78350f", fontWeight: 600 }}>
            Veranstaltung: {eventName}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePlanControl;
