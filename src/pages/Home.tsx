import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Monitor, Calendar, BookOpen } from "lucide-react";
import ActionButton from "../components/ui/ActionButton";
import FlipchartBackground from "../components/layout/FlipchartBackground";
import styles from "./Admin.module.css";
import chaosOpsLogo from "../assets/Chaos-Ops Logo.png";

import Gremlin from "../components/ui/Gremlin";
import HelpChat from "../components/ui/HelpChat";

// Widget-Komponente für Gremlin + Chat
const HelpChatGremlin: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          right: open ? "22rem" : "2rem",
          zIndex: 1000,
          cursor: "pointer",
          transition: "transform 0.2s, right 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        onClick={() => setOpen((v) => !v)}
        title="Hilfe öffnen"
      >
        <Gremlin type="sleep" size="large" />
      </div>
      {open && <HelpChat onClose={() => setOpen(false)} />}
    </>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div
      className={styles.adminWrapper}
      role="main"
      aria-label="Chaos Ops Startseite"
    >
      <FlipchartBackground />

      <main
        className={styles.adminContent}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          padding: "2rem 1rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: "1.2rem 1.35rem 1.15rem 1.25rem",
            boxShadow: "2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)",
            padding: "2.5rem 2rem",
            border: "2px solid #181818",
            textAlign: "center",
            width: "100%",
            maxWidth: "700px",
            position: "relative",
            transform: "rotate(-0.3deg)",
            zIndex: 1,
          }}
        >
          {/* Tape */}
          <div className={styles.tape} />

          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={chaosOpsLogo}
              alt="Chaos Ops Logo"
              style={{
                maxWidth: "300px",
                maxHeight: "120px",
                width: "auto",
                height: "auto",
                filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.1))",
              }}
            />
          </div>

          {/* Werbetext/Testimonial */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.7rem',
              padding: '0.85rem 1.1rem',
              margin: '0 auto 1.2rem auto',
              maxWidth: 400,
              boxShadow: '0 1px 8px #e5e7eb33',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              fontSize: '1rem',
              color: '#18181b',
              textAlign: 'center',
              lineHeight: 1.5,
              letterSpacing: '0.01em',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1.09rem', marginBottom: 2, color: '#fbbf24', letterSpacing: '0.01em' }}>
              Chaos Ops – Dein Event, perfekt organisiert
            </div>
            <div style={{ color: '#18181b', fontWeight: 400, fontSize: '0.97rem' }}>
              Live-Tagespläne im Blick, flexibel anpassbar, übersichtlich für Teams.<br />
              <span style={{ color: '#fbbf24', fontSize: '0.93rem', fontWeight: 500 }}>
                Der digitale Begleiter für stressfreie Events.
              </span>
            </div>
          </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
            <ActionButton
            onClick={() => navigate("/login")}
              icon={<LogIn size={20} />}
              color="#fbbf24"
            >
            Zum Verwalten Anmelden
            </ActionButton>

            <ActionButton
            onClick={() => navigate("/register-display")}
              icon={<Monitor size={20} />}
              color="#38bdf8"
            >
            Display Pairing Code
            </ActionButton>

            <ActionButton
            onClick={() => navigate("/documentation")}
              icon={<BookOpen size={20} />}
              color="#a78bfa"
            >
            Dokumentation
            </ActionButton>



          {/* Development Test Button */}
            <ActionButton
            onClick={() => navigate("/planner")}
              icon={<Calendar size={18} />}
              color="#10b981"
              borderStyle="dashed"
              extraStyles={{ fontWeight: 600, fontSize: "clamp(0.98rem, 2.25vw, 1.08rem)", opacity: 0.95 }}
            title="Demo-Modus ausprobieren"
              badge={<span style={{
                backgroundColor: '#fbbf24',
                color: '#18181b',
                fontSize: '0.78rem',
                padding: '2px 10px',
                borderRadius: '6px',
                border: '1.5px solid #181818',
                fontWeight: 700,
                letterSpacing: '0.03em',
                boxShadow: '0 1px 4px #fbbf2433',
                lineHeight: 1.1,
                alignSelf: 'center',
              }}>Demo Planer</span>}
            >
              Demo ausprobieren
            </ActionButton>
        </div>
        </div>



        {/* Schlafender Gremlin für Hilfe-Chat */}
        <HelpChatGremlin />


      </main>
    </div>
  );
};

export default Home;
