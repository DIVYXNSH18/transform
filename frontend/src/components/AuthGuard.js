'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === '/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('transformai_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-orange-500 font-mono text-sm animate-pulse">
        VERIFYING SESSION STATE...
      </div>
    );
  }

  return children;
}
