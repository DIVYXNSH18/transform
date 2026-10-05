'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, RefreshCw, MessageSquare, MonitorPlay, Sparkles } from 'lucide-react';
import { regenerateSlideItem, API_BASE } from '../lib/api';

export default function SlideViewer({ slides = [], ico = null, pptxUrl = null, onSlideUpdated }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  const fullPptx = pptxUrl ? (pptxUrl.startsWith('http') ? pptxUrl : `${API_BASE}${pptxUrl.startsWith('/') ? pptxUrl : '/' + pptxUrl}`) : null;

  if (!slides || slides.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: 'var(--clay-primary-muted)',
        background: 'rgb(233, 236, 239)',
        border: 'var(--clay-border)',
        borderRadius: 'var(--clay-radius-card)',
        boxShadow: 'var(--clay-shadow-card)',
        fontWeight: '700'
      }}>
        No slide data available.
      </div>
    );
  }

  const slide = slides[currentIdx] || slides[0];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const triggerDownload = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleRegenerateCurrentSlide = async () => {
    if (!ico || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const res = await regenerateSlideItem({
        ico,
        slide_number: currentIdx + 1,
        instructions: 'Elevate strategic impact, clarify bullet takeaways'
      });
      if (onSlideUpdated && res.all_slides) {
        onSlideUpdated(res.all_slides, res.pptx_url);
      }
    } catch (err) {
      console.warn('Slide regeneration error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Slide Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgb(233, 236, 239)',
        padding: '12px 18px',
        borderRadius: 'var(--clay-radius-inner)',
        border: 'var(--clay-border)',
        boxShadow: 'var(--clay-shadow-btn-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MonitorPlay size={18} color="var(--clay-primary)" />
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)',
            background: 'var(--clay-card-inset)',
            boxShadow: 'var(--clay-shadow-inset)',
            color: 'var(--clay-primary-deep)',
            padding: '4px 12px',
            borderRadius: 'var(--clay-radius-pill)'
          }}>
            SLIDE {currentIdx + 1} OF {slides.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handlePrev}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ padding: '8px 12px' }}
            title="Previous Slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ padding: '8px 12px' }}
            title="Next Slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slide Card Preview (Responsive Aspect Ratio Canvas) */}
      <div className="slide-card-container">
        {/* Top Accent Light Highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--clay-primary), var(--clay-primary-light))'
        }} />

        <div>
          <div style={{
            fontSize: '10.5px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--clay-primary)',
            fontWeight: '800',
            letterSpacing: '0.8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--clay-card-inset)',
            boxShadow: 'var(--clay-shadow-inset)',
            padding: '3px 10px',
            borderRadius: 'var(--clay-radius-pill)',
            marginBottom: '10px'
          }}>
            TRANSFORMAI // SLIDE {String(currentIdx + 1).padStart(2, '0')} // EDGE ENGINE
          </div>
          <h3 style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: '900',
            color: 'var(--clay-primary-deep)',
            lineHeight: 1.25,
            letterSpacing: '-0.5px'
          }}>
            {slide.title}
          </h3>
          {slide.subtitle && (
            <div style={{
              fontSize: '13px',
              color: 'var(--clay-primary-muted)',
              marginTop: '4px',
              fontWeight: '600'
            }}>
              {slide.subtitle}
            </div>
          )}
        </div>

        {/* Bullets */}
        <div style={{
          flex: 1,
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflowY: 'auto'
        }}>
          {(slide.bullets || []).map((b, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--clay-primary-dark)',
              lineHeight: 1.45
            }}>
              <span style={{
                color: 'var(--clay-primary)',
                fontWeight: '900',
                fontSize: '16px',
                lineHeight: 1
              }}>
                •
              </span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Slide Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(73, 80, 87, 0.08)',
          paddingTop: '10px',
          marginTop: '10px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: '600' }}>
            Factual Grounding • Single ICO Model
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--clay-primary-muted)',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700'
          }}>
            16:9 Widescreen (.PPTX)
          </span>
        </div>
      </div>

      {/* Slide Actions Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleRegenerateCurrentSlide}
          disabled={isRegenerating}
          className="btn btn-secondary btn-sm btn-pill"
          style={{ flex: 1 }}
        >
          <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
          <span>{isRegenerating ? 'Refining...' : 'Refine Slide'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="btn btn-secondary btn-sm btn-pill"
        >
          <MessageSquare size={13} />
          <span>{showNotes ? 'Hide Notes' : 'Speaker Notes'}</span>
        </button>

        {fullPptx && (
          <button
            type="button"
            onClick={() => triggerDownload(fullPptx, 'TransformAI_Presentation.pptx')}
            className="btn btn-primary btn-sm btn-pill"
          >
            <Download size={13} />
            <span>Deck (.pptx)</span>
          </button>
        )}
      </div>

      {/* Speaker Notes Box */}
      {showNotes && (
        <div style={{
          background: 'rgb(233, 236, 239)',
          border: 'var(--clay-border)',
          borderRadius: 'var(--clay-radius-inner)',
          padding: '18px 20px',
          borderLeft: '4px solid var(--clay-primary)',
          boxShadow: 'var(--clay-shadow-btn-secondary)'
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            color: 'var(--clay-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px'
          }}>
            <MessageSquare size={13} />
            <span>SPEAKER SCRIPT / SCRIPT NOTES:</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--clay-primary-deep)', fontStyle: 'italic', lineHeight: 1.6, fontWeight: '500' }}>
            "{slide.speaker_notes || 'Deliver the core slide takeaways with confidence and conviction.'}"
          </p>
        </div>
      )}
    </div>
  );
}
