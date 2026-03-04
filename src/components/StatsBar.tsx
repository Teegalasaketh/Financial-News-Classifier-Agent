import { Activity, Newspaper, TrendingUp, Zap } from 'lucide-react';
import { ClassifiedNews } from '@/lib/types';

interface Props {
  news: ClassifiedNews[];
}

export function StatsBar({ news }: Props) {
  const avgConfidence = news.length ? (news.reduce((s, n) => s + n.confidenceScore, 0) / news.length * 100).toFixed(0) : '0';
  const highImpact = news.filter(n => n.impactLevel === 'high').length;
  const buySignals = news.filter(n => n.tradingSignal === 'buy').length;

  const stats = [
    { icon: Newspaper, label: 'Articles', value: news.length, color: 'text-primary' },
    { icon: Zap, label: 'High Impact', value: highImpact, color: 'text-bearish' },
    { icon: TrendingUp, label: 'Buy Signals', value: buySignals, color: 'text-bullish' },
    { icon: Activity, label: 'Avg Confidence', value: `${avgConfidence}%`, color: 'text-neutral-signal' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="border border-border bg-card rounded-lg p-3 flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <div>
            <div className="text-lg font-bold font-mono text-card-foreground">{value}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
