import React, { useState, useEffect } from "react";
import { Clock, Eye, Pen, Send, RefreshCw, Wifi, PowerOff } from "lucide-react";
import styles from "../../pages/Admin.module.css";
import ActionButton from "../ui/ActionButton";
import { api } from "../../lib/api";
import type { Display } from "../../types/display";

interface LivePlanControlProps {
  organisationId: string;
  selectedDayPlanId?: string | null;
  onDelay: (minutes: number) => void;
  onShowPlan: () => void;
  onEditPlan: () => void;
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "1.2rem 1.35rem 1.15rem 1.25rem",
  boxShadow: "2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)",
  padding: "2rem",
  border: "2px solid #181818",
  position: "relative",
  transform: "rotate(-0.2deg)",
};

const LivePlanControl: React.FC<LivePlanControlProps> = ({
  organisationId,
  selectedDayPlanId,
  onDelay,
  onShowPlan,
  onEditPlan,
}) => {
  const [displays, setDisplays] = useState<Display[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [sendingUpdate, setSendingUpdate] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  // Fetch active displays
  useEffect(() => {
    const fetchDisplays = async () => {
      if (!organisationId) return;
      setLoading(true);
      try {
        const allDisplays = await api.getDisplays(organisationId);
        console.log("All displays fetched:", allDisplays); // Debug log
        
        // Log each display's properties for debugging
        allDisplays.forEach((d, idx) => {
          console.log(`Display ${idx}:`, {
            name: d.name,
            id: d.id,
            organisationId: d.organisationId,
            status: d.status,
            statusType: typeof d.status,
            isActive: d.isActive
          });
        });
        
        // Filter for paired displays (matching DisplayManager logic)
        // A display is considered connected if it has an organisationId and status is PAIRED or ACTIVE
        const activeDisplays = allDisplays.filter(
          (d) => {
            const hasOrg = !!d.organisationId;
            // Accept both PAIRED and ACTIVE status (ACTIVE might be used in some flows)
            // Also handle case-insensitive comparison in case of string issues
            const statusStr = String(d.status).toUpperCase();
            const isPaired = statusStr === "PAIRED" || statusStr === "ACTIVE";
            const passes = hasOrg && isPaired;
            console.log(`Display ${d.name}: orgId=${hasOrg}, status="${d.status}" (${statusStr}), isPaired=${isPaired}, passes=${passes}`); // Debug log
            return passes;
          }
        );
        
        console.log("Filtered active displays:", activeDisplays); // Debug log
        console.log("Display count:", activeDisplays.length); // Debug log
        console.log("Setting displays state with count:", activeDisplays.length); // Debug log
        setDisplays(activeDisplays);
      } catch (error) {
        console.error("Failed to fetch displays:", error);
        setDisplays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisplays();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDisplays, 30000);
    return () => clearInterval(interval);
  }, [organisationId]);

  const handleSendUpdate = async () => {
    if (!selectedDayPlanId) {
      alert("Bitte wählen Sie zuerst einen Tagesplan aus.");
      return;
    }

    setSendingUpdate(true);
    try {
      // Update all active displays with the current day plan
      const updatePromises = displays.map((display) =>
        api.updateDisplay(display.id, {
          currentDayPlanId: selectedDayPlanId,
        })
      );

      await Promise.all(updatePromises);
      setLastUpdate(new Date());
      alert(`Update wurde an ${displays.length} Display(s) gesendet!`);
    } catch (error) {
      console.error("Failed to send update:", error);
      alert("Fehler beim Senden des Updates. Bitte versuchen Sie es erneut.");
    } finally {
      setSendingUpdate(false);
    }
  };

  const handleDisconnectDisplay = async (displayId: string) => {
    if (
      !window.confirm(
        "Sind Sie sicher, dass Sie dieses Display trennen möchten? Das Display wird deaktiviert."
      )
    ) {
      return;
    }

    setDisconnecting(displayId);
    try {
      await api.updateDisplay(displayId, { isActive: false });
      setDisplays((prev) => prev.filter((d) => d.id !== displayId));
      alert("Display wurde erfolgreich getrennt.");
    } catch (error) {
      console.error("Failed to disconnect display:", error);
      alert("Fehler beim Trennen des Displays.");
    } finally {
      setDisconnecting(null);
    }
  };

  const handleDisconnectAll = async () => {
    if (
      !window.confirm(
        `Sind Sie sicher, dass Sie alle ${displays.length} Display(s) trennen möchten?`
      )
    ) {
      return;
    }

    setDisconnecting("all");
    try {
      const promises = displays.map((display) =>
        api.updateDisplay(display.id, { isActive: false })
      );
      await Promise.all(promises);
      setDisplays([]);
      alert("Alle Displays wurden erfolgreich getrennt.");
    } catch (error) {
      console.error("Failed to disconnect displays:", error);
      alert("Fehler beim Trennen der Displays.");
    } finally {
      setDisconnecting(null);
    }
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return "Noch nicht gesendet";
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Gerade eben";
    if (minutes === 1) return "Vor 1 Minute";
    return `Vor ${minutes} Minuten`;
  };

  const displayCount = displays.length;
  const isConnected = displayCount > 0;
  
  // Debug logging for render
  console.log("Render - displays.length:", displays.length, "displayCount:", displayCount, "isConnected:", isConnected);

  // Show loading state
  if (loading) {
    return (
      <div style={cardStyle}>
        <div className={styles.tape} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            }}
          >
            Lädt Displays...
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div style={cardStyle}>
        <div className={styles.tape} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <Wifi size={48} color="#9ca3af" />
          <div
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            }}
          >
            Keine Displays verbunden
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#9ca3af",
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            }}
          >
            Verbinden Sie ein Display, um die Live-Plan Steuerung zu nutzen.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div className={styles.tape} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Clock size={28} color="#f59e0b" />
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#374151",
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              }}
            >
              Live-Plan Steuerung
            </span>
            <div
              style={{
                backgroundColor: "#10b981",
                color: "#fff",
                padding: "0.25rem 0.75rem",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              }}
            >
              LIVE
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                border: "2px solid #181818",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                cursor: "pointer",
                boxShadow: "2px 3px 0 #181818",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "3px 4px 0 #181818";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "2px 3px 0 #181818";
              }}
            >
              <Wifi size={18} />
              <span>{displayCount} Display{displayCount !== 1 ? "s" : ""}</span>
            </button>
            {displayCount > 0 && (
              <button
                onClick={handleDisconnectAll}
                disabled={disconnecting === "all"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  border: "2px solid #181818",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  cursor: disconnecting === "all" ? "not-allowed" : "pointer",
                  boxShadow: "2px 3px 0 #181818",
                  transition: "all 0.2s ease",
                  opacity: disconnecting === "all" ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (disconnecting !== "all") {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "3px 4px 0 #181818";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "2px 3px 0 #181818";
                }}
                title="Alle Displays trennen"
              >
                <PowerOff size={16} />
                <span>Trennen</span>
              </button>
            )}
          </div>
        </div>

        {/* Zeitverzögerung Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#374151",
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            }}
          >
            Zeitverzögerung:
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            {[5, 10, 15].map((minutes) => (
              <button
                key={minutes}
                onClick={() => onDelay(minutes)}
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "#fef3c7",
                  color: "#374151",
                  border: "2px solid #181818",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  cursor: "pointer",
                  boxShadow: "2px 3px 0 #181818",
                  transition: "all 0.2s ease",
                  flex: "1 1 auto",
                  minWidth: "100px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "3px 4px 0 #181818";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "2px 3px 0 #181818";
                }}
              >
                +{minutes} Min
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          {/* Plan Anzeigen */}
          <ActionButton
            onClick={onShowPlan}
            icon={<Eye size={20} />}
            color="#dbeafe"
            extraStyles={{
              color: "#1e40af",
              fontSize: "0.95rem",
            }}
          >
            Plan Anzeigen
          </ActionButton>

          {/* Plan Bearbeiten */}
          <ActionButton
            onClick={onEditPlan}
            icon={<Pen size={20} />}
            color="#fce7f3"
            extraStyles={{
              color: "#be185d",
              fontSize: "0.95rem",
            }}
          >
            Plan Bearbeiten
          </ActionButton>

          {/* Update Senden */}
          <ActionButton
            onClick={handleSendUpdate}
            icon={<Send size={20} />}
            color="#d1fae5"
            disabled={sendingUpdate || !selectedDayPlanId}
            extraStyles={{
              color: "#065f46",
              fontSize: "0.95rem",
            }}
          >
            {sendingUpdate ? "Wird gesendet..." : "Update Senden"}
          </ActionButton>

          {/* Aktualisieren */}
          <ActionButton
            onClick={() => window.location.reload()}
            icon={<RefreshCw size={20} />}
            color="#e9d5ff"
            extraStyles={{
              color: "#6b21a8",
              fontSize: "0.95rem",
            }}
          >
            Aktualisieren
          </ActionButton>
        </div>

        {/* Connected Displays List */}
        {displays.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#374151",
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              }}
            >
              Verbundene Displays:
            </div>
            {displays.map((display) => (
              <div
                key={display.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: display.socketId ? "#10b981" : "#ef4444",
                    }}
                  />
                  <span style={{ color: "#374151", fontWeight: 500 }}>
                    {display.name}
                  </span>
                </div>
                <button
                  onClick={() => handleDisconnectDisplay(display.id)}
                  disabled={disconnecting === display.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    padding: "0.375rem 0.75rem",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    border: "1px solid #181818",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                    cursor: disconnecting === display.id ? "not-allowed" : "pointer",
                    opacity: disconnecting === display.id ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (disconnecting !== display.id) {
                      e.currentTarget.style.backgroundColor = "#fecaca";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee2e2";
                  }}
                  title="Display trennen"
                >
                  <PowerOff size={14} />
                  Trennen
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Letztes Update Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
          }}
        >
          <span style={{ color: "#6b7280", fontWeight: 500 }}>
            Letztes Update:
          </span>
          <span style={{ color: "#374151", fontWeight: 600 }}>
            {formatLastUpdate()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LivePlanControl;
