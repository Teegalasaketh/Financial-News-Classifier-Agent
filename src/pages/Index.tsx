import { useState } from 'react';
import { SAMPLE_NEWS, ClassifiedNews } from '@/lib/types';
import { NewsCard } from '@/components/NewsCard';
import { SentimentChart } from '@/components/SentimentChart';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { TradingSignals } from '@/components/TradingSignals';
import { NewsAnalyzer } from '@/components/NewsAnalyzer';
import { StatsBar } from '@/components/StatsBar';
import { Activity, Radio } from 'lucide-react';

const Index = () => {
  const [news, setNews] = useState<ClassifiedNews[]>(SAMPLE_NEWS);

  const handleClassified = (result: ClassifiedNews) => {
    setNews(prev => [result, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">FinPulse</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Market Impact Classifier</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary">
            <Radio className="w-3 h-3 animate-pulse-glow" />
            LIVE
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <StatsBar news={news} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - News Feed */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              Live News Feed
            </h2>
            <div className="space-y-3">
              {news.map((item, i) => (
                <NewsCard key={item.id} news={item} index={i} />
              ))}
            </div>
          </div>

          {/* Right Column - Panels */}
          <div className="lg:col-span-5 space-y-4">
            <NewsAnalyzer onClassified={handleClassified} />
            <TradingSignals news={news} />
            <SentimentChart news={news} />
            <SectorHeatmap news={news} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
