export type Sentiment = 'bullish' | 'bearish' | 'neutral';
export type ImpactLevel = 'high' | 'medium' | 'low';
export type TradingSignal = 'buy' | 'hold' | 'sell';

export interface ClassifiedNews {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  sentiment: Sentiment;
  impactLevel: ImpactLevel;
  affectedSectors: string[];
  tradingSignal: TradingSignal;
  confidenceScore: number;
  entities: string[];
  priceMovement: string;
}

export interface SectorImpact {
  sector: string;
  sentiment: Sentiment;
  newsCount: number;
  avgConfidence: number;
}

export const SAMPLE_NEWS: ClassifiedNews[] = [
  {
    id: '1',
    title: 'Federal Reserve Signals Potential Rate Cut in Q2',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    summary: 'Fed Chair hints at easing monetary policy amid cooling inflation data, boosting equity market expectations.',
    sentiment: 'bullish',
    impactLevel: 'high',
    affectedSectors: ['Banking', 'Real Estate', 'Technology'],
    tradingSignal: 'buy',
    confidenceScore: 0.87,
    entities: ['Federal Reserve', 'S&P 500', 'US Treasury'],
    priceMovement: '+1.2% to +2.5%',
  },
  {
    id: '2',
    title: 'Oil Prices Surge After OPEC+ Extends Production Cuts',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    summary: 'OPEC+ agrees to extend production cuts through Q3, pushing crude prices above $85 per barrel.',
    sentiment: 'bearish',
    impactLevel: 'high',
    affectedSectors: ['Energy', 'Airlines', 'Manufacturing'],
    tradingSignal: 'sell',
    confidenceScore: 0.92,
    entities: ['OPEC+', 'Brent Crude', 'Saudi Aramco'],
    priceMovement: '-0.8% to -1.5%',
  },
  {
    id: '3',
    title: 'Apple Unveils New AI Chip for Next-Gen Devices',
    source: 'TechCrunch',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    summary: 'Apple announces proprietary AI silicon expected to accelerate on-device ML by 40%.',
    sentiment: 'bullish',
    impactLevel: 'medium',
    affectedSectors: ['Technology', 'Semiconductors'],
    tradingSignal: 'buy',
    confidenceScore: 0.78,
    entities: ['Apple Inc.', 'AAPL', 'NVIDIA'],
    priceMovement: '+0.5% to +1.8%',
  },
  {
    id: '4',
    title: 'EU Imposes New Tariffs on Chinese EV Imports',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    summary: 'European Commission announces up to 38% tariffs on Chinese electric vehicles, escalating trade tensions.',
    sentiment: 'neutral',
    impactLevel: 'medium',
    affectedSectors: ['Automotive', 'Trade', 'Manufacturing'],
    tradingSignal: 'hold',
    confidenceScore: 0.65,
    entities: ['EU', 'BYD', 'Tesla', 'Volkswagen'],
    priceMovement: '-0.3% to +0.3%',
  },
  {
    id: '5',
    title: 'Major Bank Reports Unexpected Q4 Earnings Beat',
    source: 'CNBC',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    summary: 'JPMorgan Chase reports 15% revenue growth, driven by strong investment banking and trading divisions.',
    sentiment: 'bullish',
    impactLevel: 'medium',
    affectedSectors: ['Banking', 'Financial Services'],
    tradingSignal: 'buy',
    confidenceScore: 0.83,
    entities: ['JPMorgan Chase', 'JPM', 'Wall Street'],
    priceMovement: '+1.0% to +2.0%',
  },
  {
    id: '6',
    title: 'Crypto Market Faces Regulatory Crackdown in Asia',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    summary: 'South Korea and Japan announce stricter cryptocurrency trading regulations, triggering sell-off.',
    sentiment: 'bearish',
    impactLevel: 'high',
    affectedSectors: ['Cryptocurrency', 'FinTech'],
    tradingSignal: 'sell',
    confidenceScore: 0.88,
    entities: ['Bitcoin', 'Ethereum', 'Coinbase'],
    priceMovement: '-3.0% to -5.0%',
  },
];

export const SECTORS = [
  'Technology', 'Banking', 'Energy', 'Healthcare', 'Real Estate',
  'Automotive', 'Semiconductors', 'Airlines', 'Manufacturing',
  'Cryptocurrency', 'FinTech', 'Financial Services', 'Trade',
];
