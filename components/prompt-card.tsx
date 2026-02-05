'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecentlyUsed } from '@/hooks/use-recently-used';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Star,
  ExternalLink,
  BookOpen,
  Download,
  Monitor,
  Globe,
  Sparkles,
  FileText
} from 'lucide-react';
import type { Prompt } from '@/lib/prompts';

// Map prompt IDs to skill ZIP files
const skillFiles: Record<string, string> = {
  'campaign-management-team-2': 'qa-testing.zip',
  'campaign-management-team-3': 'stakeholder-update.zip',
  'creative-integrated-team-5': 'creative-review.zip',
  'leadership-team-3': 'executive-comms.zip',
  'operations-culture-team-3': 'process-docs.zip',
  'social-content-team-3': 'copywriting.zip',
  'new-business-team-2': 'content-transformer.zip',
};

// Tool badge styling
const toolBadgeConfig: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ReactNode }> = {
  'Claude Project': { variant: 'secondary', icon: <FileText className="h-3 w-3 mr-1" /> },
  'Claude Skill': { variant: 'default', icon: <Sparkles className="h-3 w-3 mr-1" /> },
  'Claude Cowork': { variant: 'outline', icon: <Monitor className="h-3 w-3 mr-1" /> },
  'Perplexity': { variant: 'outline', icon: <Globe className="h-3 w-3 mr-1" /> },
};

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addRecentlyUsed } = useRecentlyUsed();
  const { track } = useAnalytics();
  const favorited = isFavorite(prompt.id);

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    addRecentlyUsed(prompt.id);
    track({ type: 'prompt_copy', promptId: prompt.id, teamSlug: prompt.teamSlug });
    toast.success('Copied to clipboard', {
      description: prompt.name,
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    toggleFavorite(prompt.id);
    track({ type: 'favorite_toggle', promptId: prompt.id, favorited: !favorited });
  };

  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt.prompt.slice(0, 4000))}`;

  return (
    <Card
      id={prompt.id}
      className="group transition-all duration-200 hover:shadow-md scroll-mt-20 border-border/50 rounded-xl overflow-hidden"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">
                {prompt.name}
              </CardTitle>
              {prompt.description && (
                <CardDescription className="mt-1.5 line-clamp-2">
                  {prompt.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleFavorite}
              >
                <Star
                  className={`h-4 w-4 transition-colors ${
                    favorited ? 'fill-yellow-400 text-yellow-400' : ''
                  }`}
                />
              </Button>
              {/* Quick copy button - always visible */}
              <Button
                variant={copied ? "default" : "secondary"}
                size="sm"
                className="gap-1.5 h-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 h-8">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{isOpen ? 'Less' : 'More'}</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant={toolBadgeConfig[prompt.toolRecommendation]?.variant || 'secondary'} className="flex items-center">
              {toolBadgeConfig[prompt.toolRecommendation]?.icon}
              {prompt.toolRecommendation}
            </Badge>
            {prompt.knowledgeToUpload.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {prompt.knowledgeToUpload.length} files recommended
              </Badge>
            )}
            {prompt.toolRecommendation === 'Claude Cowork' && (
              <Badge variant="outline" className="text-xs">
                Requires Claude Desktop
              </Badge>
            )}
          </div>

          {/* Prompt Preview - shown when collapsed */}
          {!isOpen && (
            <div className="mt-3 text-xs text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1.5 line-clamp-2">
              {prompt.prompt.slice(0, 150)}{prompt.prompt.length > 150 ? '...' : ''}
            </div>
          )}
        </CardHeader>

        <CollapsibleContent>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0">
                  {/* Knowledge to Upload */}
                  {prompt.knowledgeToUpload.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Recommended Knowledge to Upload
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                        {prompt.knowledgeToUpload.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prompt Text */}
                  <div className="relative">
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
                      {prompt.prompt}
                    </div>
                    
                    {/* Tool-specific notes */}
                    {prompt.toolRecommendation === 'Claude Skill' && skillFiles[prompt.id] && (
                      <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Install as Skill:</strong> Download the ZIP, then go to Claude.ai → Settings → Capabilities → Upload Skill
                        </p>
                        <Button variant="outline" size="sm" asChild className="gap-2">
                          <a href={`/skills/${skillFiles[prompt.id]}`} download>
                            <Download className="h-4 w-4" />
                            Download Skill ZIP
                          </a>
                        </Button>
                      </div>
                    )}
                    {prompt.toolRecommendation === 'Claude Cowork' && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Use with Claude Desktop:</strong> Open Claude Desktop app on macOS, enable Cowork, and grant folder access. Install the Chrome extension for web capture and Gemini MCP for image generation.
                        </p>
                      </div>
                    )}
                    {prompt.toolRecommendation === 'Perplexity' && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Use with Perplexity:</strong> This prompt works best with real-time web search. Use at perplexity.ai or via the Perplexity API.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button onClick={handleCopy} className="gap-2">
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Prompt
                          </>
                        )}
                      </Button>
                      {prompt.toolRecommendation === 'Perplexity' ? (
                        <Button variant="outline" asChild className="gap-2">
                          <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open Perplexity
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" asChild className="gap-2">
                          <a href={claudeUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open in Claude
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
