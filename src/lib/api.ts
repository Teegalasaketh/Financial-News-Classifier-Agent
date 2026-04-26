const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const WS_URL   = import.meta.env.VITE_WS_URL  ?? 'ws://localhost:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface ClassifyResponse {
  id: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impactLevel: 'high' | 'medium' | 'low';
  tradingSignal: 'buy' | 'sell' | 'hold';
  confidenceScore: number;
  affectedSectors: string[];
  entities: string[];
  priceMovement: string;
  source: string;
  publishedAt: string;
}

export interface FinnhubNewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface SignalItem {
  asset: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
}

export interface SignalsResponse { signals: SignalItem[]; }

export interface WsNewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impactLevel: 'high' | 'medium' | 'low';
  tradingSignal: 'buy' | 'sell' | 'hold';
  confidenceScore: number;
  affectedSectors: string[];
  entities: string[];
  priceMovement: string;
  source: string;
  publishedAt: string;
}

export const classifyApi = {
  classify: (article: string): Promise<ClassifyResponse> =>
    apiFetch<ClassifyResponse>('/classify-news', {
      method: 'POST',
      body: JSON.stringify({ article }),
    }),
};

export const newsApi = {
  getLiveNews: (): Promise<FinnhubNewsItem[]> => apiFetch<FinnhubNewsItem[]>('/live-news'),
};

export const signalsApi = {
  getSignals: (): Promise<SignalsResponse> => apiFetch<SignalsResponse>('/signals'),
  getAccuracy: (ticker: string, signal: string): Promise<unknown> =>
    apiFetch(`/accuracy/${ticker}/${signal}`),
};

export type WsMessageHandler = (item: WsNewsItem) => void;
export type WsErrorHandler   = (err: Event) => void;

export function connectNewsStream(
  onMessage: WsMessageHandler,
  onError?:  WsErrorHandler,
  onOpen?:   () => void,
  onClose?:  () => void,
): () => void {
  const ws = new WebSocket(`${WS_URL}/ws/news`);
  ws.onopen    = () => { console.info('[WS] Connected'); onOpen?.(); };
  ws.onmessage = (e) => { try { onMessage(JSON.parse(e.data)); } catch { /* ignore */ } };
  ws.onerror   = (e) => { console.error('[WS] Error', e); onError?.(e); };
  ws.onclose   = () => { console.info('[WS] Closed'); onClose?.(); };
  return () => { if (ws.readyState < 2) ws.close(); };
}

export { BASE_URL, WS_URL };