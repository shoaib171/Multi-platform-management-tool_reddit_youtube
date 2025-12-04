import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { ITask, TaskStatus, TaskPlatform } from '../types';

interface UseTasksReturn {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filterStatus: string;
  filterPlatform: string;
  setPage: (page: number) => void;
  setFilterStatus: (status: string) => void;
  setFilterPlatform: (platform: string) => void;
  refreshTasks: () => void;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: 9 };
      if (filterStatus) params.status = filterStatus;
      if (filterPlatform) params.platform = filterPlatform;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterPlatform]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    page,
    totalPages,
    filterStatus,
    filterPlatform,
    setPage,
    setFilterStatus,
    setFilterPlatform,
    refreshTasks: fetchTasks,
  };
};
