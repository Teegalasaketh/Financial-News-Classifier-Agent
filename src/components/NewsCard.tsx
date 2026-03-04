import { formatDistanceToNow } from 'date-fns';
import { ClassifiedNews } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, Zap, Clock } from 'lucide-react';

const sentimentConfig = {
  bullish: { icon: TrendingUp, label: 'Bullish', className: 'text-bullish bg-bullish/10 border-bullish' },
  bearish: { icon: TrendingDown, label: 'Bearish', className: 'text-bearish bg-bearish/10 border-bearish' },
  neutral: { icon: Minus, label: 'Neutral', className: 'text-neutral-signal bg-neutral-signal/10 border-neutral-signal' },
};

const impactConfig = {
  high: { label: 'HIGH', className: 'text-bearish bg-bearish/10' },
  medium: { label: 'MED', className: 'text-neutral-signal bg-neutral-signal/10' },
  low: { label: 'LOW', className: 'text-muted-foreground bg-muted' },
};

const signalConfig = {
  buy: { label: 'BUY', className: 'text-primary-foreground bg-bullish glow-green' },
  sell: { label: 'SELL', className: 'text-primary-foreground bg-bearish glow-red' },
  hold: { label: 'HOLD', className: 'text-primary-foreground bg-neutral-signal glow-amber' },
};

interface Props {
  news: ClassifiedNews;
  index: number;
}

export function NewsCard({ news, index }: Props) {
  const SentimentIcon = sentimentConfig[news.sentiment].icon;

  return (
    <div
      className="group border border-border bg-card rounded-lg p-4 hover:border-primary/40 transition-all duration-300 animate-slide-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{news.source}</span>
            <span>·</span>
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>
        <div className={`flex-shrink-0 px-2.5 py-1 rounded font-mono text-xs font-bold ${signalConfig[news.tradingSignal].className}`}>
          {signalConfig[news.tradingSignal].label}
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{news.summary}</p>

      {/* Metrics Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${sentimentConfig[news.sentiment].className}`}>
          <SentimentIcon className="w-3 h-3" />
          {sentimentConfig[news.sentiment].label}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${impactConfig[news.impactLevel].className}`}>
          <Zap className="w-3 h-3 inline mr-0.5" />
          {impactConfig[news.impactLevel].label}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-mono text-muted-foreground bg-muted">
          {(news.confidenceScore * 100).toFixed(0)}% conf
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-mono text-muted-foreground bg-muted">
          {news.priceMovement}
        </span>
      </div>

      {/* Sectors */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {news.affectedSectors.map(sector => (
          <span key={sector} className="text-[10px] font-mono text-secondary-foreground bg-secondary px-1.5 py-0.5 rounded">
            {sector}
          </span>
        ))}
      </div>
    </div>
  );
}
