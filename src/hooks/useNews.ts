/**
 * useNews.ts — polls GET /live-news + optional WebSocket /ws/news
 */

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsApi, FinnhubNewsItem, WsNewsItem, connectNewsStream } from '@/lib/api';
import { ClassifiedNews } from '@/lib/types';

function mapFinnhub(item: FinnhubNewsItem, index: number): ClassifiedNews {
  return {
    id: String(item.id ?? index),
    title: item.headline ?? 'Untitled',
    summary: item.summary ?? '',
    sentiment: 'neutral',
    impactLevel: 'medium',
    tradingSignal: 'hold',
    confidenceScore: 0,
    affectedSectors: item.related ? [item.related] : ['General'],
    entities: item.related ? [item.related] : [],
    priceMovement: 'N/A',
    source: item.source ?? 'Finnhub',
    publishedAt: item.datetime
      ? new Date(item.datetime * 1000).toISOString()
      : new Date().toISOString(),
  };
}

export function useNews({ enableStream = true } = {}) {
  const [streamItems, setStreamItems] = useState<ClassifiedNews[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const disconnectRef = useRef<(() => void) | null>(null);

  const query = useQuery<FinnhubNewsItem[]>({
    queryKey: ['live-news'],
    queryFn: newsApi.getLiveNews,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!enableStream) return;
    disconnectRef.current = connectNewsStream(
      (item: WsNewsItem) => {
        setIsConnected(true);
        setStreamItems(prev => {
          const mapped = item as unknown as ClassifiedNews;
          if (prev.some(p => p.id === mapped.id)) return prev;
          return [mapped, ...prev].slice(0, 50);
        });
      },
      () => setIsConnected(false),
      () => setIsConnected(true),
      () => setIsConnected(false),
    );
    return () => { disconnectRef.current?.(); setIsConnected(false); };
  }, [enableStream]);

  const fetchedItems = (query.data ?? []).map(mapFinnhub);
  const streamIds = new Set(streamItems.map(i => i.id));
  const news = [...streamItems, ...fetchedItems.filter(i => !streamIds.has(i.id))];

  return { news, isLoading: query.isLoading && streamItems.length === 0, isError: query.isError, isConnected, refetch: query.refetch };
}