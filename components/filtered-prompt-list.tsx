'use client';

import { useState, useMemo } from 'react';
import { PromptCard } from '@/components/prompt-card';
import { ToolFilter } from '@/components/tool-filter';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import type { Prompt } from '@/lib/prompts';

type SortOption = 'default' | 'name-asc' | 'name-desc';

const sortLabels: Record<SortOption, string> = {
  'default': 'Default',
  'name-asc': 'Name A-Z',
  'name-desc': 'Name Z-A',
};

interface FilteredPromptListProps {
  prompts: Prompt[];
}

export function FilteredPromptList({ prompts }: FilteredPromptListProps) {
  const [selectedTool, setSelectedTool] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Calculate counts per tool type
  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    prompts.forEach(p => {
      result[p.toolRecommendation] = (result[p.toolRecommendation] || 0) + 1;
    });
    return result;
  }, [prompts]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let result = selectedTool === 'all'
      ? [...prompts]
      : prompts.filter(p => p.toolRecommendation === selectedTool);

    // Apply sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [prompts, selectedTool, sortBy]);

  const cycleSortOption = () => {
    const options: SortOption[] = ['default', 'name-asc', 'name-desc'];
    const currentIndex = options.indexOf(sortBy);
    setSortBy(options[(currentIndex + 1) % options.length]);
  };

  // Only show filter if there are multiple tool types
  const hasMultipleTools = Object.keys(counts).length > 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {hasMultipleTools && (
            <ToolFilter
              selected={selectedTool}
              onChange={setSelectedTool}
              counts={counts}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedTool !== 'all' && (
            <span className="text-sm text-muted-foreground">
              Showing {filteredPrompts.length} of {prompts.length}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={cycleSortOption}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortLabels[sortBy]}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPrompts.map(prompt => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No prompts match this filter.
        </div>
      )}
    </div>
  );
}
