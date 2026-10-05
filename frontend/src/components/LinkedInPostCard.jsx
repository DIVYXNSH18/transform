'use client';
import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Copy, Check, Sparkles, Globe, MoreHorizontal, CheckCircle2 } from 'lucide-react';

export default function LinkedInPostCard({ content, authorName = "Executive Content Voice", headline = "VP Strategy & Transformation | AI Operations Lead" }) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const toggleLike = () => {
    setHasLiked(!hasLiked);
    setLikes(prev => hasLiked ? prev - 1 : prev + 1);
  };

  if (!content) return null;

  // Format content: highlight hashtags in LinkedIn blue
  const renderFormattedLinkedInText = (text) => {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.map((para, pIdx) => {
      const words = para.split(' ');
      return (
        <p key={pIdx} style={{ marginBottom: '14px', lineHeight: '1.65', fontSize: '14.5px', color: '#1e293b' }}>
          {words.map((word, wIdx) => {
            if (word.startsWith('#')) {
              return (
                <span key={wIdx} style={{ color: '#0a66c2', fontWeight: '600', cursor: 'pointer' }}>
                  {word}{' '}
                </span>
              );
            }
            return word + ' ';
          })}
        </p>
      );
    });
  };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
    }}>
      {/* Top Banner / Mock LinkedIn Header */}
      <div style={{
        padding: '16px 20px 12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Avatar with gradient border */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(10, 102, 194, 0.3)'
          }}>
            AI
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>{authorName}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>• 1st</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.3' }}>{headline}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              <span>Just now</span>
              <span>•</span>
              <Globe size={11} />
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="btn btn-secondary btn-sm btn-pill"
          style={{ gap: '6px', fontSize: '12px', padding: '6px 12px' }}
        >
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          <span>{copied ? 'Copied Post!' : 'Copy Post'}</span>
        </button>
      </div>

      {/* Main LinkedIn Post Content */}
      <div style={{ padding: '20px 24px 12px 24px', background: '#ffffff' }}>
        {renderFormattedLinkedInText(content)}
      </div>

      {/* Social Stats / Reaction Count */}
      <div style={{
        padding: '8px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#0a66c2',
            color: '#fff',
            fontSize: '10px'
          }}>
            👍
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#057642',
            color: '#fff',
            fontSize: '10px',
            marginLeft: '-4px'
          }}>
            💡
          </span>
          <span style={{ marginLeft: '4px', fontWeight: '500' }}>{likes}</span>
        </div>
        <div>
          <span>24 comments • 9 reposts</span>
        </div>
      </div>

      {/* Action Bar (Like, Comment, Repost, Send) */}
      <div style={{
        padding: '4px 12px',
        display: 'flex',
        justifyContent: 'space-around',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        background: '#f8fafc'
      }}>
        <button
          onClick={toggleLike}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: hasLiked ? '#0a66c2' : '#64748b',
            borderRadius: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <ThumbsUp size={16} fill={hasLiked ? '#0a66c2' : 'none'} />
          <span>Like</span>
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: '#64748b',
            borderRadius: '8px'
          }}
        >
          <MessageSquare size={16} />
          <span>Comment</span>
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: '#64748b',
            borderRadius: '8px'
          }}
        >
          <Repeat2 size={16} />
          <span>Repost</span>
        </button>

        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: '#64748b',
            borderRadius: '8px'
          }}
        >
          <Send size={16} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
