'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../services/api';
import { ITask, TaskStatus, TaskPlatform } from '../../types';
import { Filter, Clock, DollarSign, Plus, Search, MoreHorizontal } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 9 };
      if (filterStatus) params.status = filterStatus;
      if (filterPlatform) params.platform = filterPlatform;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filterStatus, filterPlatform]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DRAFT: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case TaskStatus.ASSIGNED: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case TaskStatus.SUBMITTED: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case TaskStatus.PUBLISHED: return 'bg-green-500/10 text-green-500 border-green-500/20';
      case TaskStatus.CANCELLED: return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted">Manage and track your social media tasks</p>
        </div>
        <Link 
          href="/tasks/create" 
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          New Task
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card-bg p-4 rounded-xl border border-card-border">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-background border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative min-w-[150px]">
            <select 
              className="w-full appearance-none bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
              value={filterPlatform}
              onChange={(e) => { setFilterPlatform(e.target.value); setPage(1); }}
            >
              <option value="">All Platforms</option>
              {Object.values(TaskPlatform).map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          <div className="relative min-w-[150px]">
            <select 
              className="w-full appearance-none bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              {Object.values(TaskStatus).map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-card-bg border border-card-border animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Link 
              href={`/tasks/${task._id}`} 
              key={task._id} 
              className="group bg-card-bg border border-card-border rounded-xl p-6 hover:border-[var(--primary)] hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <button className="text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="flex-1 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    task.platform === 'reddit' ? 'text-orange-500' :
                    task.platform === 'youtube' ? 'text-red-500' :
                    'text-green-500'
                  }`}>
                    {task.platform}
                  </span>
                </div>
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {task.content}
                </h3>
              </div>
              
              <div className="pt-4 border-t border-card-border flex items-center justify-between text-sm text-muted">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={14} />
                    <span>{task.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {task.assignedTo && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold" title={task.assignedTo.name}>
                    {task.assignedTo.name.charAt(0)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {tasks.length === 0 && !loading && (
        <div className="text-center py-20 bg-card-bg rounded-xl border border-card-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--secondary)] mb-4">
            <Search size={32} className="text-muted" />
          </div>
          <h3 className="text-xl font-bold mb-2">No tasks found</h3>
          <p className="text-muted max-w-md mx-auto">
            Try adjusting your filters or create a new task to get started.
          </p>
        </div>
      )}

      <div className="flex justify-center pt-8">
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded-lg border border-card-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span className="flex items-center px-4 font-medium bg-card-bg rounded-lg border border-card-border">
            Page {page} of {totalPages || 1}
          </span>
          <button 
            className="px-4 py-2 rounded-lg border border-card-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
