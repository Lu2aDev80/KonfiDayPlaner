import * as nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import { logger } from './logger'

export type MailOptions = {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
}

export type EmailResult = {
  success: boolean
  messageId?: string
  error?: string
  code?: string
}

function getFromAddress(): string {
  const name = process.env.MAIL_FROM_NAME || 'KonfiDayPlaner'
  const email = process.env.MAIL_FROM_EMAIL || 'noreply@localhost'
  return `${name} <${email}>`
}

let transporter: Transporter | null = null
let emailEnabled = true // Flag to disable email after repeated failures

function isEmailConfigured(): boolean {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  return !!(host && user && pass)
}

export function getTransporter(): Transporter | null {
  if (!emailEnabled) {
    logger.warn('Email functionality is disabled due to previous errors')
    return null
  }

  if (transporter) return transporter
  
  if (!isEmailConfigured()) {
    logger.warn('SMTP not configured. Email functionality will be disabled.')
    logger.info('To enable emails, set: SMTP_HOST, SMTP_USER, SMTP_PASS')
    emailEnabled = false
    return null
  }

  const host = process.env.SMTP_HOST!
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER!
  const pass = process.env.SMTP_PASS!
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465
  const ignoreTLS = String(process.env.SMTP_IGNORE_TLS || '').toLowerCase() === 'true'
  const requireTLS = String(process.env.SMTP_REQUIRE_TLS || '').toLowerCase() === 'true'
  const rejectUnauthorized = String(process.env.SMTP_REJECT_UNAUTHORIZED || 'false').toLowerCase() !== 'false'

  logger.info('Initializing SMTP transporter', {
    host,
    port,
    secure,
    user: user.substring(0, 5) + '***'
  })

  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        ignoreTLS,
        requireTLS,
        rejectUnauthorized,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      pool: true, // Use pooled connections
      maxConnections: 5,
      maxMessages: 100,
      debug: process.env.LOG_LEVEL === 'debug',
      logger: process.env.LOG_LEVEL === 'debug'
    } as SMTPTransport.Options)
    
    logger.info('SMTP transporter created successfully')
    return transporter
  } catch (error: any) {
    logger.error('Failed to create SMTP transporter', { error: error.message })
    emailEnabled = false
    return null
  }
}

export async function sendMail(opts: MailOptions): Promise<EmailResult> {
  // Validate input
  if (!opts.to) {
    return { success: false, error: 'Email recipient is required' }
  }
  
  if (!opts.subject) {
    return { success: false, error: 'Email subject is required' }
  }
  
  if (!opts.html && !opts.text) {
    return { success: false, error: 'Email content is required' }
  }

  // Check if email is configured
  if (!isEmailConfigured()) {
    logger.warn('Email not sent - SMTP not configured', { to: opts.to, subject: opts.subject })
    return { 
      success: false, 
      error: 'Email service not configured',
      code: 'NOT_CONFIGURED'
    }
  }

  // Get transporter
  const tx = getTransporter()
  if (!tx) {
    logger.warn('Email not sent - transporter unavailable', { to: opts.to, subject: opts.subject })
    return { 
      success: false, 
      error: 'Email service unavailable',
      code: 'NO_TRANSPORTER'
    }
  }
  
  try {
    logger.info('Sending email', { 
      to: Array.isArray(opts.to) ? opts.to.join(',') : opts.to,
      subject: opts.subject
    })
    
    const info = await tx.sendMail({
      from: opts.from || getFromAddress(),
      to: Array.isArray(opts.to) ? opts.to.join(',') : opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    })
    
    logger.info('Email sent successfully', { 
      messageId: info.messageId, 
      to: Array.isArray(opts.to) ? opts.to.join(',') : opts.to,
      accepted: info.accepted,
      rejected: info.rejected
    })
    
    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error: any) {
    logger.error('Failed to send email', { 
      error: error.message, 
      code: error.code,
      to: opts.to
    })
    
    // Don't disable email for temporary errors
    const temporaryErrors = ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND']
    if (!temporaryErrors.includes(error.code)) {
      // Disable email for persistent configuration issues
      if (error.code === 'EAUTH' || error.message.includes('Access denied')) {
        logger.error('Disabling email due to authentication/access error')
        emailEnabled = false
        transporter = null
      }
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code
    }
  }
}

export async function sendMailSafe(opts: MailOptions): Promise<boolean> {
  const result = await sendMail(opts)
  return result.success
}

export async function testConnection(): Promise<EmailResult & { config?: any }> {
  if (!isEmailConfigured()) {
    return {
      success: false,
      error: 'SMTP not configured',
      config: {
        host: 'not set',
        port: 'not set',
        user: 'not set'
      }
    }
  }

  const tx = getTransporter()
  if (!tx) {
    return {
      success: false,
      error: 'Could not create transporter'
    }
  }

  try {
    logger.info('Testing SMTP connection...')
    await tx.verify()
    logger.info('SMTP connection test successful')
    
    return {
      success: true,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? '***configured***' : 'not set'
      }
    }
  } catch (error: any) {
    logger.error('SMTP connection test failed', {
      error: error.message,
      code: error.code
    })
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? '***configured***' : 'not set'
      }
    }
  }
}

export function isEmailEnabled(): boolean {
  return emailEnabled && isEmailConfigured()
}
