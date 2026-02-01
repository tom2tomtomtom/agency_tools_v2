'use client';

import { useState, useEffect, useCallback } from 'react';

const RECENTLY_USED_KEY = 'agency-tools-recently-used';
const MAX_RECENT_ITEMS = 6;

export function useRecentlyUsed() {
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_USED_KEY);
    if (stored) {
      try {
        setRecentlyUsed(JSON.parse(stored));
      } catch {
        setRecentlyUsed([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when recentlyUsed changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(recentlyUsed));
    }
  }, [recentlyUsed, isLoaded]);

  const addRecentlyUsed = useCallback((promptId: string) => {
    setRecentlyUsed(prev => {
      // Remove if already exists, add to front
      const filtered = prev.filter(id => id !== promptId);
      const updated = [promptId, ...filtered].slice(0, MAX_RECENT_ITEMS);
      return updated;
    });
  }, []);

  const clearRecentlyUsed = useCallback(() => {
    setRecentlyUsed([]);
  }, []);

  return { recentlyUsed, addRecentlyUsed, clearRecentlyUsed, isLoaded };
}
