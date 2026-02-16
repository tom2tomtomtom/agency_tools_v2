'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { prompts, teams } from '@/lib/prompts';
import { MessageCircle, X, Send, Loader2, Key, Sparkles, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface FollowUp {
  label: string;
  message: string;
}

interface ConversationStarter {
  label: string;
  message: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  followUps?: FollowUp[];
}

const API_KEY_STORAGE = 'ai-api-key';
const API_PROVIDER_STORAGE = 'ai-api-provider';
const MESSAGES_STORAGE = 'uncommon-ai-chat-messages';

type Provider = 'perplexity' | 'anthropic';

// Build compact prompt index grouped by team
const PROMPT_INDEX = (() => {
  const grouped: Record<string, string[]> = {};
  for (const p of prompts) {
    if (!grouped[p.teamName]) grouped[p.teamName] = [];
    grouped[p.teamName].push(`${p.id} ${p.name}`);
  }
  return Object.entries(grouped)
    .map(([team, entries]) => `${team}: ${entries.join(' | ')}`)
    .join('\n');
})();

function buildSystemPrompt(pathname: string, userContext?: { favorites: string[]; recentlyUsed: string[] }): string {
  // Determine current page context
  let pageContext = 'The user is on the homepage.';
  const teamMatch = pathname.match(/^\/team\/([^/]+)/);
  if (teamMatch) {
    const team = teams.find(t => t.slug === teamMatch[1]);
    if (team) {
      const teamPrompts = prompts.filter(p => p.teamSlug === team.slug);
      pageContext = `The user is browsing the ${team.name} department (${teamPrompts.length} prompts).`;
    }
  } else if (pathname === '/plugins') {
    pageContext = 'The user is on the Plugins page.';
  }

  // Build user context section
  let userContextSection = '';
  if (userContext) {
    const parts: string[] = [];
    if (userContext.favorites.length > 0) {
      const favNames = userContext.favorites
        .map(id => prompts.find(p => p.id === id)?.name)
        .filter(Boolean)
        .slice(0, 5);
      if (favNames.length > 0) parts.push(`User's favorites: ${favNames.join(', ')}`);
    }
    if (userContext.recentlyUsed.length > 0) {
      const recentNames = userContext.recentlyUsed
        .map(id => prompts.find(p => p.id === id)?.name)
        .filter(Boolean)
        .slice(0, 5);
      if (recentNames.length > 0) parts.push(`User recently used: ${recentNames.join(', ')}`);
    }
    if (parts.length > 0) {
      userContextSection = `\nUSER CONTEXT:\n${parts.join('\n')}\n`;
    }
  }

  return `You are Uncommon AI, a helpful assistant for the Uncommon Studio AI Tools creative toolkit.
The toolkit has ${teams.length} specialized departments and ${prompts.length}+ AI prompts for PR & communications professionals.

CURRENT PAGE CONTEXT: ${pageContext}
${userContextSection}
RESPONSE FORMAT: You must respond with RAW JSON only (no markdown code fences). Use this exact format:
{
  "text": "Your response here. Use **bold**, *italic*, \`code\`, and - bullet lists for formatting.",
  "recommendations": [{"name": "Tool Name", "teamSlug": "team-slug", "promptId": "team-slug-1"}],
  "followUps": [{"label": "Short button label", "message": "Full message to send"}]
}

AVAILABLE PROMPTS (link format: /team/{teamSlug}#{id}):
${PROMPT_INDEX}

DEPARTMENTS (link format: /team/{slug}):
${teams.map(t => `- ${t.slug}: ${t.name} (${t.solutionCount} prompts)`).join('\n')}

RULES:
1. Recommend specific prompts by name and id when relevant (include in recommendations array)
2. Always include 2-3 followUps to continue the conversation
3. Use markdown in text: **bold**, *italic*, \`code\`, - bullet lists
4. Keep responses concise and actionable
5. Output RAW JSON only — no markdown code fences, no extra text`;
}

function getConversationStarters(pathname: string): ConversationStarter[] {
  const teamMatch = pathname.match(/^\/team\/([^/]+)/);
  if (teamMatch) {
    const team = teams.find(t => t.slug === teamMatch[1]);
    if (team) {
      const teamPrompts = prompts.filter(p => p.teamSlug === team.slug);
      return [
        { label: `What can ${team.name} do?`, message: `What tools does the ${team.name} department offer?` },
        { label: 'Recommend a tool', message: `Which ${team.name} tool should I start with?` },
        { label: 'Compare tools', message: `How do the ${team.name} tools differ from each other?` },
        ...(teamPrompts[0] ? [{ label: `About ${teamPrompts[0].name.split(' ').slice(0, 3).join(' ')}...`, message: `Tell me about the ${teamPrompts[0].name} tool` }] : []),
      ].slice(0, 4);
    }
  }

  // Default starters for homepage / other pages
  return [
    { label: 'Help me write a brief', message: 'I need to write a creative brief. Which tool should I use?' },
    { label: 'Crisis management', message: 'What tools do you have for crisis communications?' },
    { label: 'Explore all teams', message: 'Give me an overview of all the departments and what they do.' },
    { label: 'Media relations', message: 'I need help with media pitches and press releases.' },
  ];
}

// Lightweight markdown renderer
function renderInlineMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Process bold, italic, code inline
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4]) {
      parts.push(<code key={key++} className="bg-muted-foreground/15 px-1 rounded text-xs">{match[4]}</code>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

function renderMarkdown(text: string): ReactNode {
  const lines = text.split('\n');
  const elements: ReactNode[] = [];
  let inList = false;
  let listItems: ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1 my-1">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      inList = true;
      listItems.push(<li key={key++}>{renderInlineMarkdown(bulletMatch[1])}</li>);
    } else {
      flushList();
      if (line.trim() === '') {
        elements.push(<br key={key++} />);
      } else {
        elements.push(<p key={key++} className="my-1">{renderInlineMarkdown(line)}</p>);
      }
    }
  }
  flushList();

  return <>{elements}</>;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hi! I\'m **Uncommon AI**, your toolkit assistant. Describe your PR or communications challenge, and I\'ll recommend the perfect tools from our specialized teams!',
};

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<Provider>('anthropic');
  const [showSettings, setShowSettings] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load saved settings + persisted messages on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    const savedProvider = localStorage.getItem(API_PROVIDER_STORAGE) as Provider;
    if (savedKey) setApiKey(savedKey);
    if (savedProvider) setProvider(savedProvider);

    // Restore persisted messages
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Invalid stored data, keep defaults
    }

    setIsHydrated(true);
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(MESSAGES_STORAGE, JSON.stringify(messages));
    }
  }, [messages, isHydrated]);

  // Re-read user context when widget opens
  useEffect(() => {
    if (isOpen) {
      try {
        const favs = localStorage.getItem('agency-tools-favorites');
        if (favs) setFavorites(JSON.parse(favs));
      } catch { /* ignore */ }
      try {
        const recent = localStorage.getItem('agency-tools-recently-used');
        if (recent) setRecentlyUsed(JSON.parse(recent));
      } catch { /* ignore */ }
    }
  }, [isOpen]);

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

  const startNewConversation = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  const sendMessageDirect = async (directMessage?: string) => {
    const messageText = directMessage || input.trim();
    if (!messageText || !apiKey) return;

    if (!directMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setIsLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(pathname, { favorites, recentlyUsed });

      // Cap history at last 20 messages for API call
      const allMessages = [...messages, { role: 'user' as const, content: messageText }];
      const apiMessages = allMessages.slice(-20);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey,
          messages: apiMessages,
          systemPrompt,
        }),
      });
      const data = await res.json();
      const raw = data.content || data.error || 'Sorry, something went wrong.';

      // Try to parse JSON response from LLM
      let responseText = raw;
      let followUps: FollowUp[] = [];
      let recommendations: Array<{ name: string; teamSlug: string; promptId?: string }> = [];

      try {
        // Strip markdown code fences if the LLM wraps its response
        const cleaned = raw.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.text) {
          responseText = parsed.text;
          followUps = Array.isArray(parsed.followUps) ? parsed.followUps : [];
          recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
        }
      } catch {
        // LLM didn't return valid JSON, use raw text
      }

      // Build content with recommendations appended
      let content = responseText;
      if (recommendations.length > 0) {
        const recLinks = recommendations
          .map(r => {
            const linkId = r.promptId || r.name;
            return `- **${r.name}** → /team/${r.teamSlug}#${linkId}`;
          })
          .join('\n');
        content += '\n\n' + recLinks;
      }

      setMessages(prev => [...prev, { role: 'assistant', content, followUps }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Failed to get a response. Please check your API key and try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssistantMessage = (content: string) => {
    // Split content: main text vs recommendation links
    const lines = content.split('\n');
    const textLines: string[] = [];
    const recLines: string[] = [];

    for (const line of lines) {
      if (line.match(/^- \*\*(.+?)\*\* → \/team\//)) {
        recLines.push(line);
      } else {
        textLines.push(line);
      }
    }

    return (
      <>
        {renderMarkdown(textLines.join('\n').trim())}
        {recLines.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            {recLines.map((line, i) => {
              const match = line.match(/^- \*\*(.+?)\*\* → (\/team\/[^\s]+)/);
              if (match) {
                return (
                  <Link
                    key={i}
                    href={match[2]}
                    className="block text-sm text-primary underline hover:no-underline py-0.5"
                    onClick={() => setIsOpen(false)}
                  >
                    {match[1]}
                  </Link>
                );
              }
              return null;
            })}
          </div>
        )}
      </>
    );
  };

  const starters = getConversationStarters(pathname);

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
                <span className="font-semibold">Uncommon AI</span>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={startNewConversation}
                    title="New chat"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
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
                  <div key={i}>
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.role === 'assistant'
                          ? renderAssistantMessage(msg.content)
                          : msg.content
                        }
                      </div>
                    </div>
                    {/* Follow-up buttons — only on the latest assistant message */}
                    {msg.role === 'assistant' && msg.followUps && msg.followUps.length > 0 && i === messages.length - 1 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                        {msg.followUps.map((fu, j) => (
                          <button
                            key={j}
                            onClick={() => sendMessageDirect(fu.message)}
                            disabled={isLoading}
                            className="text-xs px-2.5 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                          >
                            {fu.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {/* Conversation starters — shown when only welcome message exists */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {starters.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessageDirect(s.message)}
                        disabled={isLoading || !apiKey}
                        className="text-xs px-2.5 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
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
                    sendMessageDirect();
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
