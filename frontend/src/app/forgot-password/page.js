'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Zap, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [step, setStep] = useState(1); // 1: email, 2: code+new pw, 3: done
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    const db = JSON.parse(localStorage.getItem('transformai_users_db') || '[]');
    if (!db.find(u => u.email === email)) return setError('No account found with that email.');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(c);
    setLoading(false);
    setStep(2);
    // In a real app this would be emailed; for demo we show it
    alert(`Demo Recovery Code: ${c}\n(In production this would be emailed)`);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (code !== generatedCode) return setError('Invalid recovery code.');
    if (newPw.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    resetPassword(email, newPw);
    setLoading(false);
    setStep(3);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div className="brand-logo" style={{ width: 36, height: 36, borderRadius: 12 }}>
            <Zap size={18} fill="#fff" color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--clay-primary-deep)' }}>Reset Password</div>
            <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: 600 }}>
              Step {Math.min(step, 2)} of 2
            </div>
          </div>
        </div>

        {step === 3 ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <CheckCircle size={48} color="var(--clay-accent-green)" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--clay-primary-deep)', marginBottom: '8px' }}>Password Reset!</div>
            <p style={{ fontSize: '13px', color: 'var(--clay-primary-muted)', marginBottom: '24px' }}>
              Your password has been updated successfully.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}

            {step === 1 && (
              <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '13px', color: 'var(--clay-primary-muted)', fontWeight: 500, marginBottom: '4px' }}>
                  Enter your registered email to receive a recovery code.
                </p>
                <div className="auth-input-wrap">
                  <label className="auth-label">Email</label>
                  <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                  {loading ? 'Sending…' : 'Send Recovery Code'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '13px', color: 'var(--clay-primary-muted)', fontWeight: 500, marginBottom: '4px' }}>
                  Enter the 6-digit code and your new password.
                </p>
                <div className="auth-input-wrap">
                  <label className="auth-label">Recovery Code</label>
                  <input className="auth-input" placeholder="123456" value={code} onChange={e => setCode(e.target.value)} required maxLength={6} style={{ fontFamily: 'var(--font-mono)', letterSpacing: '4px', fontSize: '18px' }} />
                </div>
                <div className="auth-input-wrap">
                  <label className="auth-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Min. 6 characters"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      required
                      style={{ paddingRight: '44px' }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="auth-pw-toggle">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>
              </form>
            )}

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--clay-primary-muted)', fontWeight: 600 }}>
              <Link href="/login" style={{ color: 'var(--clay-primary-deep)', fontWeight: 800, textDecoration: 'none' }}>← Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
