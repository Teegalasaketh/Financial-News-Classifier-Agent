/**
 * AuthPage.tsx
 * Bloomberg Terminal × TradingView × AI Agent aesthetic.
 * All animations via CSS keyframes — zero new dependencies.
 * Auth logic identical to original.
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Terminal, Mail, Eye, EyeOff, Shield, Activity, Wifi } from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const TICKERS = [
  { sym: 'SPY',  val: '512.34', chg: '+1.24%', up: true  },
  { sym: 'QQQ',  val: '438.92', chg: '+0.87%', up: true  },
  { sym: 'AAPL', val: '189.45', chg: '-0.32%', up: false },
  { sym: 'TSLA', val: '248.77', chg: '+3.12%', up: true  },
  { sym: 'NVDA', val: '875.20', chg: '+2.45%', up: true  },
  { sym: 'MSFT', val: '415.60', chg: '-0.18%', up: false },
  { sym: 'AMZN', val: '182.91', chg: '+0.73%', up: true  },
  { sym: 'BTC',  val: '67,420', chg: '+4.21%', up: true  },
  { sym: 'ETH',  val: '3,512',  chg: '+2.88%', up: true  },
  { sym: 'GLD',  val: '221.14', chg: '-0.54%', up: false },
  { sym: 'VIX',  val: '14.87',  chg: '+5.31%', up: true  },
  { sym: 'DXY',  val: '104.32', chg: '-0.22%', up: false },
];

const NEWS_ITEMS = [
  'FED HOLDS RATES STEADY · POWELL SIGNALS CAUTIOUS APPROACH TO CUTS',
  'NVIDIA Q4 EARNINGS BEAT · EPS $5.16 VS $4.59 EST · SHARES +8% AH',
  'CHINA PMI CONTRACTS TO 48.2 · RISK-OFF SENTIMENT SPREADS GLOBALLY',
  'AI INVESTMENT SURGE: TECH CAPEX HITS $200B · SEMICONDUCTOR DEMAND SOARS',
  'BITCOIN CROSSES $67K · SPOT ETF INFLOWS REACH RECORD $500M DAILY',
  'S&P 500 CLOSES AT ALL-TIME HIGH · TECH SECTOR LEADS BROAD-BASED RALLY',
  'TREASURY YIELDS INVERT · 2Y-10Y SPREAD HITS -42BPS · RECESSION WATCH',
];

// Random candlestick data
const CANDLES = Array.from({ length: 28 }, (_, i) => {
  const base  = 55 + Math.sin(i * 0.5) * 18 + Math.cos(i * 0.3) * 10;
  const open  = base + (Math.random() - 0.5) * 8;
  const close = base + (Math.random() - 0.48) * 12;
  const high  = Math.max(open, close) + Math.random() * 6;
  const low   = Math.min(open, close) - Math.random() * 6;
  return { open, close, high, low, bull: close >= open };
});

// Grid nodes
const NODES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  dur: 3 + Math.random() * 5,
  r: 1.5 + Math.random() * 2.5,
}));

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const { signIn, signUp }          = useAuth();
  const [mode, setMode]             = useState<'login' | 'register'>('login');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [registered, setRegistered] = useState(false);
  const [switching, setSwitching]   = useState(false);
  const [scanAngle, setScanAngle]   = useState(0);
  const [activeTicker, setActiveTicker] = useState(0);
  const rafRef = useRef<number>(0);

  // Radar scan rotation
  useEffect(() => {
    let angle = 0;
    const tick = () => {
      angle = (angle + 1.2) % 360;
      setScanAngle(angle);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Ticker highlight cycle
  useEffect(() => {
    const t = setInterval(() => setActiveTicker(i => (i + 1) % TICKERS.length), 1800);
    return () => clearInterval(t);
  }, []);

  // Mode switch with glitch flash
  const switchMode = (m: 'login' | 'register') => {
    if (m === mode) return;
    setSwitching(true);
    setTimeout(() => { setMode(m); setSwitching(false); }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        toast.success('Access granted');
      } else {
        if (!displayName.trim()) { toast.error('Display name required'); setLoading(false); return; }
        await signUp(email, password, displayName);
        setRegistered(true);
        toast.success('Account created — check your email');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Build SVG chart points
  const chartH = 72, chartW = 320;
  const linePoints = CANDLES.map((c, i) =>
    `${(i / (CANDLES.length - 1)) * chartW},${chartH - ((c.close / 90) * chartH)}`
  ).join(' ');

  const tickerBar = [...TICKERS, ...TICKERS]; // doubled for seamless loop

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050d07',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    }}>

      {/* ── CSS keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

        @keyframes gridDrift {
          0%   { transform: translate(0,0); }
          100% { transform: translate(40px,40px); }
        }
        @keyframes nodePulse {
          0%,100% { opacity:0.08; transform:scale(1); }
          50%     { opacity:0.65; transform:scale(2.2); }
        }
        @keyframes scanLine {
          0%   { top:0%;    opacity:0.6; }
          90%  { opacity:0.3; }
          100% { top:100%;  opacity:0; }
        }
        @keyframes tickerScroll {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes newsScroll {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glitchFlash {
          0%,100% { opacity:1; filter:none; }
          20%     { opacity:0.4; filter:hue-rotate(90deg) brightness(2); }
          40%     { opacity:0.8; transform:translateX(-3px); }
          60%     { opacity:0.5; transform:translateX(3px); }
          80%     { opacity:0.9; filter:brightness(1.5); }
        }
        @keyframes signalPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(0,255,100,0.5), 0 0 20px rgba(0,255,100,0.15); }
          50%     { box-shadow:0 0 0 8px rgba(0,255,100,0), 0 0 32px rgba(0,255,100,0.3); }
        }
        @keyframes lineTrace {
          from { stroke-dashoffset:1200; }
          to   { stroke-dashoffset:0; }
        }
        @keyframes blink {
          0%,100% { opacity:1; } 49% { opacity:1; } 50% { opacity:0; } 99% { opacity:0; }
        }
        @keyframes matrixFall {
          0%   { transform:translateY(-100%); opacity:0; }
          5%   { opacity:0.6; }
          95%  { opacity:0.15; }
          100% { transform:translateY(110vh); opacity:0; }
        }
        @keyframes inputGlow {
          from { box-shadow:0 0 0 0 rgba(0,255,100,0.3); }
          to   { box-shadow:0 0 0 4px rgba(0,255,100,0.08), 0 0 16px rgba(0,255,100,0.1); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-5px); }
        }
        @keyframes cornerBlink {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
        @keyframes radarFade {
          0%   { opacity:0.7; }
          100% { opacity:0; }
        }

        .auth-card { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .auth-card-switching { animation: glitchFlash 0.2s steps(4) both; }
        .float-logo { animation: float 5s ease-in-out infinite; }
        .cursor-blink::after { content:'_'; animation: blink 1.1s step-end infinite; color:#00ff64; }

        .fin-input {
          width:100%;
          background:rgba(0,255,100,0.03);
          border:1px solid rgba(0,255,100,0.18);
          border-radius:6px;
          padding:10px 14px;
          font-family:inherit;
          font-size:13px;
          color:#d0ffd8;
          caret-color:#00ff64;
          outline:none;
          transition:border-color 0.25s, box-shadow 0.25s, background 0.25s;
          letter-spacing:0.04em;
        }
        .fin-input::placeholder { color:rgba(0,255,100,0.2); }
        .fin-input:focus {
          border-color:rgba(0,255,100,0.55);
          background:rgba(0,255,100,0.05);
          box-shadow:0 0 0 3px rgba(0,255,100,0.08), 0 0 20px rgba(0,255,100,0.1);
        }

        .submit-btn {
          width:100%;
          padding:12px;
          background:rgba(0,255,100,0.08);
          border:1px solid rgba(0,255,100,0.45);
          border-radius:6px;
          color:#00ff64;
          font-family:inherit;
          font-size:12px;
          font-weight:600;
          letter-spacing:0.18em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all 0.25s;
          animation:signalPulse 2.8s ease infinite;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
        }
        .submit-btn:hover:not(:disabled) {
          background:rgba(0,255,100,0.15);
          border-color:rgba(0,255,100,0.9);
          box-shadow:0 0 32px rgba(0,255,100,0.3), 0 0 64px rgba(0,255,100,0.1);
          transform:translateY(-1px);
        }
        .submit-btn:disabled { opacity:0.45; cursor:not-allowed; animation:none; }

        .mode-tab {
          flex:1; padding:9px 4px;
          font-family:inherit; font-size:10px;
          letter-spacing:0.2em; text-transform:uppercase;
          border:none; background:transparent; cursor:pointer;
          transition:all 0.2s;
        }
        .mode-tab-active {
          color:#00ff64;
          border-bottom:2px solid #00ff64;
          background:rgba(0,255,100,0.07);
          text-shadow:0 0 12px rgba(0,255,100,0.6);
        }
        .mode-tab-inactive {
          color:rgba(0,255,100,0.3);
          border-bottom:2px solid transparent;
        }
        .mode-tab-inactive:hover { color:rgba(0,255,100,0.55); }

        .corner-tl, .corner-tr, .corner-bl, .corner-br {
          position:absolute; width:12px; height:12px;
          animation:cornerBlink 2s ease-in-out infinite;
        }
        .corner-tl { top:8px; left:8px; border-top:1.5px solid rgba(0,255,100,0.6); border-left:1.5px solid rgba(0,255,100,0.6); }
        .corner-tr { top:8px; right:8px; border-top:1.5px solid rgba(0,255,100,0.6); border-right:1.5px solid rgba(0,255,100,0.6); animation-delay:0.5s; }
        .corner-bl { bottom:8px; left:8px; border-bottom:1.5px solid rgba(0,255,100,0.6); border-left:1.5px solid rgba(0,255,100,0.6); animation-delay:1s; }
        .corner-br { bottom:8px; right:8px; border-bottom:1.5px solid rgba(0,255,100,0.6); border-right:1.5px solid rgba(0,255,100,0.6); animation-delay:1.5s; }
      `}</style>

      {/* ── Background grid ── */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="authgrid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(0,255,100,0.055)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#authgrid)"
            style={{ animation:'gridDrift 10s linear infinite' }}/>
        </svg>
      </div>

      {/* ── Scanline overlay ── */}
      <div style={{
        position:'fixed', inset:0, pointerEvents:'none', zIndex:1,
        backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,100,0.012) 2px,rgba(0,255,100,0.012) 4px)',
      }}/>

      {/* ── Moving scan line ── */}
      <div style={{
        position:'fixed', left:0, right:0, height:'2px',
        background:'linear-gradient(90deg,transparent,rgba(0,255,100,0.25),transparent)',
        pointerEvents:'none', zIndex:2,
        animation:'scanLine 5s linear infinite',
      }}/>

      {/* ── Radial glow ── */}
      <div style={{
        position:'fixed', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:'600px', height:'600px', borderRadius:'50%',
        background:'radial-gradient(circle,rgba(0,255,100,0.06) 0%,transparent 65%)',
        pointerEvents:'none', zIndex:0,
      }}/>

      {/* ── Matrix rain columns ── */}
      {[8,18,28,38,52,62,72,82,92].map((pct, i) => (
        <div key={i} style={{
          position:'fixed', left:`${pct}%`, top:0,
          fontSize:'9px', lineHeight:'1.5',
          color:'rgba(0,255,100,0.1)',
          pointerEvents:'none', zIndex:1,
          animation:`matrixFall ${7+i*1.2}s linear ${i*0.9}s infinite`,
          userSelect:'none', whiteSpace:'nowrap', writingMode:'vertical-lr',
        }}>
          {'10110010110100101101001'.repeat(6)}
        </div>
      ))}

      {/* ── Data nodes ── */}
      {NODES.map(n => (
        <div key={n.id} style={{
          position:'absolute', left:`${n.x}%`, top:`${n.y}%`,
          width:n.r*2, height:n.r*2, borderRadius:'50%',
          background:'#00ff64', pointerEvents:'none', zIndex:1,
          animation:`nodePulse ${n.dur}s ease-in-out ${n.delay}s infinite`,
        }}/>
      ))}

      {/* ── Candlestick chart (bottom-left) ── */}
      <div style={{
        position:'fixed', bottom:56, left:24,
        opacity:0.18, pointerEvents:'none', zIndex:1,
        display:'flex', flexDirection:'column', gap:4,
      }}>
        <div style={{ fontSize:8, color:'rgba(0,255,100,0.5)', fontFamily:'inherit', letterSpacing:'0.1em' }}>
          SPY · 1D
        </div>
        <svg width={chartW} height={chartH + 10} viewBox={`0 0 ${chartW} ${chartH + 10}`}>
          {/* Price line */}
          <polyline fill="none" stroke="#00ff64" strokeWidth="1.5"
            strokeDasharray="1200" strokeDashoffset="1200"
            points={linePoints}
            style={{ animation:'lineTrace 4s ease 0.5s forwards' }}/>
          {/* Candles */}
          {CANDLES.map((c, i) => {
            const cw   = 8;
            const gap  = chartW / CANDLES.length;
            const x    = i * gap + gap / 2 - cw / 2;
            const top  = chartH - (Math.max(c.open,c.close) / 90) * chartH;
            const bot  = chartH - (Math.min(c.open,c.close) / 90) * chartH;
            const hTop = chartH - (c.high / 90) * chartH;
            const hBot = chartH - (c.low  / 90) * chartH;
            const color = c.bull ? '#00ff64' : '#ff4466';
            return (
              <g key={i}>
                <line x1={x+cw/2} y1={hTop} x2={x+cw/2} y2={hBot}
                  stroke={color} strokeWidth="0.8" opacity="0.7"/>
                <rect x={x} y={top} width={cw} height={Math.max(bot-top,1)}
                  fill={color} opacity="0.75"
                  style={{ transformOrigin:`${x+cw/2}px ${top+Math.max(bot-top,1)/2}px`,
                           animation:`candleReveal 0.4s ease ${i*0.06}s both` }}/>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Candlestick chart (bottom-right, mirrored) ── */}
      <div style={{
        position:'fixed', bottom:56, right:24,
        opacity:0.12, pointerEvents:'none', zIndex:1,
        transform:'scaleX(-1)',
      }}>
        <svg width={200} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
          <polyline fill="none" stroke="#00ff64" strokeWidth="1.5"
            strokeDasharray="1200" strokeDashoffset="1200"
            points={linePoints}
            style={{ animation:'lineTrace 5s ease 1s forwards' }}/>
        </svg>
      </div>

      {/* ── Top stock ticker bar ── */}
      <div style={{
        position:'fixed', top:0, left:0, right:0, height:28,
        background:'rgba(0,10,3,0.92)', borderBottom:'1px solid rgba(0,255,100,0.12)',
        overflow:'hidden', zIndex:50, display:'flex', alignItems:'center',
      }}>
        <div style={{
          display:'flex', gap:0, whiteSpace:'nowrap',
          animation:'tickerScroll 35s linear infinite',
        }}>
          {tickerBar.map((t, i) => (
            <span key={i} style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'0 20px',
              fontSize:10, fontFamily:'inherit',
              color: i % TICKERS.length === activeTicker ? '#00ff64' : 'rgba(0,255,100,0.45)',
              borderRight:'1px solid rgba(0,255,100,0.08)',
              transition:'color 0.4s',
            }}>
              <span style={{ fontWeight:600, letterSpacing:'0.08em' }}>{t.sym}</span>
              <span style={{ opacity:0.8 }}>{t.val}</span>
              <span style={{ color: t.up ? '#00ff64' : '#ff4466', fontWeight:600 }}>{t.chg}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom news feed bar ── */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0, height:28,
        background:'rgba(0,10,3,0.92)', borderTop:'1px solid rgba(0,255,100,0.12)',
        overflow:'hidden', zIndex:50, display:'flex', alignItems:'center', gap:12,
      }}>
        <div style={{
          flexShrink:0, padding:'0 12px',
          fontSize:9, color:'#00ff64', fontFamily:'inherit',
          fontWeight:700, letterSpacing:'0.15em',
          borderRight:'1px solid rgba(0,255,100,0.2)',
        }}>
          LIVE
        </div>
        <div style={{ flex:1, overflow:'hidden' }}>
          <div style={{
            display:'flex', whiteSpace:'nowrap',
            animation:'newsScroll 40s linear infinite',
            fontSize:9, color:'rgba(0,255,100,0.5)',
            fontFamily:'inherit', letterSpacing:'0.06em',
          }}>
            {[...NEWS_ITEMS, ...NEWS_ITEMS].map((n, i) => (
              <span key={i} style={{ paddingRight:60 }}>
                <span style={{ color:'rgba(0,255,100,0.3)', marginRight:10 }}>◆</span>
                {n}
              </span>
            ))}
          </div>
        </div>
        <div style={{
          flexShrink:0, padding:'0 12px',
          fontSize:9, color:'rgba(0,255,100,0.3)', fontFamily:'inherit',
          display:'flex', alignItems:'center', gap:4,
        }}>
          <Wifi style={{ width:9, height:9 }}/>
          <span>CONNECTED</span>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className={`auth-card ${switching ? 'auth-card-switching' : ''}`}
        style={{ position:'relative', zIndex:10, width:'100%', maxWidth:420, marginTop:8 }}>

        {/* ── Logo section ── */}
        <div style={{ textAlign:'center', marginBottom:28 }}>

          {/* Radar scan ring around logo */}
          <div className="float-logo" style={{ position:'relative', display:'inline-block', marginBottom:12 }}>
            {/* Outer ring */}
            <div style={{
              position:'absolute', inset:-14, borderRadius:'50%',
              border:'1px solid rgba(0,255,100,0.12)',
            }}/>
            {/* Rotating radar sweep */}
            <div style={{
              position:'absolute', inset:-14, borderRadius:'50%',
              overflow:'hidden',
            }}>
              <div style={{
                position:'absolute', top:'50%', left:'50%',
                width:'50%', height:'2px',
                background:'linear-gradient(90deg,rgba(0,255,100,0.6),transparent)',
                transformOrigin:'0 50%',
                transform:`rotate(${scanAngle}deg)`,
              }}/>
              {/* Radar trail */}
              {[1,2,3].map(t => (
                <div key={t} style={{
                  position:'absolute', top:'50%', left:'50%',
                  width:'50%', height:'1px',
                  background:`linear-gradient(90deg,rgba(0,255,100,${0.15/t}),transparent)`,
                  transformOrigin:'0 50%',
                  transform:`rotate(${scanAngle - t*15}deg)`,
                }}/>
              ))}
            </div>
            {/* Second ring (dashed) */}
            <div style={{
              position:'absolute', inset:-6, borderRadius:'50%',
              border:'1px dashed rgba(0,255,100,0.2)',
              animation:'gridDrift 8s linear infinite',
            }}/>
            {/* Logo */}
            <div style={{
              width:72, height:72, borderRadius:'50%',
              boxShadow:'0 0 0 2px rgba(0,255,100,0.4), 0 0 28px rgba(0,255,100,0.2)',
              overflow:'hidden', position:'relative', zIndex:2,
            }}>
              <img src="/logo.png" alt="FinPulse" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
            </div>
            {/* AI scanning dots */}
            {[0,60,120,180,240,300].map(deg => (
              <div key={deg} style={{
                position:'absolute', width:4, height:4, borderRadius:'50%',
                background:'rgba(0,255,100,0.5)',
                top:`calc(50% + ${Math.sin((deg+scanAngle*0.5)*Math.PI/180)*38}px - 2px)`,
                left:`calc(50% + ${Math.cos((deg+scanAngle*0.5)*Math.PI/180)*38}px - 2px)`,
                boxShadow:'0 0 6px rgba(0,255,100,0.8)',
                transition:'top 0.016s linear, left 0.016s linear',
              }}/>
            ))}
          </div>

          {/* Title */}
          <div>
            <div style={{
              fontSize:15, fontWeight:700, color:'#00ff64',
              letterSpacing:'0.2em', fontFamily:'inherit', lineHeight:1.3,
              textShadow:'0 0 20px rgba(0,255,100,0.4)',
            }}>
              FINANCIAL NEWS
            </div>
            <div style={{
              fontSize:15, fontWeight:700, color:'#00ff64',
              letterSpacing:'0.2em', fontFamily:'inherit', lineHeight:1.3,
              textShadow:'0 0 20px rgba(0,255,100,0.4)',
            }}>
              CLASSIFIER AGENT
            </div>
            <div style={{
              fontSize:8, color:'rgba(0,255,100,0.35)',
              letterSpacing:'0.35em', fontFamily:'inherit', marginTop:4,
            }}>
              MARKET INTELLIGENCE PLATFORM
            </div>
          </div>

          {/* Status line */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            gap:8, marginTop:10,
            fontSize:9, color:'rgba(0,255,100,0.4)', fontFamily:'inherit',
            letterSpacing:'0.12em',
          }}>
            <Terminal style={{ width:10, height:10 }}/>
            <span className="cursor-blink">
              {mode === 'login' ? 'AUTHENTICATION REQUIRED' : 'NEW AGENT REGISTRATION'}
            </span>
          </div>
        </div>

        {/* ── Auth card ── */}
        <div style={{
          position:'relative',
          border:'1px solid rgba(0,255,100,0.18)',
          background:'rgba(5,14,7,0.88)',
          backdropFilter:'blur(12px)',
          borderRadius:10,
          padding:28,
          boxShadow:'0 0 60px rgba(0,255,100,0.06), inset 0 1px 0 rgba(0,255,100,0.08)',
        }}>
          {/* Corner brackets */}
          <div className="corner-tl"/><div className="corner-tr"/>
          <div className="corner-bl"/><div className="corner-br"/>

          {registered ? (
            /* ── Email confirmation state ── */
            <div style={{ textAlign:'center', padding:'16px 0' }}>
              <div style={{
                width:48, height:48, borderRadius:'50%',
                border:'1px solid rgba(0,255,100,0.35)',
                display:'flex', alignItems:'center', justifyContent:'center',
                margin:'0 auto 16px',
                boxShadow:'0 0 20px rgba(0,255,100,0.15)',
              }}>
                <Mail style={{ width:22, height:22, color:'#00ff64' }}/>
              </div>
              <p style={{ color:'#00ff64', fontFamily:'inherit', fontSize:12, fontWeight:600, marginBottom:6, letterSpacing:'0.1em' }}>
                CHECK YOUR INBOX
              </p>
              <p style={{ color:'rgba(0,255,100,0.5)', fontFamily:'inherit', fontSize:11, marginBottom:16 }}>
                Confirmation sent to{' '}
                <span style={{ color:'#00ff64' }}>{email}</span>
              </p>
              <div style={{
                border:'1px solid rgba(0,255,100,0.1)', borderRadius:6,
                padding:'12px 14px', marginBottom:16, textAlign:'left',
              }}>
                <p style={{ color:'rgba(0,255,100,0.35)', fontSize:9, fontFamily:'inherit', lineHeight:1.7, letterSpacing:'0.04em' }}>
                  💡 To skip email confirmation:<br/>
                  Supabase Dashboard → Authentication →<br/>
                  Providers → Email → disable "Confirm email"
                </p>
              </div>
              <button onClick={() => { setRegistered(false); setMode('login'); }}
                style={{
                  background:'none', border:'none', cursor:'pointer',
                  color:'rgba(0,255,100,0.5)', fontFamily:'inherit',
                  fontSize:10, letterSpacing:'0.1em', textDecoration:'underline',
                  transition:'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color='#00ff64')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(0,255,100,0.5)')}>
                ← BACK TO LOGIN
              </button>
            </div>
          ) : (
            <>
              {/* ── Mode tabs ── */}
              <div style={{
                display:'flex', marginBottom:24,
                border:'1px solid rgba(0,255,100,0.15)', borderRadius:6, overflow:'hidden',
              }}>
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => switchMode(m)}
                    className={`mode-tab ${mode===m ? 'mode-tab-active' : 'mode-tab-inactive'}`}>
                    {m === 'login' ? '[ LOGIN ]' : '[ REGISTER ]'}
                  </button>
                ))}
              </div>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {mode === 'register' && (
                  <div>
                    <label style={{
                      display:'block', fontSize:9, color:'rgba(0,255,100,0.5)',
                      letterSpacing:'0.2em', textTransform:'uppercase',
                      fontFamily:'inherit', marginBottom:6,
                    }}>
                      ▸ Display Name
                    </label>
                    <input type="text" className="fin-input" value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. John Trader" required/>
                  </div>
                )}

                <div>
                  <label style={{
                    display:'block', fontSize:9, color:'rgba(0,255,100,0.5)',
                    letterSpacing:'0.2em', textTransform:'uppercase',
                    fontFamily:'inherit', marginBottom:6,
                  }}>
                    ▸ Email Address
                  </label>
                  <input type="email" className="fin-input" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="agent@finpulse.io" required/>
                </div>

                <div>
                  <label style={{
                    display:'block', fontSize:9, color:'rgba(0,255,100,0.5)',
                    letterSpacing:'0.2em', textTransform:'uppercase',
                    fontFamily:'inherit', marginBottom:6,
                  }}>
                    ▸ Password
                  </label>
                  <div style={{ position:'relative' }}>
                    <input type={showPw ? 'text' : 'password'} className="fin-input"
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required minLength={6}
                      style={{ paddingRight:40 }}/>
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      style={{
                        position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                        background:'none', border:'none', cursor:'pointer',
                        color:'rgba(0,255,100,0.35)', padding:0,
                        transition:'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color='rgba(0,255,100,0.8)')}
                      onMouseLeave={e => (e.currentTarget.style.color='rgba(0,255,100,0.35)')}>
                      {showPw
                        ? <EyeOff style={{ width:14, height:14 }}/>
                        : <Eye     style={{ width:14, height:14 }}/>}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop:4 }}>
                  {loading
                    ? <><Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }}/> PROCESSING...</>
                    : mode === 'login'
                      ? <><Shield style={{ width:13, height:13 }}/> AUTHENTICATE</>
                      : <><Activity style={{ width:13, height:13 }}/> CREATE ACCOUNT</>}
                </button>
              </form>

              {/* Security line */}
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'center',
                gap:6, marginTop:16,
                fontSize:8, color:'rgba(0,255,100,0.2)', fontFamily:'inherit',
                letterSpacing:'0.1em',
              }}>
                <Shield style={{ width:9, height:9 }}/>
                <span>256-BIT ENCRYPTED · SUPABASE AUTH · ZERO-KNOWLEDGE</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p style={{
          textAlign:'center', fontSize:8, fontFamily:'inherit',
          color:'rgba(0,255,100,0.15)', marginTop:12, letterSpacing:'0.15em',
        }}>
          SECURE · REAL-TIME · AI-POWERED · v2.0
        </p>
      </div>

      {/* ── @keyframes for candleReveal (inline SVG can't use external CSS) ── */}
      <style>{`
        @keyframes candleReveal {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}