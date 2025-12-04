'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../services/api';
import { ITask, TaskStatus } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, ExternalLink, Calendar, User, DollarSign } from 'lucide-react';

export default function TaskDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    setUpdating(true);
    try {
      const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTask(res.data);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!task) return <div className="text-center py-12">Task not found</div>;

  const getPlatformUrl = () => {
    if (task.platform === 'reddit') return task.threadUrl;
    if (task.platform === 'youtube') return task.videoUrl;
    if (task.platform === 'trustpilot') return task.businessUrl;
    return '#';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-muted hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to Tasks
      </button>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className={`badge badge-${task.platform} mb-2`}>
              {task.platform}
            </span>
            <h1 className="text-2xl mt-2">{task.content}</h1>
          </div>
          <span className={`badge badge-${task.status} text-sm px-3 py-1`}>
            {task.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted">
              <User size={18} />
              <span>Assigned to: <span className="text-white">{task.assignedTo?.name || 'Unassigned'}</span></span>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <DollarSign size={18} />
              <span>Price: <span className="text-white">${task.price.toFixed(2)}</span></span>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <Calendar size={18} />
              <span>Created: <span className="text-white">{new Date(task.createdAt).toLocaleDateString()}</span></span>
            </div>
          </div>

          <div className="bg-background p-4 rounded border border-card-border">
            <h3 className="font-bold mb-2 text-sm text-muted uppercase">Platform Details</h3>
            {task.platform === 'trustpilot' && (
              <div className="mb-2">
                <span className="text-muted text-sm">Review Title: </span>
                <span>{task.reviewTitle}</span>
              </div>
            )}
            <a 
              href={getPlatformUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline break-all"
            >
              <ExternalLink size={16} />
              {getPlatformUrl()}
            </a>
          </div>
        </div>

        {user && (
          <div className="border-t border-card-border pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Actions</h3>
                <button 
                    onClick={() => router.push(`/tasks/edit/${task._id}`)}
                    className="btn btn-secondary text-sm"
                >
                    Edit Details
                </button>
            </div>
            
            <p className="text-sm text-muted mb-3">Update Status:</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(TaskStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || task.status === status}
                  className={`btn btn-secondary capitalize ${
                    task.status === status ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
