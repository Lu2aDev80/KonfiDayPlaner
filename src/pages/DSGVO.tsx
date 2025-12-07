import React from 'react';

const DSGVO: React.FC = () => (
  <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2.5rem', background: 'var(--color-paper)', color: 'var(--color-ink)', borderRadius: 12, border: '2px solid var(--color-ink)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontFamily: '"Inter", "Roboto", Arial, sans-serif' }}>
    <h1>Datenschutzerklärung (DSGVO)</h1>
    <p>Stand: Dezember 2025</p>

    <p>
      Wir nehmen den Schutz deiner personenbezogenen Daten ernst. Diese Erklärung beschreibt, welche Daten wir sammeln, wofür wir sie verwenden und welche Rechte du hast.
    </p>

    <h3>1. Verantwortlicher</h3>
    <p>
      Verantwortlich für die Datenverarbeitung ist: Luca Steinhagen (Kontakt: info@lu2adevelopment.de).
    </p>

    <h3>2. Welche Daten wir verarbeiten</h3>
    <p>
      - Registrierungsdaten (Name, E-Mail, Benutzername)
      <br />- Organisationsdaten (Name, Beschreibung, ggf. Logo)
      <br />- Nutzungsdaten (Einstellungen, Login-Zeiten)
    </p>

    <h3>3. Zweck der Verarbeitung</h3>
    <p>
      Die Datenverarbeitung erfolgt zur Bereitstellung und Verbesserung des Dienstes, zur Authentifizierung, Benachrichtigung (E-Mails) und zur Erfüllung vertraglicher Pflichten.
    </p>

    <h3>4. Rechtsgrundlage</h3>
    <p>
      Die Verarbeitung erfolgt auf Basis von Art. 6 DSGVO (Vertragserfüllung, berechtigtes Interesse) und — sofern erforderlich — mit Einwilligung (Art. 6 Abs. 1 lit. a).
    </p>

    <h3>5. Speicherdauer</h3>
    <p>
      Personenbezogene Daten werden nur so lange gespeichert, wie es für die Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.
    </p>

    <h3>6. Deine Rechte</h3>
    <p>
      Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Zur Ausübung wende dich an info@lu2adevelopment.de.
    </p>

    <p style={{ marginTop: '1.5rem' }}>
      Diese Datenschutzerklärung ist eine kurze, anwendungsbezogene Fassung. Sie ersetzt keine vollständige rechtliche Prüfung.
    </p>
  </div>
);

export default DSGVO;
