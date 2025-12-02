import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, CheckCircle } from "lucide-react";
import FlipchartBackground from "../components/layout/FlipchartBackground";
import styles from "./Admin.module.css";
import { api } from "../lib/api";

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orgName: "",
    description: "",
    adminUsername: "",
    adminEmail: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupResult, setSignupResult] = useState<{
    organisation: any;
    user: any;
    message: string;
  } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.orgName ||
      !form.adminUsername ||
      !form.adminEmail ||
      !form.password
    ) {
      alert("Bitte fülle alle Pflichtfelder aus!");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.signup(form);
      setSignupResult(data);
      setSignupSuccess(true);
    } catch (err: any) {
      alert(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  const input = {
    width: "100%",
    padding: "0.75rem",
    border: "2px solid #374151",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    boxSizing: "border-box" as const,
  };

  const label = {
    display: "block",
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: "0.5rem",
  };

  if (signupSuccess && signupResult) {
    return (
      <div
        className={styles.adminWrapper}
        role="main"
        aria-label="Registrierung erfolgreich"
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
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Registrierung erfolgreich! 🎉</h1>
            <p className={styles.subtitle}>E-Mail-Bestätigung erforderlich</p>
          </div>

          {/* Success Card */}
          <div
            className={styles.adminCard}
            style={{ width: "100%", textAlign: "center" }}
          >
            <CheckCircle
              size={64}
              style={{
                color: "#10b981",
                marginBottom: "1.5rem",
              }}
            />

            <h3
              style={{
                fontFamily:
                  '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                fontSize: "1.8rem",
                marginBottom: "1rem",
                color: "#181818",
              }}
            >
              Organisation erstellt!
            </h3>

            <p
              style={{
                color: "#64748b",
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              {signupResult.message}
            </p>

            {/* Account Details */}
            <div
              style={{
                background: "#f0fdf4",
                border: "2px solid #16a34a",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              <h4
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#15803d",
                  fontWeight: "600",
                }}
              >
                Erstellt:
              </h4>
              <p
                style={{
                  margin: "0.25rem 0",
                  fontSize: "0.9rem",
                  color: "#166534",
                }}
              >
                <strong>Organisation:</strong> {signupResult.organisation.name}
              </p>
              <p
                style={{
                  margin: "0.25rem 0",
                  fontSize: "0.9rem",
                  color: "#166534",
                }}
              >
                <strong>Administrator:</strong> {signupResult.user.username}
              </p>
              <p
                style={{
                  margin: "0.25rem 0",
                  fontSize: "0.9rem",
                  color: "#166534",
                }}
              >
                <strong>E-Mail:</strong> {signupResult.user.email}
              </p>
            </div>

            {/* Next Steps */}
            <div
              style={{
                background: "#fef3c7",
                border: "2px solid #d97706",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Mail size={20} style={{ color: "#d97706" }} />
                <strong style={{ color: "#92400e" }}>Nächste Schritte:</strong>
              </div>
              <ol
                style={{
                  margin: "0",
                  paddingLeft: "1.5rem",
                  color: "#92400e",
                  fontSize: "0.9rem",
                }}
              >
                <li>Überprüfe dein E-Mail-Postfach (auch Spam-Ordner)</li>
                <li>Klicke auf den Bestätigungslink in der E-Mail</li>
                <li>Nach der Bestätigung kannst du dich anmelden</li>
              </ol>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "2px solid #181818",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  backgroundColor: "#10b981",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "2px 4px 0 #181818",
                }}
              >
                Zur Anmeldung
              </button>

              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "2px solid #181818",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  backgroundColor: "#64748b",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "2px 4px 0 #181818",
                }}
              >
                Zur Startseite
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      <FlipchartBackground />
      <main
        className={styles.adminContent}
        style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "1.2rem 1.35rem 1.15rem 1.25rem",
            boxShadow: "2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)",
            padding: "2rem",
            border: "2px solid #181818",
          }}
        >
          <h1
            style={{
              fontFamily:
                '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "1rem",
            }}
          >
            Organisation anlegen
          </h1>
          <form
            onSubmit={submit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={label}>Organisationsname</label>
              <input
                style={input}
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                placeholder="z.B. Ev. Jugend West"
              />
            </div>
            <div>
              <label style={label}>Beschreibung (optional)</label>
              <input
                style={input}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <label style={label}>Admin Benutzername</label>
              <input
                style={input}
                value={form.adminUsername}
                onChange={(e) =>
                  setForm({ ...form, adminUsername: e.target.value })
                }
              />
            </div>
            <div>
              <label style={label}>Admin E-Mail *</label>
              <input
                type="email"
                required
                style={input}
                value={form.adminEmail}
                onChange={(e) =>
                  setForm({ ...form, adminEmail: e.target.value })
                }
                placeholder="admin@beispiel.de"
              />
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  margin: "0.25rem 0 0 0",
                  fontStyle: "italic",
                }}
              >
                Wird für die E-Mail-Bestätigung benötigt
              </p>
            </div>
            <div>
              <label style={label}>Passwort</label>
              <input
                type="password"
                style={input}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              disabled={submitting}
              type="submit"
              style={{
                padding: "0.9rem 1.25rem",
                border: "2px solid #181818",
                borderRadius: 8,
                fontSize: "1rem",
                fontWeight: 700,
                background: "#10b981",
                color: "#fff",
                boxShadow: "2px 4px 0 #181818",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Wird erstellt…" : "Organisation erstellen"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                textDecoration: "underline",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Zurück zum Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminSignup
