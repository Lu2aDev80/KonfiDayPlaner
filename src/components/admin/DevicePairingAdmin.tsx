import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface DevicePairingAdminProps {
  onSuccess?: (deviceId: string) => void;
}

interface DayPlan {
  id: string;
  name: string;
  date: string;
}

interface Event {
  id: string;
  name: string;
  dayPlans: DayPlan[];
}

const DevicePairingAdmin: React.FC<DevicePairingAdminProps> = ({ onSuccess }) => {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('org');
  
  const [pairingCode, setPairingCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pairedDevice, setPairedDevice] = useState<any>(null);
  const [showDayPlanModal, setShowDayPlanModal] = useState(false);
  
  // DayPlan selection
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDayPlanId, setSelectedDayPlanId] = useState('');
  const [dayPlanLoading, setDayPlanLoading] = useState(false);

  useEffect(() => {
    if (orgId) {
      loadEvents();
    }
  }, [orgId]);

  const loadEvents = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/organisations/${orgId}/events`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to load events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  const handlePairDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgId) {
      setError('Organisation ID fehlt in der URL. Bitte verwende: ?org=<organisationID>');
      return;
    }

    if (!pairingCode.trim()) {
      setError('Bitte gib einen Kopplungs-Code ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/devices/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pairingCode: pairingCode.trim(),
          orgId,
          deviceName: deviceName.trim() || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Koppeln des Geräts');
      }

      const data = await response.json();
      setPairedDevice(data.device);
      
      // Show DayPlan selection modal
      setShowDayPlanModal(true);
      
      // Reset form
      setPairingCode('');
      setDeviceName('');
      
      if (onSuccess && data.device) {
        onSuccess(data.device.id);
      }

    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDayPlan = async () => {
    if (!selectedDayPlanId || !pairedDevice) {
      setError('Bitte wähle einen DayPlan aus');
      return;
    }

    setDayPlanLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/devices/${pairedDevice.id}/dayplan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dayPlanId: selectedDayPlanId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Zuweisen des DayPlans');
      }

      // Success - close modal
      setShowDayPlanModal(false);
      setPairedDevice(null);
      setSelectedDayPlanId('');

    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setDayPlanLoading(false);
    }
  };

  const closeModal = () => {
    setShowDayPlanModal(false);
    setPairedDevice(null);
    setSelectedDayPlanId('');
  };

  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem',
          color: '#1e293b'
        }}>
          Display Koppeln
        </h2>

        {!orgId && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            color: '#92400e',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            ⚠️ Keine Organisation ausgewählt. Füge ?org=&lt;organisationID&gt; zur URL hinzu.
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePairDevice}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Kopplungs-Code vom Display *
            </label>
            <input
              type="text"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1.5rem',
                fontFamily: 'monospace',
                letterSpacing: '0.3rem',
                textAlign: 'center'
              }}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="z.B. Empfangs-Display"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !orgId}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading || !orgId ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading || !orgId ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Kopplung läuft...' : 'Display koppeln'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <p><strong>Anleitung:</strong></p>
          <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Öffne /register-display auf dem Display-Gerät</li>
            <li>Notiere den 6-stelligen Code vom Display</li>
            <li>Gib den Code hier ein und klicke auf "Display koppeln"</li>
            <li>Wähle anschließend den DayPlan aus, der angezeigt werden soll</li>
          </ol>
        </div>
      </div>

      {/* DayPlan Selection Modal */}
      {showDayPlanModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#1e293b'
            }}>
              DayPlan auswählen
            </h2>

            <p style={{ 
              marginBottom: '1.5rem', 
              color: '#64748b' 
            }}>
              Welcher DayPlan soll auf dem Display "{pairedDevice?.name || 'Unbenannt'}" angezeigt werden?
            </p>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #ef4444',
                color: '#991b1b',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              {events.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>
                  Keine Events gefunden
                </p>
              ) : (
                events.map((event) => (
                  <div key={event.id} style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      color: '#374151'
                    }}>
                      {event.name}
                    </h3>
                    {event.dayPlans && event.dayPlans.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {event.dayPlans.map((dayPlan) => (
                          <label
                            key={dayPlan.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0.75rem',
                              border: selectedDayPlanId === dayPlan.id 
                                ? '2px solid #10b981' 
                                : '1px solid #d1d5db',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              backgroundColor: selectedDayPlanId === dayPlan.id 
                                ? '#d1fae5' 
                                : 'white'
                            }}
                          >
                            <input
                              type="radio"
                              name="dayplan"
                              value={dayPlan.id}
                              checked={selectedDayPlanId === dayPlan.id}
                              onChange={() => setSelectedDayPlanId(dayPlan.id)}
                              style={{ marginRight: '0.75rem' }}
                            />
                            <div>
                              <div style={{ fontWeight: '500' }}>{dayPlan.name}</div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {dayPlan.date}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic' }}>
                        Keine DayPlans vorhanden
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={closeModal}
                disabled={dayPlanLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: dayPlanLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleAssignDayPlan}
                disabled={!selectedDayPlanId || dayPlanLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: !selectedDayPlanId || dayPlanLoading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !selectedDayPlanId || dayPlanLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {dayPlanLoading ? 'Wird zugewiesen...' : 'DayPlan zuweisen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevicePairingAdmin;
