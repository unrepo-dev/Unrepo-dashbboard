'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Copy, Eye, EyeOff, Key, MessageSquare, Search, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LiveGraph } from '@/components/live-graph';

interface ApiKey {
  id: string;
  key: string;
  name?: string;
  type: 'RESEARCH' | 'CHATBOT';
  createdAt: string;
  lastUsedAt: string | null;
  usageCount: number;
  isActive: boolean;
}

export default function DeveloperPortal() {
  const { data: session, status } = useSession();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'apis'>('dashboard');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedApiType, setSelectedApiType] = useState<'RESEARCH' | 'CHATBOT' | null>(null);
  const [apiName, setApiName] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApiKeys();
    }
  }, [status]);

  const fetchApiKeys = async () => {
    try {
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

  const openApiModal = (type: 'RESEARCH' | 'CHATBOT') => {
    setSelectedApiType(type);
    setShowApiModal(true);
    setApiName('');
  };

  const closeApiModal = () => {
    setShowApiModal(false);
    setSelectedApiType(null);
    setApiName('');
    setGenerating(false);
  };

  const generateApiKey = async () => {
    if (!selectedApiType) return;
    
    if (!apiName.trim()) {
      toast.error('Please enter an API name');
      return;
    }
    
    setGenerating(true);
    
    try {
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
      
      // Handle both new key (apiKey) and existing key (key) responses
      const apiKey = data.data?.apiKey || data.data?.key;
      
      if (data.success && apiKey) {
        const storageKey = selectedApiType === 'CHATBOT' ? 'unrepo_chatbot_key' : 'unrepo_research_key';
        localStorage.setItem(storageKey, apiKey);
        
        await fetchApiKeys();
        closeApiModal();
        
        const isExisting = data.message === 'API key already exists';
        toast.success(isExisting ? `Using existing API key` : `API key generated successfully!`, {
          description: `Key: ${apiKey.slice(0, 20)}...`,
          duration: 5000,
        });
      } else {
        toast.error(data.error || data.message || 'Failed to generate API key');
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
      toast.error('Failed to generate API key. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const userEmail = session?.user?.email || '';
      const res = await fetch(`${apiUrl}/api/keys/${keyId}?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success) {
        await fetchApiKeys();
        toast.success('API key deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key. Please try again.');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 20) return key;
    return key.substring(0, 20) + '•'.repeat(key.length - 20);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="max-w-2xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-4 text-primary">Developer Portal</h1>
            <p className="text-lg text-muted-foreground">
              Manage your API keys and monitor usage for UNREPO APIs
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Authentication Required</CardTitle>
                <CardDescription className="text-base">
                  Sign in with your GitHub account to generate and manage API keys
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button 
                  onClick={() => signIn('github')}
                  size="lg"
                  className="gap-2"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Sign in with GitHub
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const researchKeys = apiKeys.filter(k => k.type === 'RESEARCH');
  const chatbotKeys = apiKeys.filter(k => k.type === 'CHATBOT');
  const totalApiCalls = apiKeys.reduce((sum, key) => sum + key.usageCount, 0);

  return (
    <div className="min-h-screen p-8 pt-20 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-header -mx-8 px-8 py-4 mb-8 border-b"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Developer Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, {session?.user?.name || 'Developer'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setCurrentView('dashboard')}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'apis' ? 'default' : 'outline'}
                onClick={() => setCurrentView('apis')}
                className="gap-2"
              >
                <Key className="h-4 w-4" />
                My APIs
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="glass-card theme-hover">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total APIs
                    </CardTitle>
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{apiKeys.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active keys</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="glass-card theme-hover">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Chatbot APIs
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{chatbotKeys.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Conversation API</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="glass-card theme-hover">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Research APIs
                    </CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{researchKeys.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Repository analysis</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="glass-card theme-hover">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Requests
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{totalApiCalls.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">API calls made</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Create API Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Create a new API key to get started</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button
                    onClick={() => openApiModal('RESEARCH')}
                    className="flex-1 gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Create Research API
                  </Button>
                  <Button
                    onClick={() => openApiModal('CHATBOT')}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Create Chatbot API
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Activity Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Live API Activity</CardTitle>
                  <CardDescription>Real-time monitoring of API requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <LiveGraph />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* APIs View */}
        {currentView === 'apis' && (
          <div className="space-y-6">
            {/* Research APIs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Research API Keys
                      </CardTitle>
                      <CardDescription>Analyze GitHub repositories programmatically</CardDescription>
                    </div>
                    <Button
                      onClick={() => openApiModal('RESEARCH')}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {researchKeys.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No research API keys yet. Create one to get started.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {researchKeys.map((apiKey) => (
                        <div
                          key={apiKey.id}
                          className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-foreground">
                                {apiKey.name || 'Research API Key'}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Created {new Date(apiKey.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">
                              {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {showKeys[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteApiKey(apiKey.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Usage: {apiKey.usageCount.toLocaleString()} requests</span>
                            {apiKey.lastUsedAt && (
                              <span>Last used: {new Date(apiKey.lastUsedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Chatbot APIs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Chatbot API Keys
                      </CardTitle>
                      <CardDescription>Power conversational AI with UNREPO data</CardDescription>
                    </div>
                    <Button
                      onClick={() => openApiModal('CHATBOT')}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {chatbotKeys.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No chatbot API keys yet. Create one to get started.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatbotKeys.map((apiKey) => (
                        <div
                          key={apiKey.id}
                          className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-foreground">
                                {apiKey.name || 'Chatbot API Key'}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Created {new Date(apiKey.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">
                              {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {showKeys[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteApiKey(apiKey.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Usage: {apiKey.usageCount.toLocaleString()} requests</span>
                            {apiKey.lastUsedAt && (
                              <span>Last used: {new Date(apiKey.lastUsedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Create API Modal */}
        <Dialog open={showApiModal} onOpenChange={closeApiModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Create {selectedApiType === 'RESEARCH' ? 'Research' : 'Chatbot'} API Key
              </DialogTitle>
              <DialogDescription>
                {selectedApiType === 'RESEARCH'
                  ? 'Generate a new API key for analyzing GitHub repositories'
                  : 'Generate a new API key for powering conversational AI'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="api-name">API Key Name</Label>
                <Input
                  id="api-name"
                  placeholder="My Production API"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  disabled={generating}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={closeApiModal} disabled={generating}>
                  Cancel
                </Button>
                <Button onClick={generateApiKey} disabled={generating}>
                  {generating ? 'Generating...' : 'Generate API Key'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
