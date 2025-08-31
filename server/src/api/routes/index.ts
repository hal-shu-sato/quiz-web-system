import { Router } from 'express';
import mainRoutes from './main';
import adminRoutes from './admin';

const router = Router();

router.use('/', mainRoutes);
router.use('/admin', adminRoutes);

export default router;
