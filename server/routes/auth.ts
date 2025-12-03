import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import dayjs from 'dayjs'
import prisma from '../../src/services/db'
import { logger } from '../logger'
import { sendMail, isEmailEnabled, sendMailSafe } from "../mailer";
import { renderVerificationEmail } from "../templates/verificationEmail";

const router = Router();

// Helper function to send verification email (non-blocking, graceful failure)
async function sendVerificationEmailSafe(
  email: string,
  username: string,
  orgName: string,
  token: string,
  req: any
): Promise<boolean> {
  if (!isEmailEnabled()) {
    logger.warn('Email disabled - skipping verification email', { email });
    return false;
  }

  try {
    const basePath = process.env.APP_BASE_PATH || '';
    // In production, use FRONTEND_HOST; in dev, try to construct from request
    const frontendHost = process.env.FRONTEND_HOST || 
                         (process.env.NODE_ENV === 'production' 
                           ? 'https://lu2adevelopment.de' 
                           : `${req.protocol}://${req.get("host")}`);
    const verificationLink = `${frontendHost}${basePath}/verify-email?token=${token}`;
    const emailHtml = renderVerificationEmail(username, orgName, verificationLink);
    
    const result = await sendMail({
      to: email,
      subject: "E-Mail-Adresse bestätigen - Chaos Ops",
      html: emailHtml,
    });

    if (result.success) {
      logger.info(`Verification email sent to ${email}`);
      return true;
    } else {
      logger.warn(`Failed to send verification email: ${result.error}`, { email, code: result.code });
      return false;
    }
  } catch (error: any) {
    logger.error("Unexpected error sending verification email", { error: error.message, email });
    return false;
  }
}

async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = dayjs().add(7, "day").toDate();
  await prisma.session.create({ data: { token, userId, expiresAt } });
  return { token, expiresAt };
}

