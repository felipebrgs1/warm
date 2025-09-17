import { Router } from 'express';
import { whatsappRoutes } from './whatsapp.routes';

const router = Router();

router.use('/whatsapp', whatsappRoutes);

export { router };