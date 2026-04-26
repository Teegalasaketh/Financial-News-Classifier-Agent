/**
 * ClassifiedSummary.tsx
 * Shown inside NewsAnalyzer right after a successful classification.
 * Displays the Groq-generated analyst summary + all classification signals.
 */

import { ClassifiedNews } from '@/lib/types';
import {
  TrendingUp, TrendingDown, Minus, Zap,
  ArrowUpRight, ArrowDownRight, ArrowRight,
  Building2, Tag, BarChart2, X, FileText,
} from 'lucide-react';

interface Props {
  result: ClassifiedNews;
  onDismiss: () => void;
}

const sentimentConfig = {
  bullish: { icon: TrendingUp,   label: 'Bullish', color: 'text-bullish',        bg: 'bg-bullish/10 border-bullish/40' },
  bearish: { icon: TrendingDown, label: 'Bearish', color: 'text-bearish',        bg: 'bg-bearish/10 border-bearish/40' },
  neutral: { icon: Minus,        label: 'Neutral', color: 'text-neutral-signal', bg: 'bg-neutral-signal/10 border-neutral-signal/40' },
};

const signalConfig = {
  buy:  { icon: ArrowUpRight,   label: 'BUY',  color: 'text-bullish',        bg: 'bg-bullish/10 border-bullish/40' },
  sell: { icon: ArrowDownRight, label: 'SELL', color: 'text-bearish',        bg: 'bg-bearish/10 border-bearish/40' },
  hold: { icon: ArrowRight,     label: 'HOLD', color: 'text-neutral-signal', bg: 'bg-neutral-signal/10 border-neutral-signal/40' },
};

const impactConfig = {
  high:   { label: 'HIGH IMPACT', color: 'text-bearish' },
  medium: { label: 'MED IMPACT',  color: 'text-neutral-signal' },
  low:    { label: 'LOW IMPACT',  color: 'text-muted-foreground' },
};

export function ClassifiedSummary({ result, onDismiss }: Props) {
  const sentimentKey = result.sentiment in sentimentConfig ? result.sentiment : 'neutral';
  const signalKey    = result.tradingSignal in signalConfig ? result.tradingSignal : 'hold';
  const impactKey    = result.impactLevel in impactConfig ? result.impactLevel : 'medium';

  const Sentiment = sentimentConfig[sentimentKey];
  const Signal    = signalConfig[signalKey];
  const Impact    = impactConfig[impactKey];

  const SentimentIcon = Sentiment.icon;
  const SignalIcon    = Signal.icon;

  const sectors  = Array.isArray(result.affectedSectors) && result.affectedSectors.length ? result.affectedSectors : ['General'];
  const entities = Array.isArray(result.entities) && result.entities.length ? result.entities : null;
  const confPct  = Math.round((result.confidenceScore ?? 0) * 100);
  const confColor = confPct >= 70 ? 'bg-bullish' : confPct >= 40 ? 'bg-neutral-signal' : 'bg-bearish';

  return (
    <div className="mt-3 border border-primary/30 bg-primary/5 rounded-lg p-3 animate-slide-in relative">

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss summary"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Label */}
      <p className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <FileText className="w-3 h-3" />
        AI Analyst Summary
      </p>

      {/* Headline */}
      <p className="text-xs font-bold text-card-foreground font-mono leading-snug mb-2 pr-5">
        {result.title}
      </p>

      {/* ── AI-generated analyst summary ── */}
      {result.summary && result.summary !== result.title && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 border-l-2 border-primary/30 pl-2">
          {result.summary}
        </p>
      )}

      {/* Sentiment + Signal + Impact badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-bold ${Sentiment.color} ${Sentiment.bg}`}>
          <SentimentIcon className="w-3 h-3" />
          {Sentiment.label}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-bold ${Signal.color} ${Signal.bg}`}>
          <SignalIcon className="w-3 h-3" />
          {Signal.label}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold bg-muted ${Impact.color}`}>
          <Zap className="w-3 h-3" />
          {Impact.label}
        </span>
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">AI Confidence</span>
          <span className="text-[10px] font-mono font-bold text-foreground">{confPct}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${confColor}`}
            style={{ width: `${confPct}%` }}
          />
        </div>
      </div>

      {/* Price movement */}
      {result.priceMovement && result.priceMovement !== 'N/A' && (
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="text-[10px] font-mono text-muted-foreground">Expected move:</span>
          <span className={`text-[10px] font-mono font-bold ${Signal.color}`}>{result.priceMovement}</span>
        </div>
      )}

      {/* Sectors */}
      <div className="flex items-start gap-2 mb-2">
        <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="flex flex-wrap gap-1">
          {sectors.map(s => (
            <span key={s} className="text-[10px] font-mono bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Entities */}
      {entities && (
        <div className="flex items-start gap-2">
          <Tag className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {entities.map(e => (
              <span key={e} className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] font-mono text-muted-foreground/40 mt-3 text-right">
        Added to Live News Feed ↑
      </p>
    </div>
  );
}