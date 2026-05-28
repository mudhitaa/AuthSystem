import { Router, type Router as RouterType } from 'express';
import {changePassword, getMe, updateProfile} from '../controller/dashboard.controller';
import protect from '../middleware/protect';

const dashboardRouter: RouterType = Router();

dashboardRouter.get('/me',protect, getMe);
dashboardRouter.patch('/update-profile', protect, updateProfile);
dashboardRouter.patch('/change-password',protect, changePassword);

export default dashboardRouter;
