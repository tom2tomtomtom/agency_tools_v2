'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { prompts, teams } from '@/lib/prompts';
import { MessageCircle, X, Send, Loader2, Key, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const API_KEY_STORAGE = 'ai-api-key';
const API_PROVIDER_STORAGE = 'ai-api-provider';

type Provider = 'perplexity' | 'anthropic';

const SYSTEM_PROMPT = `You are an AI assistant for a PR & Communications toolkit with ${teams.length} specialized teams and ${prompts.length}+ AI prompts.

Available Teams and their focus areas:
${teams.map(t => {
  const teamPrompts = prompts.filter(p => p.teamSlug === t.slug);
  const sampleNames = teamPrompts.slice(0, 3).map(p => p.name).join(', ');
  return `- ${t.name} (${t.solutionCount} prompts): ${sampleNames}`;
}).join('\n')}

Your job:
1. Understand the user's PR/communications challenge
2. Recommend the most relevant team(s) and specific prompts
3. Explain why each recommendation fits their needs
4. Keep responses concise and actionable

Always format team names exactly as shown above so they can be linked.`;

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI Tool Finder. Describe your PR or communications challenge, and I\'ll recommend the perfect tools from our specialized teams!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<Provider>('anthropic');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load saved settings
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    const savedProvider = localStorage.getItem(API_PROVIDER_STORAGE) as Provider;
    if (savedKey) setApiKey(savedKey);
    if (savedProvider) setProvider(savedProvider);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const saveSettings = () => {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    localStorage.setItem(API_PROVIDER_STORAGE, provider);
    setShowSettings(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let response: string;

      if (provider === 'anthropic') {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'anthropic',
            apiKey,
            messages: [...messages, { role: 'user', content: userMessage }],
            systemPrompt: SYSTEM_PROMPT,
          }),
        });
        const data = await res.json();
        response = data.content || data.error || 'Sorry, something went wrong.';
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'perplexity',
            apiKey,
            messages: [...messages, { role: 'user', content: userMessage }],
            systemPrompt: SYSTEM_PROMPT,
          }),
        });
        const data = await res.json();
        response = data.content || data.error || 'Sorry, something went wrong.';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Failed to get a response. Please check your API key and try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Link team names
    let formatted = content;
    teams.forEach(team => {
      const regex = new RegExp(`(${team.name})`, 'gi');
      formatted = formatted.replace(regex, `<team-link slug="${team.slug}">$1</team-link>`);
    });
    return formatted;
  };

  const renderMessage = (content: string) => {
    const parts = content.split(/(<team-link[^>]+>[^<]+<\/team-link>)/g);
    return parts.map((part, i) => {
      const match = part.match(/<team-link slug="([^"]+)">([^<]+)<\/team-link>/);
      if (match) {
        return (
          <Link
            key={i}
            href={`/team/${match[1]}`}
            className="text-primary underline hover:no-underline"
            onClick={() => setIsOpen(false)}
          >
            {match[2]}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">Need Help?</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-background border rounded-xl shadow-2xl flex flex-col max-h-[600px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">AI Tool Finder</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant={provider === 'anthropic' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setProvider('anthropic')}
                      >
                        Claude
                      </Button>
                      <Button
                        variant={provider === 'perplexity' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setProvider('perplexity')}
                      >
                        Perplexity
                      </Button>
                    </div>
                    <Input
                      type="password"
                      placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'pplx-...'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button size="sm" onClick={saveSettings} className="w-full">
                      Save Settings
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.role === 'assistant' 
                        ? renderMessage(formatMessage(msg.content))
                        : msg.content
                      }
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              {!apiKey ? (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowSettings(true)}
                >
                  <Key className="h-4 w-4" />
                  Add API Key to Chat
                </Button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Describe your challenge..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
