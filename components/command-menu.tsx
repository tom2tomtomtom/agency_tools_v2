'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { prompts, teams } from '@/lib/prompts';
import { useAnalytics } from '@/hooks/use-analytics';
import { Search, Star, FileText, Users } from 'lucide-react';

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

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { track } = useAnalytics();

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const results = query.length > 1 ? fuse.search(query).slice(0, 10) : [];

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    setQuery('');
    router.push(path);
  }, [router]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length > 2) {
      track({ type: 'search', query: value, resultCount: fuse.search(value).length });
    }
  }, [track]);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted rounded-lg hover:bg-accent transition-colors w-full md:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search prompts...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search prompts, teams..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Quick Links */}
          {query.length < 2 && (
            <>
              <CommandGroup heading="Quick Links">
                <CommandItem onSelect={() => handleSelect('/')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Home
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/search')}>
                  <Search className="mr-2 h-4 w-4" />
                  Full Search
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/favorites')}>
                  <Star className="mr-2 h-4 w-4" />
                  Favorites
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Teams">
                {teams.slice(0, 5).map(team => (
                  <CommandItem key={team.slug} onSelect={() => handleSelect(`/team/${team.slug}`)}>
                    <Users className="mr-2 h-4 w-4" />
                    {team.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {team.solutionCount} prompts
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <CommandGroup heading="Prompts">
              {results.map(({ item }) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(`/team/${item.teamSlug}#${item.id}`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.teamName}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
