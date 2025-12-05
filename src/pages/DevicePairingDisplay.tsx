import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface PairingData {
  code: string;
  deviceId: string;
}

interface PairedData {
  orgId: string;
  deviceName?: string;
}

interface DayPlanAssignedData {
  dayPlanId: string;
}

const DevicePairingDisplay = () => {
  const [pairingCode, setPairingCode] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [isPaired, setIsPaired] = useState<boolean>(false);
  const [pairedOrgId, setPairedOrgId] = useState<string>('');
  const [deviceName, setDeviceName] = useState<string>('');
  const [assignedDayPlanId, setAssignedDayPlanId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Listen for pairing code
    socket.on('pairing-code', (data: PairingData) => {
      console.log('Received pairing code:', data);
      setPairingCode(data.code);
      setDeviceId(data.deviceId);
      setError('');
    });

    // Listen for successful pairing
    socket.on('paired', (data: PairedData) => {
      console.log('Device paired successfully:', data);
      setIsPaired(true);
      setPairedOrgId(data.orgId);
      if (data.deviceName) {
        setDeviceName(data.deviceName);
      }
      
      // Store pairing info in localStorage
      localStorage.setItem('devicePaired', 'true');
      localStorage.setItem('deviceOrgId', data.orgId);
      if (data.deviceName) {
        localStorage.setItem('deviceName', data.deviceName);
      }
    });

    // Listen for DayPlan assignment
    socket.on('dayplan-assigned', (data: DayPlanAssignedData) => {
      console.log('DayPlan assigned:', data);
      setAssignedDayPlanId(data.dayPlanId);
      
      // Store dayPlanId in localStorage
      localStorage.setItem('deviceDayPlanId', data.dayPlanId);
      
      // Redirect to display view with dayPlanId
      // window.location.href = `/display/${data.dayPlanId}`;
    });

    // Listen for errors
    socket.on('error', (data: { message: string }) => {
      console.error('Socket error:', data);
      setError(data.message || 'Ein Fehler ist aufgetreten');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Verbindung zum Server fehlgeschlagen');
    });

    // Check if device was already paired (from localStorage)
    const wasPaired = localStorage.getItem('devicePaired');
    const storedOrgId = localStorage.getItem('deviceOrgId');
    const storedName = localStorage.getItem('deviceName');
    const storedDayPlanId = localStorage.getItem('deviceDayPlanId');
    
    if (wasPaired === 'true' && storedOrgId) {
      setIsPaired(true);
      setPairedOrgId(storedOrgId);
      if (storedName) {
        setDeviceName(storedName);
      }
      if (storedDayPlanId) {
        setAssignedDayPlanId(storedDayPlanId);
      }
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleReset = () => {
    // Clear localStorage and reconnect
    localStorage.removeItem('devicePaired');
    localStorage.removeItem('deviceOrgId');
    localStorage.removeItem('deviceName');
    localStorage.removeItem('deviceDayPlanId');
    
    setIsPaired(false);
    setPairedOrgId('');
    setDeviceName('');
    setAssignedDayPlanId('');
    setPairingCode('');
    
    // Reconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  };

  if (isPaired) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: assignedDayPlanId ? '#6366f1' : '#10b981',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
          {assignedDayPlanId ? '📅' : '✓'}
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {assignedDayPlanId ? 'Display konfiguriert!' : 'Display gekoppelt!'}
        </h1>
        {deviceName && (
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Name: {deviceName}
          </p>
        )}
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '1rem' }}>
          Organisation ID: {pairedOrgId}
        </p>
        {assignedDayPlanId ? (
          <>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              DayPlan zugewiesen!
            </p>
            <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '2rem' }}>
              DayPlan ID: {assignedDayPlanId}
            </p>
            <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '2rem' }}>
              Das Display ist nun vollständig konfiguriert und bereit.
            </p>
          </>
        ) : (
          <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '2rem' }}>
            Warte auf DayPlan-Zuweisung durch Admin...
          </p>
        )}
        <button
          onClick={handleReset}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: assignedDayPlanId ? '#6366f1' : '#10b981',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Display zurücksetzen
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
        Display Kopplung
      </h1>

      {error && (
        <div style={{
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          {error}
        </div>
      )}

      {pairingCode ? (
        <>
          <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.9 }}>
            Gib diesen Code in den Admin-Einstellungen ein:
          </p>

          <div style={{
            fontSize: '8rem',
            fontWeight: 'bold',
            letterSpacing: '0.5rem',
            marginBottom: '3rem',
            fontFamily: 'monospace',
            backgroundColor: '#334155',
            padding: '2rem 3rem',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            {pairingCode}
          </div>

          <div style={{
            fontSize: '1rem',
            opacity: 0.7,
            backgroundColor: '#334155',
            padding: '1rem 2rem',
            borderRadius: '8px'
          }}>
            <p>Device ID: {deviceId}</p>
            <p style={{ marginTop: '0.5rem' }}>Warte auf Kopplung...</p>
          </div>
        </>
      ) : (
        <div style={{ fontSize: '1.5rem' }}>
          <p>Verbindung wird hergestellt...</p>
          <p style={{ fontSize: '3rem', marginTop: '1rem' }}>⏳</p>
        </div>
      )}
    </div>
  );
};

export default DevicePairingDisplay;
