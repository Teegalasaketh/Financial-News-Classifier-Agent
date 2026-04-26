/**
 * AuthPage.tsx — uses project logo image instead of Activity icon.
 * Place logo.png in /public/logo.png (already done).
 */

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Terminal, Mail } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#080b0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,100,0.015) 2px,rgba(0,255,100,0.015) 4px)' }} />
      {/* Grid bg */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(0,255,100,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,100,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Radial glow behind logo */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle,rgba(0,255,100,0.07) 0%,transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md">

        {/* ── Logo + title ── */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-3 mb-2">
            {/* Logo image — circular crop with subtle green ring */}
            <div className="relative w-20 h-20 rounded-full"
              style={{ boxShadow: '0 0 0 2px rgba(0,255,100,0.35), 0 0 24px rgba(0,255,100,0.15)' }}>
              <img
                src="/logo.png"
                alt="Financial News Classifier Agent logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div>
              <div className="text-lg font-bold text-[#00ff64] tracking-[0.18em] font-mono leading-tight">
                FINANCIAL NEWS
              </div>
              <div className="text-lg font-bold text-[#00ff64] tracking-[0.18em] font-mono leading-tight">
                CLASSIFIER AGENT
              </div>
              <div className="text-[9px] font-mono text-[#00ff64]/45 tracking-[0.35em] mt-1">
                MARKET INTELLIGENCE PLATFORM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center text-[#00ff64]/40 text-xs font-mono mt-3">
            <Terminal className="w-3 h-3" />
            <span>{mode === 'login' ? 'AUTHENTICATION REQUIRED' : 'NEW AGENT REGISTRATION'}</span>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="border border-[#00ff64]/20 bg-[#0a0f0a]/80 backdrop-blur rounded-lg p-6"
          style={{ boxShadow: '0 0 40px rgba(0,255,100,0.05), inset 0 1px 0 rgba(0,255,100,0.1)' }}>

          {registered ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full border border-[#00ff64]/40 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-[#00ff64]" />
              </div>
              <div>
                <p className="text-[#00ff64] font-mono text-sm font-bold mb-1">Check your inbox</p>
                <p className="text-[#00ff64]/60 font-mono text-xs">
                  Confirmation link sent to <span className="text-[#00ff64]">{email}</span>
                </p>
              </div>
              <div className="border border-[#00ff64]/10 rounded p-3 text-left">
                <p className="text-[#00ff64]/40 text-[10px] font-mono leading-relaxed">
                  💡 Skip email confirmation:<br />
                  Supabase Dashboard → Authentication →<br />
                  Providers → Email → disable "Confirm email"
                </p>
              </div>
              <button onClick={() => { setRegistered(false); setMode('login'); }}
                className="text-xs font-mono text-[#00ff64]/60 hover:text-[#00ff64] underline transition-colors">
                Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Mode tabs */}
              <div className="flex mb-6 border border-[#00ff64]/20 rounded overflow-hidden">
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-xs font-mono tracking-widest uppercase transition-all ${
                      mode === m
                        ? 'bg-[#00ff64]/10 text-[#00ff64] border-b-2 border-[#00ff64]'
                        : 'text-[#00ff64]/40 hover:text-[#00ff64]/60'
                    }`}>
                    {m === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-mono text-[#00ff64]/60 tracking-widest uppercase mb-1.5">
                      Display Name
                    </label>
                    <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. John Trader"
                      className="w-full bg-[#080b0f] border border-[#00ff64]/20 rounded px-3 py-2.5 text-sm font-mono text-[#00ff64] placeholder:text-[#00ff64]/20 focus:outline-none focus:border-[#00ff64]/60 transition-colors"
                      required />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-mono text-[#00ff64]/60 tracking-widest uppercase mb-1.5">
                    Email
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="agent@finpulse.io"
                    className="w-full bg-[#080b0f] border border-[#00ff64]/20 rounded px-3 py-2.5 text-sm font-mono text-[#00ff64] placeholder:text-[#00ff64]/20 focus:outline-none focus:border-[#00ff64]/60 transition-colors"
                    required />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#00ff64]/60 tracking-widest uppercase mb-1.5">
                    Password
                  </label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#080b0f] border border-[#00ff64]/20 rounded px-3 py-2.5 text-sm font-mono text-[#00ff64] placeholder:text-[#00ff64]/20 focus:outline-none focus:border-[#00ff64]/60 transition-colors"
                    required minLength={6} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full mt-2 py-2.5 bg-[#00ff64]/10 border border-[#00ff64]/40 hover:bg-[#00ff64]/20 hover:border-[#00ff64]/80 text-[#00ff64] font-mono text-sm tracking-widest uppercase rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 0 20px rgba(0,255,100,0.1)' }}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Processing...' : mode === 'login' ? 'Authenticate' : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[10px] font-mono text-[#00ff64]/20 mt-4 tracking-wider">
          SECURE · REAL-TIME · AI-POWERED
        </p>
      </div>
    </div>
  );
}