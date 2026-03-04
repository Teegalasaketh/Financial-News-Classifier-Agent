import { ClassifiedNews } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

interface Props {
  news: ClassifiedNews[];
}

export function TradingSignals({ news }: Props) {
  const signals = news.slice(0, 4);

  const signalIcon = {
    buy: <ArrowUpRight className="w-4 h-4" />,
    sell: <ArrowDownRight className="w-4 h-4" />,
    hold: <ArrowRight className="w-4 h-4" />,
  };

  const signalStyle = {
    buy: 'border-bullish/40 bg-bullish/5',
    sell: 'border-bearish/40 bg-bearish/5',
    hold: 'border-neutral-signal/40 bg-neutral-signal/5',
  };

  const textStyle = {
    buy: 'text-bullish',
    sell: 'text-bearish',
    hold: 'text-neutral-signal',
  };

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <h2 className="text-sm font-semibold text-card-foreground mb-4 font-mono uppercase tracking-wider">
        Trading Signals
      </h2>
      <div className="space-y-2">
        {signals.map(n => (
          <div key={n.id} className={`border rounded-lg px-3 py-2.5 flex items-center gap-3 ${signalStyle[n.tradingSignal]}`}>
            <div className={`${textStyle[n.tradingSignal]}`}>{signalIcon[n.tradingSignal]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-card-foreground truncate">{n.entities[0]}</div>
              <div className="text-[10px] font-mono text-muted-foreground">{n.priceMovement}</div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-mono font-bold ${textStyle[n.tradingSignal]}`}>
                {n.tradingSignal.toUpperCase()}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">
                {(n.confidenceScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
