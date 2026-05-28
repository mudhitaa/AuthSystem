import { Router, type Router as RouterType } from 'express';
import {changePassword, getMe, updateProfile} from '../controller/dashboard.controller';
import protect from '../middleware/protect';
import { deleteAccount } from '../controller/dashboard.controller';


const dashboardRouter: RouterType = Router();

dashboardRouter.get('/me',protect, getMe);
dashboardRouter.patch('/update-profile', protect, updateProfile);
dashboardRouter.patch('/change-password',protect, changePassword);
dashboardRouter.delete('/delete-account', protect, deleteAccount);

export default dashboardRouter;
