import { Router, type Router as RouterType } from 'express';
import {register,verifyEmail,login,logout,refreshToken,forgotPassword,resetPassword,} from '../controller/auth.controller';

import { authLimiter } from '../middleware/rateLimiter';


const authRouter: RouterType = Router();


authRouter.post('/register',authLimiter, register);
authRouter.get('/verify-email/:token',verifyEmail);
authRouter.post('/login',authLimiter, login);
authRouter.post('/logout',logout);
authRouter.post('/refresh-token',refreshToken);
authRouter.post('/forgot-password', authLimiter, forgotPassword);
authRouter.put('/reset-password/:token',resetPassword);



export default authRouter;
