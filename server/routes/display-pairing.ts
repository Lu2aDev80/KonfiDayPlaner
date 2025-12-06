import express, { Request, Response } from 'express';
import { PrismaClient, DeviceStatus } from '@prisma/client';
import { logger } from '../logger';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/displays/pairing/register
// Register a display by pairing code
router.post('/displays/pairing/register', async (req: Request, res: Response) => {
  try {
    const { pairingCode, organisationId, deviceName } = req.body;

    if (!pairingCode || !organisationId) {
      return res.status(400).json({ 
        error: 'Missing required fields: pairingCode and organisationId are required' 
      });
    }

    // Find display by pairing code
    const display = await prisma.display.findUnique({
      where: { pairingCode }
    });

    if (!display) {
      logger.warn(`Display registration failed: Invalid pairing code ${pairingCode}`);
      return res.status(404).json({ error: 'Invalid pairing code' });
    }

    logger.info(`Display found with pairing code ${pairingCode}: socketId=${display.socketId}`);

    if (display.status === DeviceStatus.PAIRED) {
      logger.warn(`Display registration failed: Display already paired ${pairingCode}`);
      return res.status(400).json({ error: 'Display is already paired' });
    }

    // Update display with org info
    const updatedDisplay = await prisma.display.update({
      where: { id: display.id },
      data: {
        status: DeviceStatus.PAIRED,
        organisationId,
        name: deviceName || display.name
      }
    });

    logger.info(`Display paired successfully: ${updatedDisplay.id} to org ${organisationId}`);

    // Emit 'paired' event to the display via Socket.IO
    const io = req.app.locals.io;
    if (io && display.socketId) {
      try {
        logger.info(`Attempting to emit 'paired' event to socket ${display.socketId}`);
        await io.emitToPairedDevice(display.socketId, organisationId, updatedDisplay.id, deviceName);
      } catch (error) {
        logger.error('Error emitting paired event:', error);
      }
    }

    // Return display info
    res.json({
      success: true,
      display: updatedDisplay
    });

  } catch (error) {
    logger.error('Error registering display:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/displays/pairing/:organisationId
// Get all displays for an organization
router.get('/displays/pairing/:organisationId', async (req: Request, res: Response) => {
  try {
    const { organisationId } = req.params;

    const displays = await prisma.display.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(displays);
  } catch (error) {
    logger.error('Error fetching displays:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/displays/pairing/:displayId/dayplan
// Assign a DayPlan to a display
router.put('/displays/pairing/:displayId/dayplan', async (req: Request, res: Response) => {
  try {
    const { displayId } = req.params;
    const { dayPlanId } = req.body;

    if (!dayPlanId) {
      return res.status(400).json({ error: 'dayPlanId is required' });
    }

    // Update display with dayPlanId
    const updatedDisplay = await prisma.display.update({
      where: { id: displayId },
      data: { currentDayPlanId: dayPlanId }
    });

    logger.info(`DayPlan ${dayPlanId} assigned to display ${displayId}`);
    logger.info(`Display socketId for emission: ${updatedDisplay.socketId}`);

    // Fetch the full DayPlan data to send via socket
    const dayPlan = await prisma.dayPlan.findUnique({
      where: { id: dayPlanId },
      include: {
        scheduleItems: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!dayPlan) {
      logger.error(`DayPlan ${dayPlanId} not found`);
      return res.status(404).json({ error: 'DayPlan not found' });
    }

    // Emit event to display via Socket.IO with full DayPlan data
    const io = req.app.locals.io;
    if (io && updatedDisplay.socketId) {
      try {
        logger.info(`Attempting to emit dayplan-assigned event to socket ${updatedDisplay.socketId}`);
        await io.emitDayPlanUpdate(updatedDisplay.socketId, dayPlan);
        logger.info(`Successfully emitted dayplan-assigned event to socket ${updatedDisplay.socketId}`);
      } catch (error) {
        logger.error('Error emitting dayplan update:', error);
      }
    } else {
      logger.warn(`Cannot emit: io=${!!io}, socketId=${updatedDisplay.socketId}`);
    }

    res.json({
      success: true,
      display: updatedDisplay
    });

  } catch (error) {
    logger.error('Error assigning DayPlan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
