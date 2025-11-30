
import { Routes, Route } from 'react-router-dom';
import Planer from './components/planner/Planer';
import type { ScheduleItem } from './types/schedule';
import Admin from './pages/Admin';
import OrganisationSelect from './pages/OrganisationSelect';
import Dashboard from './pages/Dashboard';

const schedule: ScheduleItem[] = [
  { id: 1, time: '08:45', type: 'announcement', title: 'Ankommen & Registrierung', details: 'Bitte Namensschild holen und Platz suchen.' },
  { id: 2, time: '09:00', type: 'session', title: 'Begrüßung & Intro', speaker: 'Lea', location: 'Großer Raum', details: 'Kurzer Überblick über den Tag.' },
  { id: 3, time: '09:15', type: 'game', title: 'Namensspiel', facilitator: 'Tom', location: 'Kreis', materials: 'Ball', details: 'Schnelles Kennenlernspiel.' },
  { id: 4, time: '09:30', type: 'workshop', title: 'Kreative Karten', speaker: 'Mara', location: 'Werkraum', materials: 'Stifte, Bastelpapier', details: 'Gestalte eine persönliche Ermutigungskarte.' },
  { id: 5, time: '10:15', type: 'break', title: 'Pause', duration: '15 Min', snacks: 'Kekse & Saft' },
  { id: 6, time: '10:30', type: 'session', title: 'Impuls: Vertrauen', speaker: 'Paul', location: 'Großer Raum', details: 'Kurzer Input mit Austausch.' },
  { id: 7, time: '11:00', type: 'transition', title: 'Umbau / Vorbereitung Spiel' },
  { id: 8, time: '11:10', type: 'game', title: 'Teamchallenge Parcours', facilitator: 'Sarah', location: 'Außenbereich', materials: 'Seile, Hütchen', details: 'Kooperations-Challenge.' },
  { id: 9, time: '11:45', type: 'announcement', title: 'Ansage: Ausflug nächste Woche', details: 'Treffpunkt 9:30 an der Kirche.' },
  { id: 10, time: '11:50', type: 'break', title: 'Frühstück / Snack', duration: '20 Min', snacks: 'Obst & Müsliriegel' },
  { id: 11, time: '12:10', type: 'workshop', title: 'Musik Jam', speaker: 'Ben', location: 'Musikraum', materials: 'Gitarren, Cajón', details: 'Offene Jam-Runde.' },
  { id: 12, time: '12:45', type: 'session', title: 'Abschlussrunde', speaker: 'Lea', location: 'Großer Raum', details: 'Feedback & Gebet.' },
  { id: 13, time: '13:00', type: 'transition', title: 'Aufräumen' },
  { id: 14, time: '13:10', type: 'announcement', title: 'Ende / Verabschiedung', details: 'Dank & Hinweis auf Termin nächste Woche.' },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Planer schedule={schedule} showClock={true} autoCenter={true} />} />
      <Route path="/admin" element={<Admin />}>
        <Route path="select" element={<OrganisationSelect />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
