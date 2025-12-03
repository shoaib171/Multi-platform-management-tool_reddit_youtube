'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import { TaskPlatform } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Youtube, MessageCircle, Star } from 'lucide-react';

export default function CreateTask() {
  const { user } = useAuth();
  const router = useRouter();
  const [platform, setPlatform] = useState<TaskPlatform>(TaskPlatform.REDDIT);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      await api.post('/tasks', data);
      router.push('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (p: TaskPlatform) => {
    switch (p) {
      case TaskPlatform.REDDIT: return <MessageCircle size={20} />;
      case TaskPlatform.YOUTUBE: return <Youtube size={20} />;
      case TaskPlatform.TRUSTPILOT: return <Star size={20} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-muted hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Create New Task</h1>
      </div>

      <div className="card bg-[var(--card-bg)] border-[var(--card-border)] p-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted uppercase tracking-wider">Select Platform</label>
            <div className="grid grid-cols-3 gap-4">
              {Object.values(TaskPlatform).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    platform === p
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'border-[var(--card-border)] hover:border-[var(--secondary-hover)] hover:bg-[var(--secondary)] text-muted'
                  }`}
                >
                  {getPlatformIcon(p)}
                  <span className="capitalize font-medium">{p}</span>
                  {platform === p && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted uppercase tracking-wider">Task Details</label>
            <div className="space-y-4">
              <div>
                <textarea
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-4 text-[var(--foreground)] placeholder:text-muted/50 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all resize-none"
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What needs to be done? Describe the task..."
                  required
                />
              </div>

              {platform === TaskPlatform.REDDIT && (
                <div className="relative">
                  <input
                    type="url"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-4 pl-12 text-[var(--foreground)] placeholder:text-muted/50 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://reddit.com/r/..."
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                    <MessageCircle size={20} />
                  </div>
                </div>
              )}

              {platform === TaskPlatform.YOUTUBE && (
                <div className="relative">
                  <input
                    type="url"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-4 pl-12 text-[var(--foreground)] placeholder:text-muted/50 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                    <Youtube size={20} />
                  </div>
                </div>
              )}

              {platform === TaskPlatform.TRUSTPILOT && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="url"
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-4 pl-12 text-[var(--foreground)] placeholder:text-muted/50 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://trustpilot.com/review/..."
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                      <Star size={20} />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-4 text-[var(--foreground)] placeholder:text-muted/50 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Review Title (e.g., Great Service!)"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-[var(--card-border)]">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border border-[var(--card-border)] hover:bg-[var(--secondary)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
