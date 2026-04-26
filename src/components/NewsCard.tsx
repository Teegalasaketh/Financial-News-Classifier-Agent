import { formatDistanceToNow } from 'date-fns';
import { ClassifiedNews } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, Zap, Clock, Tag } from 'lucide-react';

const sentimentConfig = {
  bullish: { icon: TrendingUp,   label: 'Bullish', className: 'text-bullish bg-bullish/10 border-bullish' },
  bearish: { icon: TrendingDown, label: 'Bearish', className: 'text-bearish bg-bearish/10 border-bearish' },
  neutral: { icon: Minus,        label: 'Neutral', className: 'text-neutral-signal bg-neutral-signal/10 border-neutral-signal' },
};

const impactConfig = {
  high:   { label: 'HIGH', className: 'text-bearish bg-bearish/10' },
  medium: { label: 'MED',  className: 'text-neutral-signal bg-neutral-signal/10' },
  low:    { label: 'LOW',  className: 'text-muted-foreground bg-muted' },
};

const signalConfig = {
  buy:  { label: 'BUY',  className: 'text-primary-foreground bg-bullish glow-green' },
  sell: { label: 'SELL', className: 'text-primary-foreground bg-bearish glow-red' },
  hold: { label: 'HOLD', className: 'text-primary-foreground bg-neutral-signal glow-amber' },
};

// Left-border accent colour per sentiment
const summaryBorder = {
  bullish: 'border-bullish/40',
  bearish: 'border-bearish/40',
  neutral: 'border-neutral-signal/40',
};

interface Props {
  news: ClassifiedNews;
  index: number;
}

function safeDate(raw: string | undefined | null): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  if (d.getFullYear() === 1970 && d.getMonth() === 0 && d.getDate() === 1) return null;
  return d;
}

export function NewsCard({ news, index }: Props) {
  const sentimentKey = news.sentiment in sentimentConfig ? news.sentiment : 'neutral';
  const impactKey    = news.impactLevel in impactConfig  ? news.impactLevel  : 'medium';
  const signalKey    = news.tradingSignal in signalConfig ? news.tradingSignal : 'hold';

  const SentimentIcon = sentimentConfig[sentimentKey].icon;
  const parsedDate    = safeDate(news.publishedAt);

  const sectors  = Array.isArray(news.affectedSectors) && news.affectedSectors.length > 0
    ? news.affectedSectors : ['General'];

  const entities = Array.isArray(news.entities) && news.entities.length > 0
    ? news.entities : null;

  // Detect if summary is just the headline repeated — if so, don't show it twice
  const showSummary = news.summary &&
    news.summary.trim().toLowerCase() !== news.title.trim().toLowerCase();

  return (
    <div
      className="group border border-border bg-card rounded-lg p-4 hover:border-primary/40 transition-all duration-300 animate-slide-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{news.source}</span>
            {parsedDate && (
              <>
                <span>·</span>
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(parsedDate, { addSuffix: true })}</span>
              </>
            )}
          </div>
        </div>
        <div className={`flex-shrink-0 px-2.5 py-1 rounded font-mono text-xs font-bold ${signalConfig[signalKey].className}`}>
          {signalConfig[signalKey].label}
        </div>
      </div>

      {/* AI Analyst Summary — left-border accent, shows full text */}
      {showSummary && (
        <div className={`border-l-2 pl-2.5 mb-3 ${summaryBorder[sentimentKey]}`}>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {news.summary}
          </p>
        </div>
      )}

      {/* Entities (tickers / company names) */}
      {entities && (
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Tag className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          {entities.map(e => (
            <span key={e} className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Metrics Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${sentimentConfig[sentimentKey].className}`}>
          <SentimentIcon className="w-3 h-3" />
          {sentimentConfig[sentimentKey].label}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${impactConfig[impactKey].className}`}>
          <Zap className="w-3 h-3 inline mr-0.5" />
          {impactConfig[impactKey].label}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-mono text-muted-foreground bg-muted">
          {(news.confidenceScore * 100).toFixed(0)}% conf
        </span>
        {news.priceMovement && news.priceMovement !== 'N/A' && (
          <span className="px-2 py-0.5 rounded text-xs font-mono text-muted-foreground bg-muted">
            {news.priceMovement}
          </span>
        )}
      </div>

      {/* Sectors */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {sectors.map(sector => (
          <span key={sector} className="text-[10px] font-mono text-secondary-foreground bg-secondary px-1.5 py-0.5 rounded">
            {sector}
          </span>
        ))}
      </div>
    </div>
  );
}