import React from 'react';

const AGB: React.FC = () => (
  <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2.5rem', background: 'var(--color-paper)', color: 'var(--color-ink)', borderRadius: 12, border: '2px solid var(--color-ink)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontFamily: '"Inter", "Roboto", Arial, sans-serif' }}>
    <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
    <p>Stand: Dezember 2025</p>

    <p>
      Diese AGB regeln die Nutzung der Webanwendung "Chaos Ops / KonfiDayPlaner". Durch die Registrierung bzw. Anmeldung akzeptierst du diese Bedingungen.
    </p>

    <h3>1. Leistungsbeschreibung</h3>
    <p>
      Die Anwendung ermöglicht das Erstellen und Verwalten von Veranstaltungstagen, Zeitplänen und Displays innerhalb einer Organisation. Der Dienst wird nach jeweils aktuellen Angaben betrieben; Funktionalität kann sich mit Updates ändern.
    </p>

    <h3>2. Registrierung und Zugang</h3>
    <p>
      Für die Nutzung ist ein Benutzerkonto erforderlich. Bei der Registrierung sind wahrheitsgemäße Angaben zu machen. Das Konto darf nicht an Dritte weitergegeben werden.
    </p>

    <h3>3. Haftung</h3>
    <p>
      Soweit gesetzlich zulässig, ist die Haftung auf Vorsatz und grobe Fahrlässigkeit beschränkt. Für leicht fahrlässige Pflichtverletzungen besteht nur Haftung bei Verletzung wesentlicher Vertragspflichten.
    </p>

    <h3>4. Änderungen der AGB</h3>
    <p>
      Änderungen werden rechtzeitig bekannt gegeben; bei wesentlichen Änderungen ist eine erneute Zustimmung erforderlich.
    </p>

    <h3>5. Anwendbares Recht</h3>
    <p>
      Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Diensteanbieters.
    </p>

    <p style={{ marginTop: '1.5rem' }}>
      Diese AGB sind in knapper Form gehalten und dienen als Vorlage; im Zweifel ist dies keine Rechtsberatung.
    </p>
  </div>
);

export default AGB;
