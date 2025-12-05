import express, { Request, Response } from 'express';
import { PrismaClient, DeviceStatus } from '@prisma/client';
import { logger } from '../logger';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/devices/register
// Register a device by pairing code
router.post('/devices/register', async (req: Request, res: Response) => {
  try {
    const { pairingCode, orgId, deviceName } = req.body;

    if (!pairingCode || !orgId) {
      return res.status(400).json({ 
        error: 'Missing required fields: pairingCode and orgId are required' 
      });
    }

    // Find device by pairing code
    const device = await prisma.device.findUnique({
      where: { pairingCode }
    });

    if (!device) {
      logger.warn(`Device registration failed: Invalid pairing code ${pairingCode}`);
      return res.status(404).json({ error: 'Invalid pairing code' });
    }

    if (device.status === DeviceStatus.PAIRED) {
      logger.warn(`Device registration failed: Device already paired ${pairingCode}`);
      return res.status(400).json({ error: 'Device is already paired' });
    }

    // Update device with org info
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: {
        status: DeviceStatus.PAIRED,
        orgId,
        name: deviceName || null
      }
    });

    logger.info(`Device paired successfully: ${updatedDevice.id} to org ${orgId}`);

    // Emit 'paired' event to the device via Socket.IO
    const io = req.app.locals.io;
    if (io && device.socketId) {
      try {
        await io.emitToPairedDevice(device.socketId, orgId, deviceName);
      } catch (error) {
        logger.error('Error emitting paired event:', error);
      }
    }

    // Return device info
    res.json({
      success: true,
      device: updatedDevice
    });

  } catch (error) {
    logger.error('Error registering device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/devices/:orgId
// Get all devices for an organization
router.get('/devices/:orgId', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;

    const devices = await prisma.device.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(devices);
  } catch (error) {
    logger.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/devices/:deviceId/dayplan
// Assign a DayPlan to a device
router.put('/devices/:deviceId/dayplan', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { dayPlanId } = req.body;

    if (!dayPlanId) {
      return res.status(400).json({ error: 'dayPlanId is required' });
    }

    // Update device with dayPlanId
    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: { dayPlanId }
    });

    logger.info(`DayPlan ${dayPlanId} assigned to device ${deviceId}`);

    // Emit event to device via Socket.IO
    const io = req.app.locals.io;
    if (io && updatedDevice.socketId) {
      try {
        await io.emitDayPlanUpdate(updatedDevice.socketId, dayPlanId);
      } catch (error) {
        logger.error('Error emitting dayplan update:', error);
      }
    }

    res.json({
      success: true,
      device: updatedDevice
    });

  } catch (error) {
    logger.error('Error assigning DayPlan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
