import { Router } from 'express';
import { postProvider } from '../controllers/providers';

const router = Router();

router.post('/', (req, res) => postProvider(req, res));

export default router;