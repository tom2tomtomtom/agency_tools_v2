'use client';

import { useCallback } from 'react';

type AnalyticsEvent = 
  | { type: 'prompt_copy'; promptId: string; teamSlug: string }
  | { type: 'search'; query: string; resultCount: number }
  | { type: 'page_view'; page: string }
  | { type: 'team_view'; teamSlug: string }
  | { type: 'favorite_toggle'; promptId: string; favorited: boolean };

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    // Log locally for now
    console.log('[Analytics]', event);
    
    // If Plausible is installed, use it
    if (typeof window !== 'undefined' && (window as unknown as { plausible?: (eventName: string, options?: { props: Record<string, string | number | boolean> }) => void }).plausible) {
      (window as unknown as { plausible: (eventName: string, options?: { props: Record<string, string | number | boolean> }) => void }).plausible(event.type, { props: event as unknown as Record<string, string | number | boolean> });
    }
  }, []);

  return { track };
}
