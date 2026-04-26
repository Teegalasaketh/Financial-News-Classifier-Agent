/**
 * useSignals.ts — hook for GET /signals
 *
 * Backend returns: { signals: [{ asset, signal, confidence }] }
 * This hook unwraps the array for convenience.
 */

import { useQuery } from '@tanstack/react-query';
import { signalsApi, SignalItem } from '@/lib/api';

interface UseSignalsOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

export function useSignals({
  refetchInterval = 30_000,
  enabled = true,
}: UseSignalsOptions = {}) {
  const query = useQuery<SignalItem[]>({
    queryKey: ['signals'],
    queryFn: async () => {
      const res = await signalsApi.getSignals();
      return res.signals;          // unwrap { signals: [...] }
    },
    refetchInterval,
    enabled,
    staleTime: 15_000,
  });

  return {
    signals: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}