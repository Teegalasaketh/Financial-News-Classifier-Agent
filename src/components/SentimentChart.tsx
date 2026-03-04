import { ClassifiedNews } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  news: ClassifiedNews[];
}

export function SentimentChart({ news }: Props) {
  const sentimentCounts = {
    bullish: news.filter(n => n.sentiment === 'bullish').length,
    bearish: news.filter(n => n.sentiment === 'bearish').length,
    neutral: news.filter(n => n.sentiment === 'neutral').length,
  };

  const data = [
    { name: 'Bullish', value: sentimentCounts.bullish, color: 'hsl(142, 70%, 45%)' },
    { name: 'Bearish', value: sentimentCounts.bearish, color: 'hsl(0, 72%, 51%)' },
    { name: 'Neutral', value: sentimentCounts.neutral, color: 'hsl(38, 92%, 50%)' },
  ].filter(d => d.value > 0);

  const total = news.length;

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <h2 className="text-sm font-semibold text-card-foreground mb-4 font-mono uppercase tracking-wider">
        Sentiment Distribution
      </h2>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220, 18%, 12%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: 'hsl(210, 20%, 90%)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bullish" />
            <span className="text-muted-foreground">Bullish</span>
            <span className="text-card-foreground font-bold">{sentimentCounts.bullish}/{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bearish" />
            <span className="text-muted-foreground">Bearish</span>
            <span className="text-card-foreground font-bold">{sentimentCounts.bearish}/{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-signal" />
            <span className="text-muted-foreground">Neutral</span>
            <span className="text-card-foreground font-bold">{sentimentCounts.neutral}/{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
