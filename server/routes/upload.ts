import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { requireAuth } from '../middleware/session'
import type { Request } from 'express'

const router = Router()

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: { id: string; role: 'admin' | 'member'; organisationId: string; username: string }
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logos')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `logo-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only images
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG images are allowed.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Upload organisation logo
router.post('/logo', requireAuth, upload.single('logo'), (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Check if user is admin
    if (req.user!.role !== 'admin') {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path)
      return res.status(403).json({ error: 'Only admins can upload logos' })
    }

    // Return the URL path to the uploaded file
    const logoUrl = `/uploads/logos/${req.file.filename}`
    
    res.json({
      success: true,
      logoUrl,
      filename: req.file.filename,
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: error.message || 'Failed to upload file' })
  }
})

export default router
