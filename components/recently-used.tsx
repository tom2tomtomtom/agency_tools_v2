'use client';

import { useMemo } from 'react';
import { prompts } from '@/lib/prompts';
import { useRecentlyUsed } from '@/hooks/use-recently-used';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Copy, Check, X } from 'lucide-react';
import { useState } from 'react';

export function RecentlyUsed() {
  const { recentlyUsed, clearRecentlyUsed, isLoaded } = useRecentlyUsed();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recentPrompts = useMemo(() => {
    return recentlyUsed
      .map(id => prompts.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyUsed]);

  const handleCopy = async (promptId: string, promptText: string) => {
    await navigator.clipboard.writeText(promptText);
    setCopiedId(promptId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Don't render anything if not loaded or no recent items
  if (!isLoaded || recentPrompts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-amber-600" />
            Recently Copied
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={clearRecentlyUsed}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2">
          {recentPrompts.map(prompt => prompt && (
            <div
              key={prompt.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{prompt.name}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  {prompt.toolRecommendation}
                </Badge>
              </div>
              <Button
                variant={copiedId === prompt.id ? "default" : "secondary"}
                size="sm"
                className="shrink-0 h-8 w-8 p-0"
                onClick={() => handleCopy(prompt.id, prompt.prompt)}
              >
                {copiedId === prompt.id ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