function setSessionCookie(res: any, token: string, expiresAt: Date) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie("sid", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction, // Use secure cookies in production (HTTPS)
    expires: expiresAt,
    path: "/",
  });
}

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.sid as string | undefined;
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: { include: { organisation: true } } },
    });
    if (!session) return res.status(401).json({ error: "Not authenticated" });
    res.json({
      user: {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        role: session.user.role,
        organisationId: session.user.organisationId,
        emailVerified: session.user.emailVerified,
      },
      organisation: {
        id: session.user.organisation.id,
        name: session.user.organisation.name,
        description: session.user.organisation.description,
      },
    });
  } catch (e) {
    logger.error("me endpoint failed", e);
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/signup", async (req, res) => {
  const { orgName, description, adminUsername, adminEmail, password } =
    req.body ?? {};
  if (!orgName || !adminUsername || !adminEmail || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Only generate verification token if email is enabled
    const verificationToken = isEmailEnabled() ? crypto.randomBytes(32).toString("hex") : null;
    const tokenExpiresAt = isEmailEnabled() ? dayjs().add(24, "hour").toDate() : null;

    const result = await prisma.$transaction(async (tx) => {
      const organisation = await tx.organisation.create({
        data: { name: orgName, description },
      });
      const user = await tx.user.create({
        data: {
          organisationId: organisation.id,
          username: adminUsername,
          email: adminEmail,
          passwordHash,
          role: "admin",
          // Auto-verify if email is disabled, otherwise require verification
          emailVerified: !isEmailEnabled(),
          emailVerificationToken: verificationToken,
          tokenExpiresAt,
        },
      });
      return { organisation, user };
    });

    // Try to send verification email (non-blocking - failure won't prevent signup)
    let emailSent = false;
    if (isEmailEnabled() && verificationToken) {
      emailSent = await sendVerificationEmailSafe(
        adminEmail,
        adminUsername,
        orgName,
        verificationToken,
        req
      );
    }

    const message = emailSent
      ? "Account created successfully. Please check your email to verify your account."
      : isEmailEnabled()
      ? "Account created successfully. Email verification is temporarily unavailable. You can request a new verification email later."
      : "Account created successfully. Email verification is disabled.";

    res.status(201).json({
      organisation: result.organisation,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        emailVerified: result.user.emailVerified,
      },
      message,
      emailSent,
      requiresVerification: isEmailEnabled() && !result.user.emailVerified,
    });
  } catch (err: any) {
    if (err?.code === "P2002")
      return res
        .status(409)
        .json({ error: "Username or email already in use" });
    logger.error("signup error", err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/login", async (req, res) => {
  const { organisationId, usernameOrEmail, password } = req.body ?? {};
  if (!organisationId || !usernameOrEmail || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const org = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) return res.status(404).json({ error: "Organisation not found" });

    const user = await prisma.user.findFirst({
      where: {
        organisationId,
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Only require email verification if email is enabled
    if (!user.emailVerified && isEmailEnabled()) {
      return res.status(403).json({
        error: "Email not verified",
        message: "Please verify your email address before logging in.",
        canResendVerification: true,
        userId: user.id,
        email: user.email, // Include email so frontend can use it for resend
      });
    }

    const { token, expiresAt } = await createSession(user.id);
    setSessionCookie(res, token, expiresAt);

    res.json({
      organisation: { id: org.id, name: org.name },
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    logger.error("login error", err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/logout", async (req, res) => {
  const token = req.cookies?.sid as string | undefined;
  if (token) await prisma.session.delete({ where: { token } }).catch(() => {});
  res.clearCookie("sid", { path: "/" });
  res.json({ ok: true });
});

// Verify email with token
router.post("/verify-email", async (req, res) => {
  const { token } = req.body ?? {};
  if (!token) {
    return res.status(400).json({ error: "Verification token required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
      include: { organisation: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid verification token" });
    }

    if (user.tokenExpiresAt && dayjs().isAfter(user.tokenExpiresAt)) {
      return res.status(410).json({ error: "Verification token expired" });
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    // Mark email as verified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        tokenExpiresAt: null,
      },
    });

    // Create session for verified user
    const { token: sessionToken, expiresAt } = await createSession(user.id);
    setSessionCookie(res, sessionToken, expiresAt);

    res.json({
      message: "Email verified successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: true,
      },
      organisation: {
        id: user.organisation.id,
        name: user.organisation.name,
        description: user.organisation.description,
      },
    });
  } catch (err) {
    logger.error("email verification error", err);
    res.status(500).json({ error: "Internal error" });
  }
});
// Resend verification email
router.post("/resend-verification", async (req, res) => {
  const { email, organisationId } = req.body ?? {};
  if (!email || !organisationId) {
    return res
      .status(400)
      .json({ error: "Email and organisation ID required" });
  }

  // Check if email is enabled
  if (!isEmailEnabled()) {
    logger.warn('Verification resend requested but email is disabled', { email });
    return res.status(503).json({
      error: "Email service unavailable",
      message: "Email verification is currently unavailable. Please try again later or contact support.",
      emailEnabled: false,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email, organisationId },
      include: { organisation: true },
    });

    if (!user) {
      // Don't reveal if user exists
      return res.json({
        message: "If an account with that email exists, a verification email will be sent.",
        sent: false,
      });
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = dayjs().add(24, "hour").toDate();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        tokenExpiresAt,
      },
    });

    // Send new verification email (non-blocking)
    const emailSent = await sendVerificationEmailSafe(
      email,
      user.username,
      user.organisation.name,
      verificationToken,
      req
    );

    if (emailSent) {
      res.json({
        message: "Verification email sent successfully",
        sent: true,
      });
    } else {
      res.status(503).json({
        error: "Failed to send email",
        message: "Could not send verification email. Please try again later.",
        sent: false,
      });
    }
  } catch (err) {
    logger.error("resend verification error", err);
    res.status(500).json({ error: "Internal error" });
  }
});

export default router
