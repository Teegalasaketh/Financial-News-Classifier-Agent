/**
 * Index.tsx — Personalized multi-user dashboard.
 * - Live news feed from FastAPI backend
 * - Per-user task/watchlist (Supabase)
 * - Per-user classification history/analytics (Supabase)
 * - AI News Classifier (financial-only validated)
 */

import { useState } from 'react';
import { ClassifiedNews } from '@/lib/types';
import { NewsCard } from '@/components/NewsCard';
import { SentimentChart } from '@/components/SentimentChart';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { TradingSignals } from '@/components/TradingSignals';
import { NewsAnalyzer } from '@/components/NewsAnalyzer';
import { StatsBar } from '@/components/StatsBar';
import { TaskPanel } from '@/components/TaskPanel';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { useNews } from '@/hooks/useNews';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import {
  Activity, Radio, WifiOff, Loader2, AlertCircle,
  LogOut, User, ChevronDown
} from 'lucide-react';
import { useState as useDropdown } from 'react';

export default function Index() {
  const { user, signOut } = useAuth();
  const [manualItems, setManualItems] = useState<ClassifiedNews[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const { news: liveNews, isLoading, isError, isConnected } = useNews();
  const { history, dailyStats, loading: analyticsLoading, record } = useAnalytics(user?.id);

  // Merge manual (classified) + live feed, deduped
  const manualIds = new Set(manualItems.map(i => i.id));
  const allNews: ClassifiedNews[] = [
    ...manualItems,
    ...liveNews.filter(n => !manualIds.has(n.id)),
  ];

  const handleClassified = (result: ClassifiedNews) => {
    setManualItems(prev => [result, ...prev]);
  };

  const handleRecord = async (result: any) => {
    if (user?.id) await record(user.id, result);
  };

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'Agent';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">Financial News Classifier Agent</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Market Impact Classifier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              {isLoading ? (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />LOADING
                </span>
              ) : isConnected ? (
                <span className="flex items-center gap-1.5 text-primary">
                  <Radio className="w-3 h-3 animate-pulse" />LIVE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <WifiOff className="w-3 h-3" />REST ONLY
                </span>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-foreground hover:border-primary/40 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="max-w-24 truncate">{displayName}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 border border-border bg-card rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-mono text-foreground truncate">{displayName}</p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Error banner */}
        {isError && (
          <div className="flex items-center gap-2 border border-destructive/40 bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Cannot reach backend at {import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}. Make sure uvicorn is running.
          </div>
        )}

        <StatsBar news={allNews} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left — News Feed */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live News Feed
            </h2>
            {isLoading && allNews.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground text-sm font-mono">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Fetching from backend…
              </div>
            ) : allNews.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground text-sm font-mono text-center">
                No news yet — classify a headline or check your FINNHUB_API_KEY.
              </div>
            ) : (
              <div className="space-y-3">
                {allNews.map((item, i) => (
                  <NewsCard key={item.id} news={item} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Right — Panels */}
          <div className="lg:col-span-5 space-y-4">
            {/* AI Classifier (financial-only) */}
            <NewsAnalyzer
              onClassified={handleClassified}
              userId={user?.id}
              onRecord={handleRecord}
            />

            {/* Per-user watchlist */}
            {user?.id && <TaskPanel userId={user.id} />}

            {/* Per-user analytics history */}
            <AnalyticsPanel
              dailyStats={dailyStats}
              history={history}
              loading={analyticsLoading}
            />

            <TradingSignals news={allNews} />
            <SentimentChart news={allNews} />
            <SectorHeatmap news={allNews} />
          </div>
        </div>
      </main>
    </div>
  );
}