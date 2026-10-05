'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { User, Cpu, Zap, LogOut, Shield, BarChart2 } from 'lucide-react';

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated]);

  if (!user) return null;

  const handleLogout = () => { logout(); router.push('/'); };

  const stats = [
    { label: 'Transformations', value: '24', icon: <Zap size={16} /> },
    { label: 'Deliverables', value: '96', icon: <BarChart2 size={16} /> },
    { label: 'Edge Sessions', value: '12', icon: <Cpu size={16} /> },
  ];

  return (
    <div className="content-wrapper">
      <div className="bento-grid">
        {/* Profile Card */}
        <div className="bento-card bento-span-12" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div className="account-avatar" style={{ width: 64, height: 64, fontSize: '22px', borderRadius: '20px', flexShrink: 0 }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--clay-primary-deep)', letterSpacing: '-0.5px' }}>{user.name}</h1>
              <span className="auth-badge auth-badge-lg">{user.plan}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--clay-primary-muted)', fontWeight: 600, marginTop: '4px' }}>{user.email}</div>
            <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', marginTop: '4px' }}>
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ gap: '6px', flexShrink: 0 }}>
            <LogOut size={13} />
            Sign Out
          </button>
        </div>

        {/* Stats Row */}
        {stats.map(s => (
          <div key={s.label} className="bento-card bento-span-4" style={{ alignItems: 'center', textAlign: 'center', padding: '22px 16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--clay-card-inset)', boxShadow: 'var(--clay-shadow-inset)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', color: 'var(--clay-primary)' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--clay-primary-deep)', letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--clay-primary-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}

        {/* Plan Details */}
        <div className="bento-card bento-span-6">
          <div className="bento-tag"><Shield size={12} /><span>Plan Details</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              ['Current Plan', user.plan],
              ['Transformation Quota', user.plan === 'Pro Edge' ? 'Unlimited' : '10 / month'],
              ['Export Formats', '.pptx, .docx, Markdown'],
              ['Edge Node', 'Local Compute Active'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--clay-card-inset)', borderRadius: 'var(--clay-radius-inner)', boxShadow: 'var(--clay-shadow-inset)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--clay-primary-muted)' }}>{k}</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--clay-primary-deep)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Telemetry */}
        <div className="bento-card bento-span-6">
          <div className="bento-tag"><Cpu size={12} /><span>Device Telemetry</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              ['Compute Node', 'Laptop (Headless)'],
              ['LLM Engine', 'Ollama / Llama-3.2'],
              ['API Endpoint', 'http://127.0.0.1:8000'],
              ['Status', '● Online'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--clay-card-inset)', borderRadius: 'var(--clay-radius-inner)', boxShadow: 'var(--clay-shadow-inset)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--clay-primary-muted)' }}>{k}</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: k === 'Status' ? 'var(--clay-accent-green)' : 'var(--clay-primary-deep)', fontFamily: k === 'API Endpoint' ? 'var(--font-mono)' : 'inherit' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
