'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

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

export default function DocsPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen p-8 pt-24 animate-fadeIn ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 text-red-500">api documentation</h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            comprehensive guide to unrepo apis
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Base URLs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${getCardClasses(theme)} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold mb-4 text-red-500`}>base urls</h2>
            <div className="space-y-3">
              <div>
                <h3 className={`font-semibold mb-1 ${getTextClasses(theme)}`}>chatbot api</h3>
                <code className={`${getCodeBlockClasses(theme)} px-3 py-1 rounded text-sm inline-block`}>
                  https://chat.unrepo.dev/api/v1
                </code>
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${getTextClasses(theme)}`}>research api</h3>
                <code className={`${getCodeBlockClasses(theme)} px-3 py-1 rounded text-sm inline-block`}>
                  https://research.unrepo.dev/api/v1
                </code>
              </div>
              <p className={`text-sm mt-3 ${getTextClasses(theme, 'secondary')}`}>
                all api endpoints are versioned. current version: <span className="text-red-500 font-semibold">v1</span>
              </p>
            </div>
          </motion.div>

          {/* Authentication */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${getCardClasses(theme)} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold mb-4 text-red-500`}>authentication</h2>
            <p className={`mb-4 ${getTextClasses(theme, 'secondary')}`}>
              all api requests require an api key with the <code className="text-red-500">unrepo_</code> prefix. include it in the request header:
            </p>
            <pre className={`${getCodeBlockClasses(theme)} p-3 rounded-lg text-sm mb-4`}>
              x-api-key: unrepo_research_YOUR_KEY_HERE
            </pre>
            <ul className={`space-y-2 text-sm ${getTextClasses(theme, 'secondary')}`}>
              <li>• <code className="text-red-500">unrepo_research_</code> - for research api endpoints</li>
              <li>• <code className="text-red-500">unrepo_chatbot_</code> - for chatbot api endpoints</li>
            </ul>
            <p className={`text-sm mt-4 ${getTextClasses(theme, 'secondary')}`}>
              generate your api keys from the{' '}
              <a href="/" className="text-red-500 hover:text-red-400 underline font-semibold">
                developer portal
              </a>
              {' '}after logging in with github.
            </p>
          </motion.div>

          {/* Rate Limits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${getCardClasses(theme)} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold mb-4 text-red-500`}>rate limits</h2>
            <div className="space-y-4">
              <div>
                <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>free tier</h3>
                <ul className={`space-y-1 text-sm ${getTextClasses(theme, 'secondary')}`}>
                  <li>• research api: <span className="text-green-500 font-semibold">100 requests/hour</span></li>
                  <li>• chatbot api: <span className="text-green-500 font-semibold">200 requests/hour</span></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>token holders</h3>
                <ul className={`space-y-1 text-sm ${getTextClasses(theme, 'secondary')}`}>
                  <li>• all apis: <span className="text-green-500 font-semibold">500 requests/hour</span></li>
                  <li>• priority support</li>
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>rate limit headers in responses:</h3>
                <pre className={`${getCodeBlockClasses(theme)} p-3 rounded-lg text-sm`}>
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200`}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Chatbot API */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${getCardClasses(theme)} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold mb-2 text-red-500`}>1. chatbot api</h2>
            <p className={`mb-4 text-sm ${getTextClasses(theme, 'secondary')}`}>
              interactive chat interface with intelligent ai routing (claude for code, chatgpt for analysis).
            </p>
            
            <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>endpoint</h3>
            <code className={`${getCodeBlockClasses(theme)} px-3 py-1 rounded text-sm inline-block mb-4`}>
              POST https://chat.unrepo.dev/api/v1/chatbot
            </code>

            <h3 className={`font-semibold mb-2 mt-4 ${getTextClasses(theme)}`}>request body</h3>
            <pre className={`${getCodeBlockClasses(theme)} p-4 rounded-lg overflow-x-auto text-sm mb-4`}>
{`{
  "message": "Explain the main function",
  "repoUrl": "https://github.com/owner/repo",
  "conversationHistory": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}`}
            </pre>
            <ul className={`space-y-1 text-sm mb-4 ${getTextClasses(theme, 'secondary')}`}>
              <li>• <code className="text-red-500">message</code> - your question or prompt (required)</li>
              <li>• <code className="text-red-500">repoUrl</code> - github repository url (optional)</li>
              <li>• <code className="text-red-500">conversationHistory</code> - previous messages for context (optional)</li>
            </ul>

            <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>response</h3>
            <pre className={`${getCodeBlockClasses(theme)} p-4 rounded-lg overflow-x-auto text-sm mb-4`}>
{`{
  "success": true,
  "data": {
    "response": "The main function initializes...",
    "message": "Explain the main function",
    "repoUrl": "https://github.com/owner/repo",
    "aiProvider": "intelligent-routing"
  }
}`}
            </pre>

            <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>curl example</h3>
            <pre className={`${getCodeBlockClasses(theme)} p-4 rounded-lg overflow-x-auto text-sm`}>
{`curl -X POST https://chat.unrepo.dev/api/v1/chatbot \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: unrepo_chatbot_YOUR_KEY_HERE" \\
  -d '{
    "message": "What does this repository do?",
    "repoUrl": "https://github.com/vercel/next.js"
  }'`}
            </pre>
          </motion.div>

          {/* Research API */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${getCardClasses(theme)} rounded-lg p-6`}
          >
            <h2 className={`text-2xl font-bold mb-2 text-red-500`}>2. research api</h2>
            <p className={`mb-4 text-sm ${getTextClasses(theme, 'secondary')}`}>
              deep analysis of repository structure, code quality, and potential security issues.
            </p>
            
            <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>endpoint</h3>
            <code className={`${getCodeBlockClasses(theme)} px-3 py-1 rounded text-sm inline-block mb-4`}>
              POST https://research.unrepo.dev/api/v1/research
            </code>

            <h3 className={`font-semibold mb-2 mt-4 ${getTextClasses(theme)}`}>request body</h3>
            <pre className={`${getCodeBlockClasses(theme)} p-4 rounded-lg overflow-x-auto text-sm mb-4`}>
{`{
  "repoUrl": "https://github.com/owner/repo",
  "options": {
    "includeAnalysis": true
  }
}`}
            </pre>
            <ul className={`space-y-1 text-sm mb-4 ${getTextClasses(theme, 'secondary')}`}>
              <li>• <code className="text-red-500">repoUrl</code> - github repository url (required)</li>
              <li>• <code className="text-red-500">options</code> - additional options for analysis (optional)</li>
            </ul>

            <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>response</h3>
            <pre className={`${getCodeBlockClasses(theme)} p-4 rounded-lg overflow-x-auto text-sm mb-4`}>
{`{
  "success": true,
  "data": {
    "repository": {
      "owner": "vercel",
      "name": "next.js",
      "url": "https://github.com/vercel/next.js",
      "description": "The React Framework",
      "language": "TypeScript",
      "stars": 120000,
      "forks": 25000
    },
    "languages": {
      "TypeScript": 85.2,
      "JavaScript": 10.5,
      "CSS": 4.3
    },
    "analysis": {
      "summary": "Production-ready React framework...",
      "architecture": "Monorepo structure with...",
      "keyFeatures": ["SSR", "SSG", "API Routes"]
    },
    "codeQuality": 9.2,
    "rugPotential": "low",
    "aiGenerated": false
  }
}`}
            </pre>

            <h3 className={`font-semibold mb-2 ${getTextClasses(theme)}`}>curl example</h3>
            <pre className={`${getCodeBlockClasses(theme)} p-4 rounded-lg overflow-x-auto text-sm`}>
{`curl -X POST https://research.unrepo.dev/api/v1/research \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: unrepo_research_YOUR_KEY_HERE" \\
  -d '{
    "repoUrl": "https://github.com/vercel/next.js"
  }'`}
            </pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
