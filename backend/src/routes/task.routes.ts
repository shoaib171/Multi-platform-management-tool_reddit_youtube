import express from 'express';
import { createTask, getTasks, getTaskById, updateTask } from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(protect, updateTask);

export default router;
