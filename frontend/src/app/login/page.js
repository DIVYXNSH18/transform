'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, quickDemoLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const res = login(email, password);
    setLoading(false);
    if (res.error) return setError(res.error);
    router.push('/');
  };

  const handleDemo = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    quickDemoLogin();
    router.push('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ animationDelay: '0ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div className="brand-logo" style={{ width: 36, height: 36, borderRadius: 12 }}>
            <Zap size={18} fill="#fff" color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--clay-primary-deep)' }}>TransformAI</div>
            <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: 600 }}>Sign in to your account</div>
          </div>
        </div>

        <button onClick={handleDemo} disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '20px', gap: '8px', justifyContent: 'center' }}>
          <Sparkles size={15} />
          1-Click Instant Demo Login
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--clay-card-inset)', boxShadow: 'var(--clay-shadow-inset)' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--clay-primary-muted)' }}>OR SIGN IN</span>
          <div style={{ flex: 1, height: 1, background: 'var(--clay-card-inset)', boxShadow: 'var(--clay-shadow-inset)' }} />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="auth-input-wrap">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-input-wrap">
            <label className="auth-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="auth-pw-toggle">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 600, color: 'var(--clay-primary-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: 'var(--clay-primary)' }} />
              Remember me
            </label>
            <Link href="/forgot-password" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--clay-primary)', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn btn-secondary" style={{ width: '100%', marginTop: '4px' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--clay-primary-muted)', fontWeight: 600 }}>
          No account?{' '}
          <Link href="/signup" style={{ color: 'var(--clay-primary-deep)', fontWeight: 800, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
