'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontWeights } from '@/lib/styles';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-gradient">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className={`${FontWeights.MEDIUM} text-gray-600`}>Redirecting to login...</p>
      </div>
    </div>
  );
}
