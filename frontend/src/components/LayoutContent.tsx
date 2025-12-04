'use client';

import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Pages that don't need the sidebar/auth
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [user, loading, isAuthPage, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // If not logged in and on a protected route, don't render anything while redirecting
    if (!isAuthPage) return null;
    
    // Render auth pages (login/register) without sidebar
    return <main className="container mx-auto p-4">{children}</main>;
  }

  // If logged in and on auth page, redirect to dashboard
  if (user && isAuthPage) {
    router.push('/tasks');
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-background">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
