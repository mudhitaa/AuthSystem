import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types';

export const signAccessToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE ?? '15m') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id } as JwtPayload, secret, options);
};

export const signRefreshToken = (id: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not defined');
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRE ?? '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id } as JwtPayload, secret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.verify(token, secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not defined');
  return jwt.verify(token, secret) as JwtPayload;
};
