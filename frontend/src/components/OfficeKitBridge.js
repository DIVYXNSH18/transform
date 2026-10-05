'use client';
import { useState, useEffect } from 'react';
import { Laptop, Wifi, ShieldCheck, Copy, Cast, Cpu } from 'lucide-react';
import { checkBackendHealth } from '../lib/api';

export default function OfficeKitBridge() {
  const [health, setHealth] = useState(null);
  const [ping, setPing] = useState(4);
  const [isMirroring, setIsMirroring] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function poll() {
      const start = Date.now();
      const data = await checkBackendHealth();
      const elapsed = Math.max(2, Date.now() - start);
      if (mounted) {
        setHealth(data);
        setPing(elapsed);
      }
    }
    poll();
    const interval = setInterval(poll, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{
      background: 'rgb(233, 236, 239)',
      border: 'var(--clay-border)',
      borderRadius: 'var(--clay-radius-card-sm)',
      boxShadow: 'var(--clay-shadow-card)',
      padding: '10px 20px',
      margin: '0 4px 18px 4px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--clay-primary-dark)',
      fontWeight: '600'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: health?.status === 'online' ? 'var(--clay-accent-green-bg)' : 'var(--clay-accent-coral-bg)',
          color: health?.status === 'online' ? 'var(--clay-accent-green)' : 'var(--clay-accent-coral)',
          boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.9), inset -1px -1px 3px rgba(0,0,0,0.06)',
          borderRadius: 'var(--clay-radius-pill)',
          padding: '3px 10px',
          fontSize: '11px',
          fontWeight: '800'
        }}>
          <span className="pulse-dot" style={{
            background: health?.status === 'online' ? 'var(--clay-accent-green)' : 'var(--clay-accent-coral)'
          }} />
          {health?.status === 'online' ? 'EDGE LINK ONLINE' : 'CONNECTING EDGE...'}
        </span>

        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: 'var(--clay-primary-muted)',
          background: 'var(--clay-card-inset)',
          boxShadow: 'var(--clay-shadow-inset)',
          padding: '3px 10px',
          borderRadius: 'var(--clay-radius-pill)',
          fontWeight: '700'
        }}>
          <Wifi size={12} />
          <span>{ping}ms Local Wi-Fi</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span title="Headless Laptop Compute with Lid Closed" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'var(--clay-card-inset)',
          boxShadow: 'var(--clay-shadow-inset)',
          padding: '3px 9px',
          borderRadius: 'var(--clay-radius-pill)',
          color: 'var(--clay-primary-dark)',
          fontSize: '10px',
          fontWeight: '800'
        }}>
          <Laptop size={11} />
          HEADLESS
        </span>

        <button
          onClick={() => setIsMirroring(!isMirroring)}
          title="Toggle Screen Mirroring for Pitch"
          style={{
            background: isMirroring ? 'linear-gradient(145deg, #535a61, #3c4248)' : '#ffffff',
            color: isMirroring ? '#ffffff' : 'var(--clay-primary-deep)',
            boxShadow: isMirroring 
              ? 'inset 2px 2px 4px rgba(0,0,0,0.4)' 
              : '3px 4px 10px rgba(73, 80, 87, 0.1), inset 2px 2px 4px rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: 'var(--clay-radius-pill)',
            padding: '4px 11px',
            fontSize: '10px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Cast size={11} />
          {isMirroring ? 'MIRRORING' : 'MIRROR'}
        </button>
      </div>
    </div>
  );
}
