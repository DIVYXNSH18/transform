'use client';
import { X, Quote, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CitationModal({ citation, rawText, onClose }) {
  if (!citation) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(33, 37, 41, 0.45)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
      animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        background: 'rgb(233, 236, 239)',
        border: 'var(--clay-border)',
        boxShadow: 'var(--clay-shadow-card-hover)',
        borderRadius: 'var(--clay-radius-card)',
        width: '100%',
        maxWidth: '480px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'var(--clay-accent-blue-bg)',
              color: 'var(--clay-accent-blue)',
              border: '1px solid rgba(24, 100, 171, 0.2)',
              boxShadow: 'var(--clay-shadow-pill)',
              borderRadius: 'var(--clay-radius-pill)',
              padding: '3px 12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '800',
              fontSize: '11px'
            }}>
              CITATION [{citation.id}]
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--clay-accent-green)',
              background: 'var(--clay-accent-green-bg)',
              border: '1px solid rgba(43, 138, 62, 0.25)',
              boxShadow: 'var(--clay-shadow-pill)',
              padding: '3px 10px',
              borderRadius: 'var(--clay-radius-pill)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '800'
            }}>
              <ShieldCheck size={13} />
              Grounded Fact
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--clay-card-inset)',
              boxShadow: 'var(--clay-shadow-inset)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: 'var(--clay-radius-pill)',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--clay-primary-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div>
          <label style={{
            fontSize: '11px',
            color: 'var(--clay-primary-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)'
          }}>
            Synthesized Deliverable Claim:
          </label>
          <div style={{
            marginTop: '8px',
            padding: '14px 16px',
            background: 'var(--clay-card-inset)',
            boxShadow: 'var(--clay-shadow-inset)',
            borderRadius: 'var(--clay-radius-inner)',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--clay-primary-deep)',
            borderLeft: '4px solid var(--clay-primary)'
          }}>
            {citation.claim}
          </div>
        </div>

        <div>
          <label style={{
            fontSize: '11px',
            color: 'var(--clay-primary-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)'
          }}>
            Exact Source Quote (Telemetry Grounding):
          </label>
          <div style={{
            marginTop: '8px',
            padding: '14px 16px',
            background: 'rgb(233, 236, 239)',
            borderRadius: 'var(--clay-radius-inner)',
            fontSize: '13.5px',
            fontWeight: '500',
            color: 'var(--clay-primary-dark)',
            fontStyle: 'italic',
            border: 'var(--clay-border)',
            boxShadow: 'var(--clay-shadow-btn-secondary)',
            borderLeft: '4px solid var(--clay-accent-blue)',
            display: 'flex',
            gap: '10px'
          }}>
            <Quote size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--clay-accent-blue)' }} />
            <span>"{citation.source_quote}"</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary btn-pill"
          style={{ width: '100%', marginTop: '6px' }}
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
}
