'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { prompts, teams } from '@/lib/prompts';
import { PromptCard } from '@/components/prompt-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/use-analytics';
import { Search, X } from 'lucide-react';

const fuse = new Fuse(prompts, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'teamName', weight: 1 },
    { name: 'prompt', weight: 0.5 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(searchParams.get('team') || null);
  const { track } = useAnalytics();

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedTeam) params.set('team', selectedTeam);
    const newUrl = params.toString() ? `?${params.toString()}` : '/search';
    router.replace(newUrl, { scroll: false });
  }, [query, selectedTeam, router]);

  const results = useMemo(() => {
    let items = query.length > 1
      ? fuse.search(query).map(r => r.item)
      : prompts;

    if (selectedTeam) {
      items = items.filter(p => p.teamSlug === selectedTeam);
    }

    return items;
  }, [query, selectedTeam]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      track({ type: 'search', query: value, resultCount: fuse.search(value).length });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search Prompts</h1>
        <p className="text-muted-foreground mt-2">
          Search across {prompts.length} AI prompts
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, description, or content..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Team Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTeam === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTeam(null)}
        >
          All Teams
        </Button>
        {teams.map(team => (
          <Button
            key={team.slug}
            variant={selectedTeam === team.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTeam(team.slug === selectedTeam ? null : team.slug)}
          >
            {team.name.replace(' Team', '')}
          </Button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? 'result' : 'results'}
        {query && ` for "${query}"`}
        {selectedTeam && ` in ${teams.find(t => t.slug === selectedTeam)?.name}`}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          results.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))
        )}
      </div>
    </div>
  );
}
