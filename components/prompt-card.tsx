'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useFavorites } from '@/hooks/use-favorites';
import { useAnalytics } from '@/hooks/use-analytics';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Star, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import type { Prompt } from '@/lib/prompts';

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { track } = useAnalytics();
  const favorited = isFavorite(prompt.id);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    track({ type: 'prompt_copy', promptId: prompt.id, teamSlug: prompt.teamSlug });
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
      className="group transition-all duration-200 hover:shadow-md scroll-mt-20"
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
            <div className="flex items-center gap-2 shrink-0">
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
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Expand
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">
              {prompt.toolRecommendation}
            </Badge>
            {prompt.knowledgeToUpload.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {prompt.knowledgeToUpload.length} files recommended
              </Badge>
            )}
          </div>
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
                      <Button variant="outline" asChild className="gap-2">
                        <a href={claudeUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Open in Claude
                        </a>
                      </Button>
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
