'use client';

import { useState, useMemo } from 'react';
import { PromptCard } from '@/components/prompt-card';
import { ToolFilter } from '@/components/tool-filter';
import type { Prompt } from '@/lib/prompts';

interface FilteredPromptListProps {
  prompts: Prompt[];
}

export function FilteredPromptList({ prompts }: FilteredPromptListProps) {
  const [selectedTool, setSelectedTool] = useState('all');

  // Calculate counts per tool type
  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    prompts.forEach(p => {
      result[p.toolRecommendation] = (result[p.toolRecommendation] || 0) + 1;
    });
    return result;
  }, [prompts]);

  // Filter prompts based on selection
  const filteredPrompts = useMemo(() => {
    if (selectedTool === 'all') return prompts;
    return prompts.filter(p => p.toolRecommendation === selectedTool);
  }, [prompts, selectedTool]);

  // Only show filter if there are multiple tool types
  const hasMultipleTools = Object.keys(counts).length > 1;

  return (
    <div className="space-y-4">
      {hasMultipleTools && (
        <div className="flex items-center justify-between gap-4">
          <ToolFilter
            selected={selectedTool}
            onChange={setSelectedTool}
            counts={counts}
          />
          {selectedTool !== 'all' && (
            <span className="text-sm text-muted-foreground">
              Showing {filteredPrompts.length} of {prompts.length}
            </span>
          )}
        </div>
      )}

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
