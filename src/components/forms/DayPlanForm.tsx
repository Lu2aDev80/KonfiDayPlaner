import React, { useState } from 'react';
import { Save, X, Calendar, Plus, Trash2 } from 'lucide-react';
import type { DayPlan, Event } from '../../types/event';
import type { ScheduleItem } from '../../types/schedule';
import styles from '../../pages/Admin.module.css';

interface DayPlanFormProps {
  dayPlan?: DayPlan | null;
  event: Event;
  onSave: (dayPlanData: Omit<DayPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const DayPlanForm: React.FC<DayPlanFormProps> = ({
  dayPlan,
  event,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(dayPlan?.name || '');
  const [date, setDate] = useState(dayPlan?.date || new Date().toISOString().split('T')[0]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(dayPlan?.schedule || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      eventId: event.id,
      name: name.trim(),
      date,
      schedule
    });
  };

  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now(),
      time: '09:00',
      type: 'session',
      title: 'Neuer Termin'
    };
    setSchedule([...schedule, newItem]);
  };

  const updateScheduleItem = (index: number, updates: Partial<ScheduleItem>) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], ...updates };
    setSchedule(newSchedule);
  };

  const removeScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const isValid = name.trim().length > 0 && date;

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px',
      margin: '0 1rem'
    }}>
      <div className={styles.adminCard} style={{ width: '100%' }}>
        <div className={styles.tape} aria-hidden="true"></div>
        
        <h2 className={styles.cardTitle}>
          <Calendar size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {dayPlan ? 'Tagesplan bearbeiten' : 'Neuer Tagesplan'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.cardContent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Name Field */}
            <div>
              <label htmlFor="dayPlanName" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#181818'
              }}>
                Name des Tagesplans *
              </label>
              <input
                type="text"
                id="dayPlanName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="z.B. Tag 1 - Ankunft"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #181818',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Date Field */}
            <div>
              <label htmlFor="dayPlanDate" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#181818'
              }}>
                Datum *
              </label>
              <input
                type="date"
                id="dayPlanDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #181818',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Schedule Items */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <label style={{ 
                  fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#181818'
                }}>
                  Termine ({schedule.length})
                </label>
                <button
                  type="button"
                  onClick={addScheduleItem}
                  style={{
                    padding: '0.5rem',
                    border: '2px solid #181818',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                    backgroundColor: '#d9fdd2',
                    color: '#181818',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Plus size={14} />
                  Termin
                </button>
              </div>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem', 
                maxHeight: window.innerWidth < 768 ? '200px' : '300px', 
                overflowY: 'auto'
              }}>
                {schedule.map((item, index) => (
                  <div key={index} style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    flexWrap: window.innerWidth < 640 ? 'wrap' : 'nowrap'
                  }}>
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(index, { time: e.target.value })}
                      style={{
                        width: '80px',
                        padding: '0.25rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateScheduleItem(index, { title: e.target.value })}
                      placeholder="Titel"
                      style={{
                        flex: '1',
                        padding: '0.25rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}
                    />
                    <select
                      value={item.type}
                      onChange={(e) => updateScheduleItem(index, { type: e.target.value as any })}
                      style={{
                        width: '100px',
                        padding: '0.25rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <option value="session">Session</option>
                      <option value="workshop">Workshop</option>
                      <option value="break">Pause</option>
                      <option value="game">Spiel</option>
                      <option value="announcement">Ansage</option>
                      <option value="transition">Übergang</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(index)}
                      style={{
                        padding: '0.25rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={!isValid}
                style={{
                  flex: '1',
                  padding: '0.875rem',
                  border: '2px solid #181818',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  backgroundColor: isValid ? '#fbbf24' : '#e5e7eb',
                  color: isValid ? '#fff' : '#888',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isValid ? '2px 4px 0 #181818' : 'none'
                }}
              >
                <Save size={16} />
                {dayPlan ? 'Aktualisieren' : 'Erstellen'}
              </button>

              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '0.875rem 1rem',
                  border: '2px solid #64748b',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  backgroundColor: '#fff',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={16} />
                Abbrechen
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DayPlanForm;