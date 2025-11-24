'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '@/lib/instant';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, user } = db.useAuth();

  useEffect(() => {
    // Allow access to login and setup pages without authentication
    const publicPaths = ['/admin/login', '/admin/setup'];
    if (publicPaths.includes(pathname)) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/admin/login');
    }
  }, [isLoading, user, router, pathname]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // For protected routes, show nothing until auth is confirmed
  const publicPaths = ['/admin/login', '/admin/setup'];
  if (!publicPaths.includes(pathname) && !user) {
    return null;
  }

  return <>{children}</>;
}

