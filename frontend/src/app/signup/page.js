'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#c92a2a', '#e67700', '#2b8a3e', '#1864ab'];

function launchConfetti() {
  if (typeof window === 'undefined') return;
  const colors = ['#495057', '#868e96', '#dee2e6', '#212529', '#adb5bd'];
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    vr: (Math.random() - 0.5) * 0.15,
  }));
  let frame;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (pieces.some(p => p.y < canvas.height + 20)) frame = requestAnimationFrame(draw);
    else { cancelAnimationFrame(frame); canvas.remove(); }
  };
  draw();
  setTimeout(() => { cancelAnimationFrame(frame); canvas.remove(); }, 3000);
}

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = getStrength(form.password);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const res = signup(form.name, form.email, form.password);
    setLoading(false);
    if (res.error) return setError(res.error);
    launchConfetti();
    setTimeout(() => router.push('/'), 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div className="brand-logo" style={{ width: 36, height: 36, borderRadius: 12 }}>
            <Zap size={18} fill="#fff" color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--clay-primary-deep)' }}>Create Account</div>
            <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: 600 }}>Join TransformAI Edge</div>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="auth-input-wrap">
            <label className="auth-label">Full Name</label>
            <input className="auth-input" placeholder="Alex Chen" value={form.name} onChange={set('name')} required />
          </div>
          <div className="auth-input-wrap">
            <label className="auth-label">Email</label>
            <input type="email" className="auth-input" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
          </div>
          <div className="auth-input-wrap">
            <label className="auth-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="auth-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set('password')}
                required
                style={{ paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="auth-pw-toggle">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: '8px' }}>
                <div className="password-strength-track">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="password-strength-bar" style={{ background: i <= strength ? STRENGTH_COLORS[strength] : 'var(--clay-card-inset)' }} />
                  ))}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: STRENGTH_COLORS[strength] }}>{STRENGTH_LABELS[strength]}</span>
              </div>
            )}
          </div>
          <div className="auth-input-wrap">
            <label className="auth-label">Confirm Password</label>
            <input type="password" className="auth-input" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--clay-primary-muted)', fontWeight: 600 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--clay-primary-deep)', fontWeight: 800, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
