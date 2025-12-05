import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { PrismaClient, DeviceStatus } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

// Generate a random 6-digit pairing code
function generatePairingCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check if a pairing code is unique
async function isCodeUnique(code: string): Promise<boolean> {
  const existing = await prisma.device.findUnique({
    where: { pairingCode: code }
  });
  return !existing;
}

// Generate a unique pairing code
async function generateUniquePairingCode(): Promise<string> {
  let code = generatePairingCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (!(await isCodeUnique(code)) && attempts < maxAttempts) {
    code = generatePairingCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique pairing code');
  }

  return code;
}

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.DEV_ORIGIN || "http://localhost:5173",
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.FRONTEND_HOST || ""
      ].filter(Boolean),
      credentials: true
    }
  });

  io.on('connection', async (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    try {
      // Generate unique pairing code
      const pairingCode = await generateUniquePairingCode();

      // Create device entry in database
      const device = await prisma.device.create({
        data: {
          pairingCode,
          socketId: socket.id,
          status: DeviceStatus.PENDING
        }
      });

      logger.info(`Device created with pairing code: ${pairingCode} (${device.id})`);

      // Send pairing code to client
      socket.emit('pairing-code', { code: pairingCode, deviceId: device.id });

    } catch (error) {
      logger.error('Error creating device:', error);
      socket.emit('error', { message: 'Failed to generate pairing code' });
    }

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      
      // Optionally clean up pending devices after disconnect
      prisma.device.deleteMany({
        where: {
          socketId: socket.id,
          status: DeviceStatus.PENDING
        }
      }).catch((err: any) => {
        logger.error('Error cleaning up disconnected device:', err);
      });
    });
  });

  // Helper function to emit to a specific socket
  io.emitToPairedDevice = async (socketId: string, orgId: string, deviceName?: string) => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit('paired', { orgId, deviceName });
      logger.info(`Emitted paired event to socket ${socketId}`);
    } else {
      logger.warn(`Socket ${socketId} not found for paired emission`);
    }
  };

  // Helper function to emit dayplan update to a specific socket
  io.emitDayPlanUpdate = async (socketId: string, dayPlanId: string) => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit('dayplan-assigned', { dayPlanId });
      logger.info(`Emitted dayplan-assigned event to socket ${socketId}`);
    } else {
      logger.warn(`Socket ${socketId} not found for dayplan update`);
    }
  };

  return io;
}

// Extend Socket.IO types
declare module 'socket.io' {
  interface Server {
    emitToPairedDevice(socketId: string, orgId: string, deviceName?: string): Promise<void>;
    emitDayPlanUpdate(socketId: string, dayPlanId: string): Promise<void>;
  }
}
