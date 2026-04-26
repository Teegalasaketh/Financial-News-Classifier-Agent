/**
 * AnalyticsPanel.tsx
 * Shows the user's personal classification history as a stacked bar chart.
 * Data comes from Supabase news_history table via useAnalytics hook.
 */

import { DailyStat, HistoryRecord } from '@/hooks/useAnalytics';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { BarChart2, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';

interface Props {
  dailyStats: DailyStat[];
  history: HistoryRecord[];
  loading: boolean;
}

const COLORS = {
  bullish: 'hsl(142,70%,45%)',
  bearish: 'hsl(0,72%,51%)',
  neutral: 'hsl(38,92%,50%)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded p-2 text-xs font-mono shadow-lg">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export function AnalyticsPanel({ dailyStats, history, loading }: Props) {
  const total = history.length;
  const bullish = history.filter(h => h.sentiment === 'bullish').length;
  const bearish = history.filter(h => h.sentiment === 'bearish').length;
  const avgConf = total
    ? (history.reduce((s, h) => s + (h.confidence_score ?? 0), 0) / total * 100).toFixed(0)
    : '0';

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <h2 className="text-sm font-semibold text-card-foreground mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-primary" />
        My Analytics
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-xs font-mono">Loading history...</span>
        </div>
      ) : total === 0 ? (
        <p className="text-xs font-mono text-muted-foreground text-center py-6">
          No classifications yet — analyze some news above
        </p>
      ) : (
        <>
          {/* Mini stat row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-bullish/10 border border-bullish/20 rounded p-2 text-center">
              <TrendingUp className="w-3 h-3 text-bullish mx-auto mb-0.5" />
              <div className="text-sm font-bold font-mono text-bullish">{bullish}</div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase">Bullish</div>
            </div>
            <div className="bg-bearish/10 border border-bearish/20 rounded p-2 text-center">
              <TrendingDown className="w-3 h-3 text-bearish mx-auto mb-0.5" />
              <div className="text-sm font-bold font-mono text-bearish">{bearish}</div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase">Bearish</div>
            </div>
            <div className="bg-muted border border-border rounded p-2 text-center">
              <Minus className="w-3 h-3 text-muted-foreground mx-auto mb-0.5" />
              <div className="text-sm font-bold font-mono text-foreground">{avgConf}%</div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase">Avg Conf</div>
            </div>
          </div>

          {/* Bar chart */}
          {dailyStats.length > 0 && (
            <>
              <p className="text-[10px] font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                Activity by day
              </p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats} barSize={8}>
                    <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: 'monospace' }}
                      tickFormatter={d => d.slice(5)} stroke="hsl(220,14%,25%)" />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="bullish" stackId="a" fill={COLORS.bullish} radius={[0,0,0,0]} />
                    <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} radius={[0,0,0,0]} />
                    <Bar dataKey="bearish" stackId="a" fill={COLORS.bearish} radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Recent history */}
          <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">Recent</p>
            {history.slice(0, 8).map(h => (
              <div key={h.id} className="flex items-center gap-2 text-xs font-mono">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  h.sentiment === 'bullish' ? 'bg-bullish' :
                  h.sentiment === 'bearish' ? 'bg-bearish' : 'bg-neutral-signal'
                }`} />
                <span className="flex-1 truncate text-muted-foreground">{h.title}</span>
                <span className="text-[9px] text-muted-foreground/50 flex-shrink-0">
                  {new Date(h.classified_at).toLocaleDateString('en', { month:'short', day:'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}