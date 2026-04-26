/**
 * useAnalytics.ts
 * Stores every classification result per user in Supabase table `news_history`.
 * Used to render the historical analytics chart.
 *
 * Table schema:
 *   create table news_history (
 *     id uuid primary key default gen_random_uuid(),
 *     user_id uuid references auth.users not null,
 *     title text,
 *     sentiment text,
 *     impact_level text,
 *     trading_signal text,
 *     confidence_score float,
 *     affected_sectors text[],
 *     source text,
 *     classified_at timestamptz default now()
 *   );
 *   alter table news_history enable row level security;
 *   create policy "Users read own history"
 *     on news_history for all using (auth.uid() = user_id);
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClassifyResponse } from '@/lib/api';

export interface HistoryRecord {
  id: string;
  title: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact_level: 'high' | 'medium' | 'low';
  trading_signal: 'buy' | 'sell' | 'hold';
  confidence_score: number;
  affected_sectors: string[];
  source: string;
  classified_at: string;
}

/** Aggregated by day for the chart */
export interface DailyStat {
  date: string;       // 'YYYY-MM-DD'
  bullish: number;
  bearish: number;
  neutral: number;
  total: number;
}

export function useAnalytics(userId: string | undefined) {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('news_history')
      .select('*')
      .eq('user_id', userId)
      .order('classified_at', { ascending: false })
      .limit(200);

    if (!error && data) {
      const records = data as HistoryRecord[];
      setHistory(records);

      // Aggregate by date
      const byDate: Record<string, DailyStat> = {};
      records.forEach(r => {
        const date = r.classified_at.slice(0, 10);
        if (!byDate[date]) byDate[date] = { date, bullish: 0, bearish: 0, neutral: 0, total: 0 };
        byDate[date][r.sentiment]++;
        byDate[date].total++;
      });
      setDailyStats(Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  /** Call this after every successful classification to persist it */
  const record = async (userId: string, result: ClassifyResponse) => {
    await supabase.from('news_history').insert({
      user_id: userId,
      title: result.title,
      sentiment: result.sentiment,
      impact_level: result.impactLevel,
      trading_signal: result.tradingSignal,
      confidence_score: result.confidenceScore,
      affected_sectors: result.affectedSectors,
      source: result.source,
    });
    await fetchHistory();
  };

  return { history, dailyStats, loading, record, refetch: fetchHistory };
}