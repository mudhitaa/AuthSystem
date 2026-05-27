import { Router, IRouter } from 'express';
import {register,verifyEmail,login,logout,refreshToken,getMe,forgotPassword,resetPassword,} from '../controller/auth.controller';

import { authLimiter } from '../middleware/rateLimiter';

const router: IRouter = Router();


router.post('/register',authLimiter, register);
router.get('/verify-email/:token',verifyEmail);
router.post('/login',authLimiter, login);
router.post('/logout',logout);
router.post('/refresh-token',refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token',resetPassword);

// Protected 
router.get('/me', getMe);

export default router;
