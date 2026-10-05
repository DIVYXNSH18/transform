import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="content-wrapper" style={{
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div className="bento-card" style={{ maxWidth: '460px', padding: '40px 32px', alignItems: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--clay-card-inset)',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '8px 12px 24px rgba(73, 80, 87, 0.12), inset 3px 3px 6px rgba(255, 255, 255, 0.9), inset -3px -3px 6px rgba(73, 80, 87, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px'
        }}>
          <AlertTriangle size={28} color="var(--clay-primary-dark)" />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--clay-primary-deep)', letterSpacing: '-0.5px' }}>
          404 - Page Not Found
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--clay-primary-muted)', marginTop: '8px', fontWeight: '500', lineHeight: 1.5 }}>
          The deliverable or section you are looking for does not exist or has moved.
        </p>

        <Link
          href="/"
          className="btn btn-primary btn-pill"
          style={{ marginTop: '24px', width: '100%', gap: '8px' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
