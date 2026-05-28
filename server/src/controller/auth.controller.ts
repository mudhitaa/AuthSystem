import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import sendEmail from '../utils/sendEmail';
import {signAccessToken, signRefreshToken,verifyRefreshToken,} from '../utils/token';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema,} from '../utils/validation';
import { RegisterBody, LoginBody } from '../types';


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
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

        const verifyToken = crypto.randomBytes(32).toString('hex');
        console.log("1. before user create");
        const user = await User.create({
        name,
        email,
        password,
        verifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
        });
        console.log("2. after user create");

        const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

        await sendEmail({
        to: email,
        subject: 'Verify your email',
        html: `
            <h2>Welcome, ${name}!</h2>
            <p>Click the link below to verify your email address.</p>
            <a href="${verifyUrl}" style="padding:10px 20px;background:#3B82F6;color:#fff;border-radius:6px;text-decoration:none">
            Verify Email
            </a>
        `,
        });
        console.log("3 email sent");

        res.status(201).json({
        message: 'Account created. Please check your email to verify your account.',
        user: { id: user._id, name: user.name, email: user.email },
        });
        console.log("4. response sent");
  } catch (err) {
  console.error('Register error:', err); 
  res.status(500).json({ message: 'Server error during registration' });
}
};



export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token;

    if (!token || Array.isArray(token)) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({ verifyToken: hashed });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired verification link' });
      return;
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during email verification' });
  }
};




export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = req.body as LoginBody;

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

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};



export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;

    if (!token) {
      res.status(401).json({ message: 'No refresh token' });
      return;
    }

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



export const logout = (_req: Request, res: Response): void => {
res.clearCookie('refreshToken', {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
});

  res.json({ message: 'Logged out successfully' });
};




export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const user = await User.findOne({ email: req.body.email as string });
    if (!user) {
      res.json({ message: 'If that email exists, a reset link has been sent.' });
      return;
    }
    
    if (user._id.toString() === process.env.DEMO_USER_ID) {
      res.json({ message: 'If that email exists, a reset link has been sent.' });
      return;
    }
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>This link expires in 10 minutes.</p>
        <a href="${resetUrl}" style="padding:10px 20px;background:#3B82F6;color:#fff;border-radius:6px;text-decoration:none">
          Reset Password
        </a>
      `,
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch {
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};



function getTokenParam(token: string | string[] | undefined): string | null {
  if (!token || Array.isArray(token)) return null;
  return token;
}


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const token = getTokenParam(req.params.token);

    if (!token) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: new Date() },
    });
    
    if (!user) {
      res.status(400).json({ message: 'Reset link is invalid or has expired' });
      return;
    }
    if (user._id.toString() === process.env.DEMO_USER_ID) {
      res.status(403).json({ message: 'Demo account cannot be edited' });
      return;
    }

    user.password = req.body.password as string;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch {
    res.status(500).json({ message: 'Server error during password reset' });
  }
};


