'use client';

import { useMemo } from 'react';
import { prompts } from '@/lib/prompts';
import { PromptCard } from '@/components/prompt-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  const favoritePrompts = useMemo(() => {
    return prompts.filter(p => favorites.includes(p.id));
  }, [favorites]);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          Favorites
        </h1>
        <p className="text-muted-foreground mt-2">
          {favoritePrompts.length} saved {favoritePrompts.length === 1 ? 'prompt' : 'prompts'}
        </p>
      </div>

      {/* Content */}
      {favoritePrompts.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Star className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-medium">No favorites yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Click the star icon on any prompt to save it here for quick access.
          </p>
          <Button asChild>
            <Link href="/" className="gap-2">
              Browse Teams
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {favoritePrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}
