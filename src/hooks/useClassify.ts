/**
 * useClassify.ts
 * Mutation hook for POST /classify-news.
 * Includes client-side financial-news validation BEFORE hitting the API.
 */

import { useMutation } from '@tanstack/react-query';
import { classifyApi, ClassifyResponse } from '@/lib/api';
import { toast } from 'sonner';

// ─── Financial news validation ────────────────────────────────────────────────

const FINANCIAL_KEYWORDS = [
  'stock', 'stocks', 'market', 'markets', 'nasdaq', 'nyse', 'dow', 's&p', 'index',
  'share', 'shares', 'equity', 'bond', 'bonds', 'etf', 'futures', 'options', 'derivative',
  'crypto', 'bitcoin', 'btc', 'ethereum', 'eth', 'coin', 'token',
  'ipo', 'earnings', 'revenue', 'profit', 'loss', 'dividend', 'buyback', 'merger',
  'acquisition', 'invest', 'investor', 'fund', 'portfolio', 'trade', 'trading',
  'rally', 'crash', 'surge', 'plunge', 'soar', 'tumble', 'gain', 'drop',
  'gdp', 'inflation', 'rate', 'rates', 'fed', 'federal reserve', 'interest',
  'central bank', 'treasury', 'fiscal', 'monetary', 'recession', 'growth',
  'unemployment', 'jobs', 'cpi', 'ppi', 'economy', 'economic',
  'bank', 'financial', 'finance', 'quarter', 'annual', 'guidance', 'forecast',
  'analyst', 'valuation', 'price target', 'upgrade', 'downgrade', 'rating',
  'hedge fund', 'venture', 'capital', 'vc', 'startup',
];

const TICKER_REGEX = /\b[A-Z]{1,5}\b/;

export function isFinancialNews(text: string): boolean {
  const lower = text.toLowerCase();
  const hasKeyword = FINANCIAL_KEYWORDS.some(kw => lower.includes(kw));
  const hasTicker  = TICKER_REGEX.test(text);
  return text.trim().length >= 15 && (hasKeyword || hasTicker);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseClassifyOptions {
  onSuccess?: (data: ClassifyResponse) => void;
  onError?:   (err: Error) => void;
}

export function useClassify({ onSuccess, onError }: UseClassifyOptions = {}) {
  const mutation = useMutation({
    mutationFn: async (article: string) => {
      if (!isFinancialNews(article)) {
        throw new Error(
          "This doesn't look like financial news. Please enter a market-related headline."
        );
      }
      return classifyApi.classify(article);
    },

    onSuccess: (data) => {
      toast.success('Classified successfully');
      onSuccess?.(data);
    },

    onError: (err: Error) => {
      const msg = err.message || 'Classification failed';
      toast.error(msg);
      onError?.(err);
    },
  });

  return {
    classify:  (article: string) => mutation.mutate(article),
    isLoading: mutation.isPending,
    error:     mutation.error,
    data:      mutation.data,
    reset:     mutation.reset,
  };
}