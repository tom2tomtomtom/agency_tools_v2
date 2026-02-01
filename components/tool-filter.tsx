'use client';

import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Monitor, Globe } from 'lucide-react';

const tools = [
  { id: 'all', label: 'All', icon: null },
  { id: 'Claude Project', label: 'Projects', icon: <FileText className="h-3.5 w-3.5" /> },
  { id: 'Claude Skill', label: 'Skills', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'Claude Cowork', label: 'Cowork', icon: <Monitor className="h-3.5 w-3.5" /> },
  { id: 'Perplexity', label: 'Perplexity', icon: <Globe className="h-3.5 w-3.5" /> },
] as const;

interface ToolFilterProps {
  selected: string;
  onChange: (tool: string) => void;
  counts?: Record<string, number>;
}

export function ToolFilter({ selected, onChange, counts }: ToolFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map(tool => {
        const count = tool.id === 'all'
          ? counts ? Object.values(counts).reduce((a, b) => a + b, 0) : undefined
          : counts?.[tool.id];

        return (
          <Button
            key={tool.id}
            variant={selected === tool.id ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5 h-8"
            onClick={() => onChange(tool.id)}
          >
            {tool.icon}
            {tool.label}
            {count !== undefined && (
              <span className={`text-xs ${selected === tool.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                ({count})
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
