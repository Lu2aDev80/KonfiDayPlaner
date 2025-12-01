import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Planer from '../components/planner/Planer';
import type { ScheduleItem } from '../types/schedule';

interface DayPlan {
  id: string;
  name: string;
  date: string;
  schedule: ScheduleItem[];
}

interface Event {
  dayPlans: DayPlan[];
}

// Sample schedule for demo/development
const sampleSchedule: ScheduleItem[] = [
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

const PlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // In a real app, you would:
  // 1. Get the dayPlanId from searchParams
  // 2. Fetch the actual schedule from localStorage or API
  // 3. Display the appropriate schedule
  
  const dayPlanId = searchParams.get('dayPlanId');
  const orgId = searchParams.get('org');
  
  // For development, we'll use the sample schedule
  // In production, you would load the actual schedule based on dayPlanId and orgId
  let schedule = sampleSchedule;
  let title = 'Heutiger Ablauf';
  let date = new Date().toLocaleDateString('de-DE', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // If there's a dayPlanId, try to load from localStorage (for demo purposes)
  if (dayPlanId && orgId) {
    try {
      const storedEvents = localStorage.getItem(`events_${orgId}`);
      if (storedEvents) {
        const events: Event[] = JSON.parse(storedEvents);
        
        // Find the day plan
        for (const event of events) {
          const dayPlan = event.dayPlans.find((dp: DayPlan) => dp.id === dayPlanId);
          if (dayPlan) {
            schedule = dayPlan.schedule;
            title = dayPlan.name;
            date = new Date(dayPlan.date).toLocaleDateString('de-DE', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  }

  return (
    <Planer 
      schedule={schedule} 
      title={title}
      date={date}
      showClock={true} 
      autoCenter={true}
      debug={false}
    />
  );
};

export default PlannerPage;
