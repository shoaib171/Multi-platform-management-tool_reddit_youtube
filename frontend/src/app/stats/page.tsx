'use client';

import { useStats } from '../../hooks/useStats';
import { BarChart2, CheckCircle, DollarSign, List } from 'lucide-react';

export default function Stats() {
  const { stats, loading } = useStats();

  if (loading) return <div className="text-center py-12">Loading stats...</div>;

  const totalTasks = stats.reduce((acc, curr) => acc + curr.totalTasks, 0);
  const totalPublished = stats.reduce((acc, curr) => acc + curr.publishedTasks, 0);
  const totalRevenue = stats.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <div>
      <h1 className="text-2xl mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
            <List size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">Total Tasks</p>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-500/20 text-green-500">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">Published Tasks</p>
            <p className="text-2xl font-bold">{totalPublished}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">Total Value</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl mb-4">Platform Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.platform} className="card">
            <div className="flex justify-between items-center mb-4">
              <span className={`badge badge-${stat.platform} text-lg px-3 py-1`}>
                {stat.platform}
              </span>
              <BarChart2 size={20} className="text-muted" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted">Tasks</span>
                <span className="font-bold">{stat.totalTasks}</span>
              </div>
              <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full" 
                  style={{ width: `${(stat.publishedTasks / stat.totalTasks) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Published</span>
                <span>{stat.publishedTasks} ({Math.round((stat.publishedTasks / stat.totalTasks) * 100) || 0}%)</span>
              </div>
              <div className="pt-4 border-t border-card-border flex justify-between items-center">
                <span className="text-muted">Value</span>
                <span className="font-bold text-success">${stat.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
