'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const isAuthenticated = session;

  const handleGithubLogin = async () => {
    try {
      await signIn('github', { 
        callbackUrl: window.location.pathname || '/',
        redirect: true 
      });
    } catch (error) {
      console.error('GitHub login error:', error);
    }
  };

  const handleDisconnect = async () => {
    await signOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm border-b border-red-900/30 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/un.png" alt="UnRepo Logo" className="w-16 h-16 object-contain" />
                <span className="text-xl font-bold text-white">UnRepo</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={`fixed top-0 w-full backdrop-blur-sm border-b z-50 transition-colors ${
        theme === 'dark' 
          ? 'bg-black/90 border-red-900/30' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/un.png" alt="UnRepo Logo" className="w-16 h-16 object-contain" />
                <span className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>dashboard</span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link href="/api" className={`transition ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  api
                </Link>
                <Link href="/docs" className={`transition ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  docs
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition ${
                  theme === 'dark' 
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-red-500' 
                    : 'bg-gray-100 hover:bg-gray-200 text-red-600'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.button>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/app"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Open App
                  </Link>
                  <div className="flex items-center space-x-2">
                    {session?.user?.image && (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDisconnect}
                      className={`p-2 rounded-lg transition ${
                        theme === 'dark'
                          ? 'bg-zinc-900 hover:bg-zinc-800 text-red-500'
                          : 'bg-gray-100 hover:bg-gray-200 text-red-600'
                      }`}
                      title="Disconnect"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGithubLogin}
                  className={`px-5 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Connect GitHub
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
