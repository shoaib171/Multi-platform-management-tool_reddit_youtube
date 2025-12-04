import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { IStats } from '../types';

interface UseStatsReturn {
  stats: IStats[];
  loading: boolean;
  error: string | null;
  refreshStats: () => void;
}

export const useStats = (): UseStatsReturn => {
  const [stats, setStats] = useState<IStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/stats/platform-summary');
      setStats(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};
