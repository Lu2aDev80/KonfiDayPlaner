import { Router, Request, Response } from 'express'
import { sendMail, testConnection, isEmailEnabled } from '../mailer'
import { renderTestEmail } from '../templates/testEmail'
import { logger } from '../logger'

const router = Router()

// Simple test route to verify SMTP config in environments
router.post('/test', async (req: Request, res: Response) => {
  const { to, name } = req.body ?? {}
  
  logger.info('Email test endpoint called', { to, name })
  
  if (!to) {
    logger.warn('Email test called without recipient')
    return res.status(400).json({ error: 'Missing "to" field in request body' })
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(to)) {
    logger.warn('Invalid email format', { to })
    return res.status(400).json({ error: 'Invalid email address format' })
  }

  // Check if email is enabled
  if (!isEmailEnabled()) {
    logger.warn('Email test requested but email is disabled')
    return res.status(503).json({
      success: false,
      error: 'Email service not configured',
      message: 'Email functionality is currently unavailable. Check SMTP configuration.'
    })
  }
  
  try {
    logger.info('Rendering test email template')
    const html = renderTestEmail(name)
    
    logger.info('Attempting to send test email', { to, hasName: !!name })
    const result = await sendMail({
      to,
      subject: 'KonfiDayPlaner: Test E-Mail 🎉',
      text: `Hallo ${name || 'there'}! Dies ist eine Test-E-Mail vom KonfiDayPlaner. Wenn du diese Nachricht erhältst, funktioniert deine E-Mail-Konfiguration einwandfrei.`,
      html,
    })
    
    if (result.success) {
      logger.info('Test email sent successfully', { to, messageId: result.messageId })
      res.json({ 
        ok: true,
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
        to 
      })
    } else {
      logger.warn('Test email failed', { to, error: result.error, code: result.code })
      res.status(503).json({
        success: false,
        error: result.error || 'Failed to send email',
        code: result.code,
        message: 'Email could not be sent. Check server logs for details.'
      })
    }
  } catch (e: any) {
    logger.error('Unexpected error in email test', { 
      error: e?.message, 
      to
    })
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    })
  }
})

// Test SMTP connection without sending email
router.post('/test-connection', async (req: Request, res: Response) => {
  logger.info('SMTP connection test endpoint called')
  
  try {
    const result = await testConnection()
    
    if (result.success) {
      logger.info('SMTP connection test successful')
      res.json(result)
    } else {
      logger.warn('SMTP connection test failed', result)
      res.status(503).json({
        ...result,
        message: 'Could not connect to SMTP server. Check configuration and network.'
      })
    }
  } catch (error: any) {
    logger.error('Unexpected error in connection test', { 
      error: error.message
    })
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: 'An unexpected error occurred during connection test'
    })
  }
})

export default router
