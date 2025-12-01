import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import OrganisationCard from "../components/ui/OrganisationCard";
import { Sparkles } from "lucide-react";
import { organisations } from "../data/organisations";

const OrganisationSelect: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (id: string) => {
    setSelectedOrg(id);
  };

  const handleContinue = () => {
    if (selectedOrg) {
      // Check if we're in /login or /admin path
      const basePath = location.pathname.startsWith("/login")
        ? "/login"
        : "/admin";
      // Navigate to dashboard with org parameter
      navigate(`${basePath}/dashboard?org=${selectedOrg}`);
    }
  };

  return (
    <div
      className="admin-content"
      style={{
        maxWidth: 480,
        margin: "3.5rem auto 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#fffbe7",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Sparkles size={38} color="#fbbf24" style={{ marginBottom: 8 }} />
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.01em",
            color: "var(--color-ink)",
            textShadow: "0 2px 8px #fffbe7",
          }}
        >
          Organisation wählen
        </h2>
        <span
          style={{
            fontSize: "1.05rem",
            color: "#b45309",
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          Wähle deine Gruppe aus!
        </span>
      </div>
      <div
        role="list"
        aria-label="Organisationen"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "100%",
        }}
      >
        {organisations.map((org) => (
          <OrganisationCard
            key={org.id}
            name={org.name}
            description={org.description}
            selected={selectedOrg === org.id}
            onClick={() => handleSelect(org.id)}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={!selectedOrg}
        onClick={handleContinue}
        style={{
          marginTop: "2.2rem",
          width: "100%",
          padding: "1.1rem 0",
          background: selectedOrg
            ? "linear-gradient(90deg,#fbbf24 0%,#f59e42 100%)"
            : "#e5e7eb",
          color: selectedOrg ? "#fff" : "#888",
          border: "none",
          borderRadius: 12,
          fontWeight: 800,
          fontSize: "1.13rem",
          letterSpacing: "0.01em",
          cursor: selectedOrg ? "pointer" : "not-allowed",
          boxShadow: selectedOrg ? "0 4px 16px rgba(251,191,36,0.13)" : "none",
          transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
        }}
        aria-disabled={!selectedOrg}
      >
        Zum Dashboard
      </button>
    </div>
  );
};

export default OrganisationSelect;
