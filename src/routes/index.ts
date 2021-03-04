import { Router } from 'express';
import providers from './providers';

const router = Router();

router.use('/providers', providers);

export default router;