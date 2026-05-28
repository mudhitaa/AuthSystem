import { Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Not authorised' });
      return;
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};




export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email } = req.body as { name?: string; email?: string };

  const user = await User.findById(req.user?._id);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  const emailChanged = email && email !== user.email;

  // Check new email not already taken
  if (emailChanged) {
    const taken = await User.findOne({ email });
    if (taken) { res.status(400).json({ message: 'Email already in use' }); return; }
  }

  // Update name if provided
  if (name) user.name = name;

  // If email changed — update + trigger re-verification
  if (emailChanged) {
    user.email = email!;
    user.isVerified = false;

    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.verifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    await sendEmail({
      to: email!,
      subject: 'Verify your new email address',
      html: `
        <h2>Email address changed</h2>
        <p>Please verify your new email address. This link expires in 24 hours.</p>
        <a href="${verifyUrl}" style="padding:10px 20px;background:#1e293b;color:#fff;border-radius:6px;text-decoration:none">
          Verify new email
        </a>
      `,
    });

    // Tell frontend to log out
    res.json({ message: 'Email updated. Please verify your new address.', emailChanged: true });
    return;
  }

  await user.save();
  res.json({
    message: 'Profile updated',
    emailChanged: false,
    user: { id: user._id, name: user.name, email: user.email },
  });
};




export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword: string; newPassword: string;
  };

  const user = await User.findById(req.user?._id).select('+password');
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) { res.status(401).json({ message: 'Current password is incorrect' }); return; }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
};