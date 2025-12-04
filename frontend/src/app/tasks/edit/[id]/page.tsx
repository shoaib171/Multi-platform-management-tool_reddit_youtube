'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTask } from '../../../../hooks/useTask';
import { TaskPlatform } from '../../../../types';
import { useAuth } from '../../../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function EditTask() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const { task, loading: taskLoading, updateTask } = useTask(id as string);
  
  const [platform, setPlatform] = useState<TaskPlatform>(TaskPlatform.REDDIT);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user && !taskLoading) {
      router.push('/login');
      return;
    }

    if (task) {
      setPlatform(task.platform);
      setContent(task.content);
      
      if (task.platform === TaskPlatform.REDDIT) setUrl(task.threadUrl || '');
      if (task.platform === TaskPlatform.YOUTUBE) setUrl(task.videoUrl || '');
      if (task.platform === TaskPlatform.TRUSTPILOT) {
        setUrl(task.businessUrl || '');
        setReviewTitle(task.reviewTitle || '');
      }
    }
  }, [task, user, router, taskLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const data: any = {
      platform,
      content,
    };

    if (platform === TaskPlatform.REDDIT) {
      data.threadUrl = url;
    } else if (platform === TaskPlatform.YOUTUBE) {
      data.videoUrl = url;
    } else if (platform === TaskPlatform.TRUSTPILOT) {
      data.businessUrl = url;
      data.reviewTitle = reviewTitle;
    }

    try {
      await updateTask(data);
      router.push(`/tasks/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  if (taskLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="flex justify-center">
      <div className="card w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.back()} className="text-muted hover:text-white">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl">Edit Task</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="label">Platform</label>
            <div className="grid grid-cols-3 gap-4">
              {Object.values(TaskPlatform).map((p) => (
                <button
                  key={p}
                  type="button"
                  // Disable changing platform for existing tasks to avoid schema issues or complexity
                  disabled={true} 
                  className={`p-3 rounded border text-center capitalize transition-colors opacity-50 cursor-not-allowed ${
                    platform === p
                      ? 'border-primary bg-primary text-white'
                      : 'border-card-border'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">Platform cannot be changed after creation.</p>
          </div>

          <div>
            <label className="label">Task Content / Comment</label>
            <textarea
              className="input"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>

          {platform === TaskPlatform.REDDIT && (
            <div>
              <label className="label">Thread URL</label>
              <input
                type="url"
                className="input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://reddit.com/r/..."
                required
              />
            </div>
          )}

          {platform === TaskPlatform.YOUTUBE && (
            <div>
              <label className="label">Video URL</label>
              <input
                type="url"
                className="input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
          )}

          {platform === TaskPlatform.TRUSTPILOT && (
            <>
              <div>
                <label className="label">Business URL</label>
                <input
                  type="url"
                  className="input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://trustpilot.com/review/..."
                  required
                />
              </div>
              <div className="mt-4">
                <label className="label">Review Title</label>
                <input
                  type="text"
                  className="input"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Great service!"
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
