'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <footer className="bg-black border-t border-red-900/30">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/un.png" alt="UnRepo Logo" className="w-12 h-12 object-contain" />
              <span className="text-xl font-bold text-white">UnRepo</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <a href="https://twitter.com" target="_blank">Twitter</a>
              <a href="https://github.com" target="_blank">GitHub</a>
              <a href="https://discord.com" target="_blank">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className={`border-t transition-colors ${
      theme === 'dark' 
        ? 'bg-black border-red-900/30' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/un.png" alt="UnRepo Logo" className="w-12 h-12 object-contain" />
            <span className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>UnRepo</span>
          </div>
          <div className={`flex items-center justify-center gap-6 text-sm ${
            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>
            <a href="https://twitter.com" target="_blank" className="transition hover:text-red-500">Twitter</a>
            <a href="https://github.com" target="_blank" className="transition hover:text-red-500">GitHub</a>
            <a href="https://discord.com" target="_blank" className="transition hover:text-red-500">Discord</a>
            <a href="/docs" className="transition hover:text-red-500">Docs</a>
            <a href="/support" className="transition hover:text-red-500">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
