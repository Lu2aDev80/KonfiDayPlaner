import { Router } from 'express';
import prisma from '../../src/services/db';
import { requireAuth } from '../middleware/session';
import { logger } from '../logger';

const router = Router();

// Get all event tags for an organisation
router.get('/organisations/:orgId/event-tags', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    
    const tags = await prisma.eventTag.findMany({
      where: { organisationId: orgId },
      orderBy: { name: 'asc' }
    });

    res.json(tags);
  } catch (error) {
    logger.error('Failed to fetch event tags', error);
    res.status(500).json({ error: 'Failed to fetch event tags' });
  }
});

// Create event tag
router.post('/organisations/:orgId/event-tags', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const tag = await prisma.eventTag.create({
      data: {
        name,
        color: color || '#64748b',
        organisationId: orgId
      }
    });

    res.json(tag);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Tag with this name already exists' });
    }
    logger.error('Failed to create event tag', error);
    res.status(500).json({ error: 'Failed to create event tag' });
  }
});

// Update event tag
router.patch('/event-tags/:tagId', requireAuth, async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name, color } = req.body;

    const tag = await prisma.eventTag.update({
      where: { id: tagId },
      data: {
        ...(name && { name }),
        ...(color && { color })
      }
    });

    res.json(tag);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Tag with this name already exists' });
    }
    logger.error('Failed to update event tag', error);
    res.status(500).json({ error: 'Failed to update event tag' });
  }
});

// Delete event tag
router.delete('/event-tags/:tagId', requireAuth, async (req, res) => {
  try {
    const { tagId } = req.params;

    await prisma.eventTag.delete({
      where: { id: tagId }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete event tag', error);
    res.status(500).json({ error: 'Failed to delete event tag' });
  }
});

// Get all schedule item tags for an organisation
router.get('/organisations/:orgId/schedule-item-tags', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    
    const tags = await prisma.scheduleItemTag.findMany({
      where: { organisationId: orgId },
      orderBy: { name: 'asc' }
    });

    res.json(tags);
  } catch (error) {
    logger.error('Failed to fetch schedule item tags', error);
    res.status(500).json({ error: 'Failed to fetch schedule item tags' });
  }
});

// Create schedule item tag
router.post('/organisations/:orgId/schedule-item-tags', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const tag = await prisma.scheduleItemTag.create({
      data: {
        name,
        color: color || '#64748b',
        organisationId: orgId
      }
    });

    res.json(tag);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Tag with this name already exists' });
    }
    logger.error('Failed to create schedule item tag', error);
    res.status(500).json({ error: 'Failed to create schedule item tag' });
  }
});

// Update schedule item tag
router.patch('/schedule-item-tags/:tagId', requireAuth, async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name, color } = req.body;

    const tag = await prisma.scheduleItemTag.update({
      where: { id: tagId },
      data: {
        ...(name && { name }),
        ...(color && { color })
      }
    });

    res.json(tag);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Tag with this name already exists' });
    }
    logger.error('Failed to update schedule item tag', error);
    res.status(500).json({ error: 'Failed to update schedule item tag' });
  }
});

// Delete schedule item tag
router.delete('/schedule-item-tags/:tagId', requireAuth, async (req, res) => {
  try {
    const { tagId } = req.params;

    await prisma.scheduleItemTag.delete({
      where: { id: tagId }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete schedule item tag', error);
    res.status(500).json({ error: 'Failed to delete schedule item tag' });
  }
});

export default router;
