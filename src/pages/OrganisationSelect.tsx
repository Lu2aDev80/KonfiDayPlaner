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
      className="admin-content w-full max-w-md mx-auto mt-14 flex flex-col items-center bg-[#fffbe7] shadow-lg px-2 sm:px-6"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)"
      }}
    >
      <div className="flex flex-col items-center mb-6">
        <Sparkles size={38} color="#fbbf24" style={{ marginBottom: 8 }} />
        <h2 className="text-2xl sm:text-3xl font-extrabold m-0 tracking-tight text-[color:var(--color-ink)]" style={{textShadow: "0 2px 8px #fffbe7"}}>
          Organisation wählen
        </h2>
        <span className="text-base sm:text-lg text-yellow-800 mt-1 font-medium">
          Wähle deine Gruppe aus!
        </span>
      </div>
      <div
        role="list"
        aria-label="Organisationen"
        className="flex flex-col gap-2 w-full"
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
        className={`mt-9 w-full py-4 rounded-xl font-extrabold text-base sm:text-lg tracking-tight transition-all duration-200 ${selectedOrg ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        aria-disabled={!selectedOrg}
      >
        Zum Dashboard
      </button>
    </div>
  );
};

export default OrganisationSelect;
