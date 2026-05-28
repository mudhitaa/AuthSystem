import { Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';

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
  const { name, email } = req.body as { name: string; email: string };

  const user = await User.findById(req.user?._id);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  if (email && email !== user.email) {
    const taken = await User.findOne({ email });
    if (taken) { res.status(400).json({ message: 'Email already in use' }); return; }
    user.email = email;
  }
  if (name) user.name = name;
  await user.save();

  res.json({ user: { id: user._id, name: user.name, email: user.email } });
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