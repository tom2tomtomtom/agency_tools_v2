'use client';

import { Suspense } from 'react';
import { SearchContent } from './search-content';
import { Loader2 } from 'lucide-react';

function SearchFallback() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Prompts</h1>
        <p className="text-muted-foreground mt-2">Loading...</p>
      </div>
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}
