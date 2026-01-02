'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Copy, Eye, EyeOff, Key, TrendingUp, Clock, AlertCircle, Activity, Database } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  key: string;
  name?: string;
  type: 'RESEARCH' | 'CHATBOT';
  createdAt: string;
  lastUsedAt: string | null;
  usageCount: number;
  isActive: boolean;
  user?: {
    paymentVerified: boolean;
    isTokenHolder: boolean;
  };
}

interface ApiUsage {
  endpoint: string;
  method: string;
  count: number;
  lastUsed: string;
}

// Utility functions for theme-based styling
const getCardClasses = (theme: string) => 
  theme === 'dark' 
    ? 'bg-zinc-900 border border-gray-800' 
    : 'bg-white border border-gray-200 shadow-sm';

const getTextClasses = (theme: string, variant: 'primary' | 'secondary' = 'primary') => 
  variant === 'primary'
    ? theme === 'dark' ? 'text-white' : 'text-gray-900'
    : theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

const getCodeBlockClasses = (theme: string) =>
  theme === 'dark' ? 'bg-black border border-gray-800 text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-800';

const getAlertClasses = (theme: string) =>
  theme === 'dark' ? 'bg-zinc-900 border border-gray-800' : 'bg-gray-50 border border-gray-200';

export default function DeveloperPortal() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<ApiUsage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('keys');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedApiType, setSelectedApiType] = useState<'RESEARCH' | 'CHATBOT' | null>(null);
  const [apiName, setApiName] = useState('');

  useEffect(() => {
    // Check URL parameters for tab
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['keys', 'usage', 'create'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApiKeys();
      fetchUsageStats();
    }
  }, [status]);

  const fetchApiKeys = async () => {
    try {
      // Fetch from API server
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const email = session?.user?.email || 'anonymous@unrepo.dev';
      
      const res = await fetch(`${apiUrl}/api/keys?email=${email}`);
      const data = await res.json();
      
      if (data.success) {
        setApiKeys(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  const fetchUsageStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const email = session?.user?.email || 'anonymous@unrepo.dev';
      
      const res = await fetch(`${apiUrl}/api/keys/usage?email=${email}`);
      const data = await res.json();
      if (data.success) {
        setUsage(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    }
  };

  const openApiModal = (type: 'RESEARCH' | 'CHATBOT') => {
    setSelectedApiType(type);
    setShowApiModal(true);
    setApiName('');
  };

  const closeApiModal = () => {
    setShowApiModal(false);
    setSelectedApiType(null);
    setApiName('');
  };

  const generateApiKey = async () => {
    if (!selectedApiType) return;
    
    if (!apiName.trim()) {
      alert('Please enter an API name');
      return;
    }
    
    setGenerating(true);
    
    try {
      // Call the separate API server
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: selectedApiType, 
          name: apiName,
          email: session?.user?.email || 'anonymous@unrepo.dev'
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Store API key in localStorage
        const storageKey = selectedApiType === 'CHATBOT' ? 'unrepo_chatbot_key' : 'unrepo_research_key';
        localStorage.setItem(storageKey, data.data.apiKey);
        
        await fetchApiKeys();
        closeApiModal();
        toast.success(`api key generated successfully! saved to your browser.`, {
          description: `key: ${data.data.apiKey.slice(0, 20)}...`,
          duration: 5000,
        });
      } else {
        toast.error(data.error || 'failed to generate api key');
        setGenerating(false);
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
      toast.error('failed to generate api key. please try again.');
      setGenerating(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 20) return key;
    return key.substring(0, 20) + '•'.repeat(key.length - 20);
  };

  if (status === 'loading') {
    return (
      <div className={`min-h-screen p-8 pt-24 animate-fadeIn ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-8 pt-20 animate-fadeIn ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="max-w-2xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-4 text-red-500">developer portal</h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              manage your api keys and monitor usage for unrepo apis
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`border rounded-xl p-8 text-center ${
              theme === 'dark' ? 'bg-red-900/20 border-red-900' : 'bg-red-50 border-red-200'
            }`}
          >
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3 text-red-500">authentication required</h2>
            <p className={`mb-6 text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              you need to sign in to generate and manage api keys. sign in with your github account to get started.
            </p>
            <button 
              onClick={() => signIn('github')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              sign in with github
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const researchKey = apiKeys.find(k => k.type === 'RESEARCH');
  const chatbotKey = apiKeys.find(k => k.type === 'CHATBOT');
  
  // Calculate total API calls
  const totalApiCalls = apiKeys.reduce((sum, key) => sum + key.usageCount, 0);
  const activeKeys = apiKeys.filter(key => key.isActive).length;

  return (
    <div className={`min-h-screen p-8 pt-20 animate-fadeIn ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <p className={`text-lg flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            welcome back, {session?.user?.name || 'developer'} 
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="inline-block text-2xl"
            >
              👋
            </motion.span>
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideUp">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${getCardClasses(theme)} rounded-xl p-6 border-l-4 border-red-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  active api keys
                </p>
                <p className="text-3xl font-bold text-red-500 mt-2">{activeKeys}</p>
              </div>
              <Key className="h-10 w-10 text-red-500 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${getCardClasses(theme)} rounded-xl p-6 border-l-4 border-green-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  total api calls
                </p>
                <p className="text-3xl font-bold text-green-500 mt-2">{totalApiCalls.toLocaleString()}</p>
              </div>
              <Activity className="h-10 w-10 text-green-500 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${getCardClasses(theme)} rounded-xl p-6 border-l-4 border-blue-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  total keys
                </p>
                <p className="text-3xl font-bold text-blue-500 mt-2">{apiKeys.length}</p>
              </div>
              <Database className="h-10 w-10 text-blue-500 opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6 animate-slideDown" style={{ animationDelay: '0.1s' }}>
          <div className={`flex gap-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('keys')}
              className={`px-4 py-2 -mb-px transition-all duration-200 hover:scale-105 active:scale-95 ${
                activeTab === 'keys'
                  ? 'border-b-2 border-red-500 text-red-500'
                  : `${getTextClasses(theme, 'secondary')} ${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`
              }`}
            >
              my api keys
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-4 py-2 -mb-px transition-all duration-200 hover:scale-105 active:scale-95 ${
                activeTab === 'usage'
                  ? 'border-b-2 border-red-500 text-red-500'
                  : `${getTextClasses(theme, 'secondary')} ${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`
              }`}
            >
              usage statistics
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 -mb-px transition-all duration-200 hover:scale-105 active:scale-95 ${
                activeTab === 'create'
                  ? 'border-b-2 border-red-500 text-red-500'
                  : `${getTextClasses(theme, 'secondary')} ${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`
              }`}
            >
              create api key
            </button>
          </div>
        </div>

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="animate-slideLeft">
          <div className="space-y-6">
            {/* research api key */}
            <div className={`${getCardClasses(theme)} rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${getTextClasses(theme)}`}>
                    <Key className="h-5 w-5" />
                    research api key
                  </h2>
                  <p className={`text-sm ${getTextClasses(theme, 'secondary')}`}>
                    analyze github repositories programmatically
                  </p>
                </div>
                {!researchKey && (
                  <button
                    onClick={() => openApiModal('RESEARCH')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    generate key
                  </button>
                )}
              </div>
              {researchKey && (
                <div className="space-y-4">
                  {researchKey.name && (
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className="text-sm font-semibold">{researchKey.name}</p>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 p-4 ${getCodeBlockClasses(theme)} rounded-lg font-mono text-sm`}>
                    <code className={`flex-1 ${getTextClasses(theme, 'secondary')}`}>
                      {showKeys[researchKey.id] ? researchKey.key : maskApiKey(researchKey.key)}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(researchKey.id)}
                      className={`p-2 ${getHoverClasses(theme)} rounded`}
                    >
                      {showKeys[researchKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(researchKey.key, researchKey.id)}
                      className={`p-2 ${getHoverClasses(theme)} rounded transition-all duration-200 hover:scale-110 active:scale-90`}
                    >
                      {copiedKey === researchKey.id ? '✓' : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>tier</p>
                      <p className="font-semibold">
                        {researchKey.user?.paymentVerified || researchKey.user?.isTokenHolder ? (
                          <span className="text-green-500">premium</span>
                        ) : (
                          <span className="text-yellow-500">free</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>calls used</p>
                      <p className="font-semibold">
                        {researchKey.usageCount}
                        {!(researchKey.user?.paymentVerified || researchKey.user?.isTokenHolder) && ' / 5'}
                      </p>
                    </div>
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>created</p>
                      <p className="font-semibold">{new Date(researchKey.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>last used</p>
                      <p className="font-semibold">
                        {researchKey.lastUsedAt ? new Date(researchKey.lastUsedAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  {!(researchKey.user?.paymentVerified || researchKey.user?.isTokenHolder) && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                      <p className="text-sm font-semibold mb-1">free tier Limit</p>
                      <p className="text-xs">
                        {5 - researchKey.usageCount} calls remaining. Upgrade to premium for unlimited calls.
                      </p>
                    </div>
                  )}
                  {(researchKey.user?.paymentVerified || researchKey.user?.isTokenHolder) && (
                    <div className={`${getAlertClasses(theme)} rounded-lg p-4 text-sm`}>
                      <strong>Rate Limit:</strong> 100 requests/hour (premium)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* chatbot api key */}
            <div className={`${getCardClasses(theme)} rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${getTextClasses(theme)}`}>
                    <Key className="h-5 w-5" />
                    chatbot api key
                  </h2>
                  <p className={`text-sm ${getTextClasses(theme, 'secondary')}`}>
                    Chat with AI about repositories via API
                  </p>
                </div>
                {!chatbotKey && (
                  <button
                    onClick={() => openApiModal('CHATBOT')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    generate key
                  </button>
                )}
              </div>
              {chatbotKey && (
                <div className="space-y-4">
                  {chatbotKey.name && (
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className="text-sm font-semibold">{chatbotKey.name}</p>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 p-4 ${getCodeBlockClasses(theme)} rounded-lg font-mono text-sm`}>
                    <code className={`flex-1 ${getTextClasses(theme, 'secondary')}`}>
                      {showKeys[chatbotKey.id] ? chatbotKey.key : maskApiKey(chatbotKey.key)}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(chatbotKey.id)}
                      className={`p-2 ${getHoverClasses(theme)} rounded`}
                    >
                      {showKeys[chatbotKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(chatbotKey.key, chatbotKey.id)}
                      className={`p-2 ${getHoverClasses(theme)} rounded transition-all duration-200 hover:scale-110 active:scale-90`}
                    >
                      {copiedKey === chatbotKey.id ? '✓' : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>tier</p>
                      <p className="font-semibold">
                        {chatbotKey.user?.paymentVerified || chatbotKey.user?.isTokenHolder ? (
                          <span className="text-green-500">premium</span>
                        ) : (
                          <span className="text-yellow-500">free</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>calls used</p>
                      <p className="font-semibold">
                        {chatbotKey.usageCount}
                        {!(chatbotKey.user?.paymentVerified || chatbotKey.user?.isTokenHolder) && ' / 5'}
                      </p>
                    </div>
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>created</p>
                      <p className="font-semibold">{new Date(chatbotKey.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className={getTextClasses(theme, 'secondary')}>last used</p>
                      <p className="font-semibold">
                        {chatbotKey.lastUsedAt ? new Date(chatbotKey.lastUsedAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  {!(chatbotKey.user?.paymentVerified || chatbotKey.user?.isTokenHolder) && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                      <p className="text-sm font-semibold mb-1">free tier Limit</p>
                      <p className="text-xs">
                        {5 - chatbotKey.usageCount} calls remaining. Upgrade to premium for unlimited calls.
                      </p>
                    </div>
                  )}
                  {(chatbotKey.user?.paymentVerified || chatbotKey.user?.isTokenHolder) && (
                    <div className={`${getAlertClasses(theme)} rounded-lg p-4 text-sm`}>
                      <strong>Rate Limit:</strong> 200 requests/hour (premium)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="animate-slideLeft">
          <div className={`${getCardClasses(theme)} rounded-lg p-6`}>
            <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${getTextClasses(theme)}`}>
              <TrendingUp className="h-5 w-5" />
              api usage statistics
            </h2>
            {usage.length === 0 ? (
              <p className={`text-center py-8 ${getTextClasses(theme, 'secondary')}`}>
                No API usage yet. Start making requests to see statistics here.
              </p>
            ) : (
              <div className="space-y-4">
                {usage.map((stat, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 border rounded-lg ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <div>
                      <p className="font-semibold">{stat.endpoint}</p>
                      <p className={`text-sm ${getTextClasses(theme, 'secondary')}`}>{stat.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{stat.count} requests</p>
                      <p className={`text-sm flex items-center gap-1 ${getTextClasses(theme, 'secondary')}`}>
                        <Clock className="h-3 w-3" />
                        {new Date(stat.lastUsed).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}

        {/* Create API Key Tab */}
        {activeTab === 'create' && (
          <div className="animate-slideLeft">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${getCardClasses(theme)} rounded-xl p-8`}
            >
              <h2 className={`text-3xl font-bold mb-6 ${getTextClasses(theme)}`}>
                create new api key
              </h2>
              <p className={`mb-8 ${getTextClasses(theme, 'secondary')}`}>
                choose the type of api key you want to generate. each key is tied to specific unrepo services.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Research API Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-gray-800 hover:border-red-500 bg-zinc-900/50'
                      : 'border-gray-200 hover:border-red-500 bg-gray-50'
                  }`}
                  onClick={() => openApiModal('RESEARCH')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <Database className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-red-500">research api</h3>
                  </div>
                  <p className={`text-sm mb-4 ${getTextClasses(theme, 'secondary')}`}>
                    analyze github repositories, extract insights, and get detailed information about codebases programmatically.
                  </p>
                  <ul className={`space-y-2 text-sm ${getTextClasses(theme, 'secondary')}`}>
                    <li>✓ repository analysis</li>
                    <li>✓ code metrics & statistics</li>
                    <li>✓ dependency tracking</li>
                    <li>✓ commit history analysis</li>
                  </ul>
                  <button
                    onClick={() => openApiModal('RESEARCH')}
                    className="mt-6 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold"
                  >
                    create research key
                  </button>
                </motion.div>

                {/* Chatbot API Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-gray-800 hover:border-red-500 bg-zinc-900/50'
                      : 'border-gray-200 hover:border-red-500 bg-gray-50'
                  }`}
                  onClick={() => openApiModal('CHATBOT')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <Activity className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-red-500">chatbot api</h3>
                  </div>
                  <p className={`text-sm mb-4 ${getTextClasses(theme, 'secondary')}`}>
                    interact with an ai chatbot trained on github repositories. ask questions and get intelligent responses.
                  </p>
                  <ul className={`space-y-2 text-sm ${getTextClasses(theme, 'secondary')}`}>
                    <li>✓ conversational ai interface</li>
                    <li>✓ repository context-aware</li>
                    <li>✓ code explanations</li>
                    <li>✓ intelligent suggestions</li>
                  </ul>
                  <button
                    onClick={() => openApiModal('CHATBOT')}
                    className="mt-6 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold"
                  >
                    create chatbot key
                  </button>
                </motion.div>
              </div>

              <div className={`mt-8 p-6 rounded-xl border-l-4 border-blue-500 ${
                theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <h4 className={`font-bold mb-2 flex items-center gap-2 ${getTextClasses(theme)}`}>
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  need help getting started?
                </h4>
                <p className={`text-sm ${getTextClasses(theme, 'secondary')}`}>
                  check out our{' '}
                  <a
                    href="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-400 underline font-semibold"
                  >
                    documentation
                  </a>
                  {' '}for api examples, integration guides, and best practices.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* API Key Generation Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={(e) => {
          if (e.target === e.currentTarget && !generating) closeApiModal();
        }}>
          <div className={`${getCardClasses(theme)} rounded-lg p-6 max-w-md w-full animate-slideDown`} onClick={(e) => e.stopPropagation()}>
            <h2 className={`text-2xl font-bold mb-4 ${getTextClasses(theme)}`}>
              Generate {selectedApiType === 'RESEARCH' ? 'Research' : 'Chatbot'} API Key
            </h2>
            
            <div className={`mb-4 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm ${getTextClasses(theme, 'secondary')}`}>
                <strong>free tier:</strong> 5 API calls per key
              </p>
              <p className={`text-xs mt-1 ${getTextClasses(theme, 'secondary')}`}>
                {selectedApiType === 'RESEARCH' 
                  ? 'Analyze repositories and get detailed insights' 
                  : 'Chat with repositories and ask questions'}
              </p>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${getTextClasses(theme)}`}>
                API Key Name
              </label>
              <input
                type="text"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                placeholder="e.g., My Project API"
                disabled={generating}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && !generating && generateApiKey()}
              />
            </div>

            {generating && (
              <div className="mb-4 flex items-center gap-2 text-yellow-500">
                <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full" />
                <span className="text-sm">Generating your API key...</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={generateApiKey}
                disabled={generating || !apiName.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition font-semibold flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  'generate key'
                )}
              </button>
              <button
                onClick={closeApiModal}
                disabled={generating}
                className={`px-4 py-2 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </div>

            <div className={`mt-4 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`text-xs ${getTextClasses(theme, 'secondary')}`}>
                ⚠️ Your API key will be shown only once. Make sure to copy and store it securely.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
