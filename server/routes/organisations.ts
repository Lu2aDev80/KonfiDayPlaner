import { Router } from 'express'
import prisma from '../../src/services/db'
import { requireAuth } from '../middleware/session'
import { sendMailSafe } from '../mailer'
import { userInvitationEmail } from '../templates/userInvitationEmail'

const router = Router()

router.get('/', async (_req, res) => {
  const orgs = await prisma.organisation.findMany({
    select: { id: true, name: true, description: true },
    orderBy: { name: 'asc' },
  })
  res.json(orgs)
})

// Get single organisation details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const org = await prisma.organisation.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!org) {
      return res.status(404).json({ error: 'Organisation not found' })
    }

    // Check if user belongs to this organisation
    if (req.user!.organisationId !== id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json(org)
  } catch (error) {
    console.error('Error fetching organisation:', error)
    res.status(500).json({ error: 'Failed to fetch organisation' })
  }
})

// Update organisation
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, logoUrl } = req.body

    // Check if user belongs to this organisation and is admin
    if (req.user!.organisationId !== id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update organisation details' })
    }

    const org = await prisma.organisation.update({
      where: { id },
      data: {
        name,
        description,
        logoUrl,
      },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        updatedAt: true,
      },
    })

    res.json(org)
  } catch (error) {
    console.error('Error updating organisation:', error)
    res.status(500).json({ error: 'Failed to update organisation' })
  }
})

// Get organisation users
router.get('/:id/users', requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    // Check if user belongs to this organisation
    if (req.user!.organisationId !== id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const users = await prisma.user.findMany({
      where: { organisationId: id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Invite user (create new user)
router.post('/:id/users', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { username, email, password, role } = req.body

    // Check if user belongs to this organisation and is admin
    if (req.user!.organisationId !== id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can invite users' })
    }

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        organisationId: id,
        OR: [{ username }, { email }],
      },
    })

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username ? 'Username already taken' : 'Email already registered',
      })
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        organisationId: id,
        username,
        email,
        passwordHash,
        role: role === 'admin' ? 'admin' : 'member',
        emailVerified: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    // Get organisation details for email
    const organisation = await prisma.organisation.findUnique({
      where: { id },
      select: { name: true },
    })

    // Send invitation email
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const loginUrl = `${baseUrl}/login`
    
    const emailSent = await sendMailSafe({
      to: email,
      subject: `Welcome to ${organisation?.name || 'KonfiDayPlaner'}`,
      html: userInvitationEmail(
        username,
        organisation?.name || 'KonfiDayPlaner',
        req.user!.username,
        password, // Send the plain password in the email (they'll need to change it)
        loginUrl
      ),
    })

    if (!emailSent) {
      console.warn('Failed to send invitation email, but user was created')
    }

    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error inviting user:', error)
    res.status(500).json({ error: 'Failed to invite user' })
  }
})

// Remove user
router.delete('/:id/users/:userId', requireAuth, async (req, res) => {
  try {
    const { id, userId } = req.params

    // Check if user belongs to this organisation and is admin
    if (req.user!.organisationId !== id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can remove users' })
    }

    // Prevent self-deletion
    if (req.user!.id === userId) {
      return res.status(400).json({ error: 'You cannot remove yourself' })
    }

    // Check if user exists and belongs to organisation
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userToDelete || userToDelete.organisationId !== id) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Delete user and their sessions
    await prisma.user.delete({
      where: { id: userId },
    })

    res.json({ success: true, message: 'User removed successfully' })
  } catch (error) {
    console.error('Error removing user:', error)
    res.status(500).json({ error: 'Failed to remove user' })
  }
})

export default router
