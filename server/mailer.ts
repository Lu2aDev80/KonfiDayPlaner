import nodemailer from 'nodemailer'
import { logger } from './logger'

export type MailOptions = {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
}

function getFromAddress() {
  const name = process.env.MAIL_FROM_NAME || 'KonfiDayPlaner'
  const email = process.env.MAIL_FROM_EMAIL || 'info@lu2adevelopment.de'
  return `${name} <${email}>`
}

let transporter: nodemailer.Transporter | null = null

export function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465

  if (!host || !user || !pass) {
    logger.warn('SMTP not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS')
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  })
  return transporter
}

export async function sendMail(opts: MailOptions) {
  const tx = getTransporter()
  const info = await tx.sendMail({
    from: opts.from || getFromAddress(),
    to: Array.isArray(opts.to) ? opts.to.join(',') : opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  })
  logger.info('Mail sent', { messageId: info.messageId })
  return info
}
