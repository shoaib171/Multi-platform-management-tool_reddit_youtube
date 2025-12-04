import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { ITask, TaskStatus } from '../types';

interface UseTaskReturn {
  task: ITask | null;
  loading: boolean;
  error: string | null;
  updateStatus: (status: TaskStatus) => Promise<void>;
  updateTask: (data: Partial<ITask>) => Promise<void>;
  refreshTask: () => void;
}

export const useTask = (id: string | undefined): UseTaskReturn => {
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task');
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const updateStatus = async (status: TaskStatus) => {
    if (!task) return;
    try {
      const res = await api.put(`/tasks/${task._id}`, { status });
      setTask(res.data);
    } catch (err: any) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  const updateTask = async (data: Partial<ITask>) => {
    if (!task) return;
    try {
      const res = await api.put(`/tasks/${task._id}`, data);
      setTask(res.data);
    } catch (err: any) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  return {
    task,
    loading,
    error,
    updateStatus,
    updateTask,
    refreshTask: fetchTask,
  };
};
