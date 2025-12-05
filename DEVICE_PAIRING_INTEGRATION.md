/**
 * Integration Guide für Device Pairing Feature
 * 
 * Diese Datei zeigt, wie die Device-Pairing-Komponenten 
 * in die bestehende App integriert werden können.
 */

// ============================================
// 1. Route Configuration (in App.tsx oder routing file)
// ============================================

import DevicePairingDisplay from './pages/DevicePairingDisplay';
import DevicePairingAdmin from './components/admin/DevicePairingAdmin';

// Füge diese Routes hinzu:
const routes = [
  // ... existing routes
  
  // Display Pairing Route (Public - für Displays)
  {
    path: '/register-display',
    element: <DevicePairingDisplay />
  },
  
  // ... oder mit base path:
  {
    path: '/minihackathon/register-display',
    element: <DevicePairingDisplay />
  }
];

// ============================================
// 2. Admin Settings Integration
// ============================================

// In OrganisationSettings.tsx oder einer anderen Admin-Seite:
import DevicePairingAdmin from '../components/admin/DevicePairingAdmin';

function OrganisationSettings() {
  const handleDevicePaired = (deviceId: string) => {
    console.log('Device paired:', deviceId);
    // Optional: Reload devices list oder zeige Notification
  };

  return (
    <div>
      {/* ... existing content ... */}
      
      <section>
        <h2>Display Management</h2>
        <DevicePairingAdmin onSuccess={handleDevicePaired} />
      </section>
      
      {/* ... existing content ... */}
    </div>
  );
}

// ============================================
// 3. Environment Variables
// ============================================

// Füge zu .env hinzu:
/*
VITE_API_URL=http://localhost:3000
*/

// Für Production:
/*
VITE_API_URL=https://your-production-domain.com
*/

// ============================================
// 4. Database Migration
// ============================================

// Run in terminal:
// npm run db:migrate:dev

// Oder mit Prisma direkt:
// npx prisma migrate dev --name add_device_pairing

// ============================================
// 5. Testing
// ============================================

// 1. Start Backend:
//    npm run api:dev

// 2. Start Frontend:
//    npm run dev

// 3. Öffne Display-Seite:
//    http://localhost:5173/minihackathon/register-display

// 4. Öffne Admin-Seite:
//    http://localhost:5173/minihackathon/admin/settings?org=<ORG_ID>

// 5. Gib den 6-stelligen Code ein oder scanne den QR-Code

// ============================================
// 6. API Endpoint Information
// ============================================

/*
POST /api/devices/register
Body: {
  pairingCode: string,  // 6-digit code
  orgId: string,        // Organisation ID
  deviceName?: string   // Optional device name
}

Response: {
  success: boolean,
  device: {
    id: string,
    status: 'PAIRED',
    orgId: string,
    name?: string,
    ...
  }
}

GET /api/devices/:orgId
Response: Device[]
*/

// ============================================
// 7. Socket.IO Events
// ============================================

/*
Client -> Server Events:
- connection: Automatically triggered when client connects
- check-pairing: Manually check pairing status
- disconnect: Automatically triggered when client disconnects

Server -> Client Events:
- pairing-code: Sent when client connects
  Data: { code: string, deviceId: string }
  
- paired: Sent when device is successfully paired
  Data: { orgId: string, deviceName?: string }
  
- error: Sent when an error occurs
  Data: { message: string }
*/

export {};
