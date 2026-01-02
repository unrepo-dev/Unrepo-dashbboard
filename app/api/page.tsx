'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApiPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home with create tab active
    router.push('/?tab=create');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full" />
    </div>
  );
}
