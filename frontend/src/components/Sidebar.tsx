'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ListTodo, LogOut, User } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] flex flex-col">
      <div className="p-6 border-b border-[var(--card-border)]">
        <h1 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center text-white">
            CR
          </div>
          Crowd Reply
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link 
          href="/stats" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/stats') 
              ? 'bg-[var(--primary)] text-white' 
              : 'text-muted hover:bg-[var(--secondary)] hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Analytics</span>
        </Link>

        <Link 
          href="/tasks" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/tasks') 
              ? 'bg-[var(--primary)] text-white' 
              : 'text-muted hover:bg-[var(--secondary)] hover:text-white'
          }`}
        >
          <ListTodo size={20} />
          <span className="font-medium">Tasks</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-[var(--card-border)]">
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium truncate max-w-[100px]">{user.name}</span>
              <span className="text-xs text-muted truncate max-w-[100px]">User</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 rounded hover:bg-[var(--card-border)] text-muted hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
