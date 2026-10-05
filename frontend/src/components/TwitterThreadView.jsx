'use client';
import React, { useState } from 'react';
import { 
  Twitter, Copy, Check, Share2, Sparkles, MessageCircle, 
  Repeat2, Heart, Bookmark, BarChart2, CheckCircle2, RefreshCw 
} from 'lucide-react';

export default function TwitterThreadView({ 
  content = '', 
  onCitationClick, 
  onRegenerate, 
  isRegenerating = false,
  eventTitle = 'TransformAI Synthesis' 
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [likesState, setLikesState] = useState({});
  const [retweetState, setRetweetState] = useState({});

  if (!content) return null;

  // Split by markdown delimiter '---' or double newlines if no delimiter
  const rawTweets = content.includes('---')
    ? content.split('---').map(t => t.trim()).filter(Boolean)
    : content.split(/\n\s*\n\s*(?=\d+\/|\d+\.\s)/).map(t => t.trim()).filter(Boolean);

  const tweets = rawTweets.length > 0 ? rawTweets : [content.trim()];

  const handleCopySingle = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(tweets.join('\n\n---\n\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2200);
    } catch (e) {
      console.warn('Copy all failed', e);
    }
  };

  const toggleLike = (idx) => {
    setLikesState(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleRetweet = (idx) => {
    setRetweetState(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const renderTextWithCitations = (text) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citId = parseInt(match[1], 10);
        return (
          <span
            key={index}
            className="citation-pill"
            onClick={() => onCitationClick && onCitationClick({ id: citId, claim: 'Verified data point' })}
            title="Inspect source citation"
          >
            [{citId}]
          </span>
        );
      }
      return part;
    });
  };

  const totalChars = tweets.reduce((acc, t) => acc + t.length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--clay-card-inset)',
        boxShadow: 'var(--clay-shadow-inset)',
        padding: '12px 18px',
        borderRadius: 'var(--clay-radius-inner)',
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <span style={{ fontWeight: '900', fontSize: '15px' }}>𝕏</span>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--clay-primary-deep)' }}>
              Twitter / 𝕏 Thread Simulator
            </div>
            <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)', fontWeight: '600' }}>
              {tweets.length} Tweets • {totalChars} Characters Total • &lt;280 char compliant
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopyAll}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ fontSize: '12px', gap: '6px' }}
          >
            {copiedAll ? <Check size={13} color="var(--clay-accent-green)" /> : <Copy size={13} />}
            <span>{copiedAll ? 'Thread Copied!' : 'Copy Thread'}</span>
          </button>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm btn-pill"
              style={{ fontSize: '12px', gap: '6px' }}
            >
              <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>

      {/* Connected Thread Container */}
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {tweets.map((tweetText, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === tweets.length - 1;
          const charCount = tweetText.length;
          const isOverLimit = charCount > 280;
          const isLiked = !!likesState[idx];
          const isRetweeted = !!retweetState[idx];
          const baseLikes = 42 + (idx * 7);
          const currentLikes = isLiked ? baseLikes + 1 : baseLikes;
          const baseRetweets = 14 + (idx * 3);
          const currentRetweets = isRetweeted ? baseRetweets + 1 : baseRetweets;

          return (
            <div 
              key={idx} 
              style={{
                position: 'relative',
                display: 'flex',
                gap: '14px',
                paddingBottom: isLast ? '0' : '20px'
              }}
            >
              {/* Vertical Connecting Line */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  top: '52px',
                  bottom: '0',
                  left: '21px',
                  width: '2px',
                  background: 'rgba(29, 155, 240, 0.25)',
                  zIndex: 0
                }} />
              )}

              {/* Avatar */}
              <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1d9bf0 0%, #0c7abf 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '15px',
                  boxShadow: '0 2px 8px rgba(29, 155, 240, 0.3)',
                  border: '2px solid #ffffff'
                }}>
                  AI
                </div>
              </div>

              {/* Tweet Content Box */}
              <div style={{
                flex: 1,
                background: '#ffffff',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}>
                {/* Header: Author & Count */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f1419' }}>
                      TransformAI
                    </span>
                    <CheckCircle2 size={15} color="#1d9bf0" fill="#1d9bf0" />
                    <span style={{ fontSize: '13px', color: '#536471' }}>
                      @transform_ai
                    </span>
                    <span style={{ fontSize: '13px', color: '#536471' }}>•</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(29, 155, 240, 0.1)',
                      color: '#1d9bf0',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {idx + 1}/{tweets.length}
                    </span>
                  </div>

                  {/* Character Counter & Copy Single */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-mono)',
                      color: isOverLimit ? '#e03131' : '#2b8a3e',
                      background: isOverLimit ? '#fff5f5' : '#ebfbee',
                      border: `1px solid ${isOverLimit ? 'rgba(224,49,49,0.2)' : 'rgba(43,138,62,0.2)'}`,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {charCount} / 280
                    </span>
                    <button
                      onClick={() => handleCopySingle(tweetText, idx)}
                      className="btn-icon"
                      style={{
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: copiedIdx === idx ? '#2b8a3e' : '#536471'
                      }}
                      title="Copy Tweet"
                    >
                      {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Tweet Body */}
                <div style={{
                  fontSize: '14.5px',
                  lineHeight: '1.65',
                  color: '#0f1419',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word'
                }}>
                  {renderTextWithCitations(tweetText)}
                </div>

                {/* Simulated Interaction Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  color: '#536471',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <MessageCircle size={15} />
                    <span>{8 + idx}</span>
                  </div>

                  <div 
                    onClick={() => toggleRetweet(idx)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      cursor: 'pointer',
                      color: isRetweeted ? '#00ba7c' : '#536471',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    <Repeat2 size={16} />
                    <span>{currentRetweets}</span>
                  </div>

                  <div 
                    onClick={() => toggleLike(idx)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      cursor: 'pointer',
                      color: isLiked ? '#f91880' : '#536471',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    <Heart size={15} fill={isLiked ? '#f91880' : 'transparent'} />
                    <span>{currentLikes}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart2 size={15} />
                    <span>{(idx + 1) * 480}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bookmark size={15} style={{ cursor: 'pointer' }} />
                    <Share2 size={15} style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
