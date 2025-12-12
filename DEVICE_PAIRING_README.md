# Device Pairing Feature - Implementierung

## Übersicht

Das Device Pairing Feature ermöglicht es, Displays (z.B. Tablets, Monitore) mit einer Organisation zu koppeln, indem ein 6-stelliger Code oder QR-Code verwendet wird.

## Implementierte Komponenten

### 1. Backend

#### Prisma Schema (`prisma/schema.prisma`)
- **Device Model**: Speichert Pairing-Informationen
  - `id`: Eindeutige Device-ID (CUID)
  - `pairingCode`: 6-stelliger Code (unique)
  - `socketId`: Socket.io Connection ID
  - `status`: PENDING oder PAIRED
  - `orgId`: Organisation ID (nach Pairing)
  - `name`: Optional device name

#### Socket.io Setup (`server/socket.ts`)
- Generiert automatisch 6-stelligen Code bei Connection
- Erstellt Device-Eintrag in DB
- Sendet Code an Client
- Emittiert 'paired' Event bei erfolgreicher Kopplung
- Cleanup bei Disconnect

#### API Route (`server/routes/devices.ts`)
- `POST /api/devices/register`: Koppelt Device mit Organisation
- `GET /api/devices/:orgId`: Liste aller Devices einer Organisation

#### Server Integration (`server/index.ts`)
- Socket.io Server Setup mit HTTP Server
- CORS-Konfiguration für Socket.io
- Device Route Integration

### 2. Frontend

#### Display-Komponente (`src/pages/DevicePairingDisplay.tsx`)
- Verbindet zu Socket.io
- Zeigt 6-stelligen Code riesig an
- Generiert QR-Code mit `qrcode.react`
- Hört auf 'paired' Event
- LocalStorage für Pairing-Status
- Reset-Funktion

#### Admin-Komponente (`src/components/admin/DevicePairingAdmin.tsx`)
- Liest `org` ID aus URL Query Parameters
- Input für manuellen Code
- QR-Scanner mit `html5-qrcode`
- POST Request an `/api/devices/register`
- Erfolgs-/Fehler-Anzeige

## Installation & Setup

### 1. Dependencies installieren
```bash
npm install socket.io socket.io-client @types/socket.io @types/socket.io-client html5-qrcode --legacy-peer-deps
```

### 2. Datenbank Migration
```bash
npm run db:migrate:dev
```

### 3. Environment Variables
```env
# .env
VITE_API_URL=http://localhost:3000
```

## Verwendung

### Display registrieren
1. Öffne auf dem Display: `http://localhost:5173/cahos-ops/register-display`
2. Ein 6-stelliger Code und QR-Code werden angezeigt
3. Warte auf Kopplung durch Admin

### Device koppeln (Admin)
1. Öffne: `http://localhost:5173/cahos-ops/admin/settings?org=<ORG_ID>`
2. Integriere `<DevicePairingAdmin />` Komponente
3. Scanne QR-Code oder gib Code manuell ein
4. Klicke "Display koppeln"

## Integration in bestehende App

### Route hinzufügen (App.tsx oder Router)
```typescript
import { DevicePairingDisplay } from './pages';

// Route Configuration
{
  path: '/cahos-ops/register-display',
  element: <DevicePairingDisplay />
}
```

### Admin Settings erweitern
```typescript
import { DevicePairingAdmin } from '../components/admin';

function OrganisationSettings() {
  return (
    <div>
      {/* ... existing content ... */}
      
      <section>
        <h2>Display Management</h2>
        <DevicePairingAdmin 
          onSuccess={(deviceId) => {
            console.log('Device paired:', deviceId);
          }} 
        />
      </section>
    </div>
  );
}
```

## API Endpoints

### POST /api/devices/register
Registriert ein Device

**Request Body:**
```json
{
  "pairingCode": "123456",
  "orgId": "org-uuid",
  "deviceName": "Empfangs-Display" // optional
}
```

**Response:**
```json
{
  "success": true,
  "device": {
    "id": "device-id",
    "status": "PAIRED",
    "orgId": "org-uuid",
    "name": "Empfangs-Display",
    ...
  }
}
```

### GET /api/devices/:orgId
Liste aller Devices einer Organisation

**Response:**
```json
[
  {
    "id": "device-id",
    "pairingCode": "123456",
    "status": "PAIRED",
    "orgId": "org-uuid",
    "name": "Empfangs-Display",
    ...
  }
]
```

## Socket.io Events

### Client Events
- `connection`: Automatisch bei Connect
- `check-pairing`: Manuell Pairing-Status prüfen
- `disconnect`: Automatisch bei Disconnect

### Server Events
- `pairing-code`: Code an Client senden
  ```json
  { "code": "123456", "deviceId": "device-id" }
  ```

- `paired`: Erfolgreiche Kopplung
  ```json
  { "orgId": "org-uuid", "deviceName": "Display Name" }
  ```

- `error`: Fehler
  ```json
  { "message": "Error message" }
  ```

## Testing

### 1. Backend starten
```bash
npm run api:dev
```

### 2. Frontend starten
```bash
npm run dev
```

### 3. Display-Seite öffnen
```
http://localhost:5173/cahos-ops/register-display
```

### 4. Admin-Seite öffnen
```
http://localhost:5173/cahos-ops/admin/settings?org=<ORG_ID>
```

### 5. Code eingeben oder scannen
Der Display sollte automatisch als "gekoppelt" angezeigt werden.

## Technische Details

### Code-Generierung
- 6-stellige Zufallszahl (100000-999999)
- Unique Check in Datenbank
- Max. 10 Versuche bei Kollision

### Sicherheit
- Codes sind einmalig verwendbar
- Automatisches Cleanup bei Disconnect
- CORS-Konfiguration für Socket.io
- Status-Validierung (PENDING -> PAIRED)

### LocalStorage
- `devicePaired`: "true" nach Kopplung
- `deviceOrgId`: Organisation ID
- `deviceName`: Display Name
- Reset-Button löscht alle Daten

## Erweiterungsmöglichkeiten

1. **Code-Ablaufzeit**: Automatisches Löschen nach X Minuten
2. **Mehrfach-Pairing**: Ein Code für mehrere Displays
3. **Device-Management**: Liste, Bearbeiten, Löschen von Devices
4. **Benachrichtigungen**: Push-Notifications bei Kopplung
5. **Statistiken**: Display-Nutzung, Uptime, etc.

## Troubleshooting

### Socket.io verbindet nicht
- Prüfe CORS-Konfiguration in `server/index.ts`
- Stelle sicher, dass `VITE_API_URL` korrekt gesetzt ist
- Checke Firewall/Network-Settings

### QR-Scanner funktioniert nicht
- Browser-Berechtigungen für Kamera prüfen
- HTTPS erforderlich (außer localhost)
- Alternative: Manueller Code-Input

### Device wird nicht gekoppelt
- Prüfe Socket.io Connection
- Checke Network-Tab für API-Request
- Schaue in Browser Console für Errors
- Prüfe Server-Logs

## Dateien

### Backend
- `prisma/schema.prisma` - Device Model
- `server/socket.ts` - Socket.io Setup
- `server/routes/devices.ts` - API Routes
- `server/index.ts` - Server Integration

### Frontend
- `src/pages/DevicePairingDisplay.tsx` - Display Komponente
- `src/components/admin/DevicePairingAdmin.tsx` - Admin Komponente
- `src/pages/index.ts` - Export
- `src/components/admin/index.ts` - Export

### Documentation
- `DEVICE_PAIRING_INTEGRATION.md` - Integration Guide
- `DEVICE_PAIRING_README.md` - Dieses Dokument
