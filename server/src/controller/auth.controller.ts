import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import sendEmail from '../utils/sendEmail';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/token';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation';
import { AuthRequest, RegisterBody, LoginBody } from '../types';

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const { name, email, password } = req.body as RegisterBody;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400).json({ message: 'An account with that email already exists' });
    return;
  }

  // Email verify token
  const verifyToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    verifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  await sendEmail({
    to: email,
    subject: 'Verify your email',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Click the link below to verify your email address. It expires in 24 hours.</p>
      <a href="${verifyUrl}" style="padding:10px 20px;background:#3B82F6;color:#fff;border-radius:6px;text-decoration:none">
        Verify Email
      </a>
      <p>Or copy: ${verifyUrl}</p>
    `,
  });

  res.status(201).json({
    message: 'Account created. Please check your email to verify your account.',
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const hashed = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ verifyToken: hashed });
  if (!user) {
    res.status(400).json({ message: 'Invalid or expired verification link' });
    return;
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully. You can now log in.' });
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const { email, password } = req.body as LoginBody;

  // Must select password since it has select: false in schema
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  if (!user.isVerified) {
    res.status(403).json({ message: 'Please verify your email before logging in' });
    return;
  }

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  // Store refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    res.status(401).json({ message: 'No refresh token' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const accessToken = signAccessToken(user._id.toString());
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
};

// ─── GET ME ───────────────────────────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: 'Not authorised' });
    return;
  }
  res.json({ user: { id: user._id, name: user.name, email: user.email } });
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const user = await User.findOne({ email: req.body.email as string });

  // Always send 200 — don't reveal if email exists or not
  if (!user) {
    res.json({ message: 'If that email exists, a reset link has been sent.' });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. This link expires in <strong>10 minutes</strong>.</p>
      <a href="${resetUrl}" style="padding:10px 20px;background:#3B82F6;color:#fff;border-radius:6px;text-decoration:none">
        Reset Password
      </a>
      <p>If you didn't request this, ignore this email — your password won't change.</p>
    `,
  });

  res.json({ message: 'If that email exists, a reset link has been sent.' });
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const hashed = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({ message: 'Reset link is invalid or has expired' });
    return;
  }

  user.password = req.body.password as string;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully. You can now log in.' });
};
