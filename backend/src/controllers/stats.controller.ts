import { Request, Response } from 'express';
import statsService from '../services/stats.service';

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const stats = await statsService.getPlatformStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
