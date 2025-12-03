import express from 'express';
import { getPlatformStats } from '../controllers/stats.controller';

const router = express.Router();

router.get('/platform-summary', getPlatformStats);

export default router;
