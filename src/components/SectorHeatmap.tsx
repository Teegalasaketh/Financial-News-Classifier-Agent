import { ClassifiedNews } from '@/lib/types';
import { SECTORS } from '@/lib/types';

interface Props {
  news: ClassifiedNews[];
}

export function SectorHeatmap({ news }: Props) {
  const safeNews = Array.isArray(news) ? news : [];

  const sectorData = SECTORS.map(sector => {
    const sectorNews = safeNews.filter(n => {
      const sectors = Array.isArray(n.affectedSectors) ? n.affectedSectors : [];
      return sectors.includes(sector);
    });
    const bullish = sectorNews.filter(n => n.sentiment === 'bullish').length;
    const bearish = sectorNews.filter(n => n.sentiment === 'bearish').length;
    const score = bullish - bearish;
    return { sector, count: sectorNews.length, score };
  })
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const getColor = (score: number) => {
    if (score > 0) return 'bg-bullish/20 border-bullish/40 text-bullish';
    if (score < 0) return 'bg-bearish/20 border-bearish/40 text-bearish';
    return 'bg-neutral-signal/20 border-neutral-signal/40 text-neutral-signal';
  };

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <h2 className="text-sm font-semibold text-card-foreground mb-4 font-mono uppercase tracking-wider">
        Sector Heatmap
      </h2>
      {sectorData.length === 0 ? (
        <p className="text-xs text-muted-foreground font-mono">No sector data yet — waiting for news...</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {sectorData.map(({ sector, count, score }) => (
            <div
              key={sector}
              className={`border rounded px-3 py-2 ${getColor(score)} transition-all`}
            >
              <div className="text-xs font-mono font-bold">{sector}</div>
              <div className="text-[10px] font-mono opacity-70">
                {count} article{count > 1 ? 's' : ''} · {score > 0 ? '+' : ''}{score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}