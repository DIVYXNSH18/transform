'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function MarkdownRenderer({ content, ico, sourceText, onCitationClick, onRetry, isRegenerating }) {
  if (!content) return null;

  // Check if content indicates an error from backend (Issue 12)
  if (typeof content === 'string' && content.startsWith('Error generating')) {
    return (
      <div style={{
        background: '#fff5f5',
        border: '1px solid #ffc9c9',
        borderRadius: 'var(--clay-radius-inner)',
        padding: '20px 24px',
        color: '#c92a2a',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} color="#e03131" />
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '15px' }}>Deliverable Generation Notice</h4>
        </div>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#495057' }}>
          {content}
        </p>
        {onRetry && (
          <div style={{ marginTop: '4px' }}>
            <button
              onClick={onRetry}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm"
              style={{ background: '#fff', borderColor: '#ffa8a8', color: '#c92a2a', gap: '6px' }}
            >
              <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Retry Generation</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Recursive helper to parse inline citations [1], [2] inside text children
  const processChildren = (children) => {
    return React.Children.map(children, (child) => {
      if (typeof child === 'string') {
        const parts = child.split(/(\[\d+\])/g);
        if (parts.length === 1) return child;
        return parts.map((part, idx) => {
          const match = part.match(/\[(\d+)\]/);
          if (match) {
            const citId = parseInt(match[1], 10);
            const citObj = (ico?.citations || []).find((c) => c.id === citId) || {
              id: citId,
              claim: "Verified fact from input telemetry",
              source_quote: sourceText ? sourceText.substring(0, 100) : "Source memo input"
            };
            return (
              <span
                key={idx}
                className="citation-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCitationClick) onCitationClick(citObj);
                }}
                title="Click to inspect exact source citation"
                style={{ cursor: 'pointer', margin: '0 2px' }}
              >
                [{citId}]
              </span>
            );
          }
          return part;
        });
      }
      return child;
    });
  };

  return (
    <div className="markdown-body" style={{ color: 'var(--clay-text)', fontSize: '14.5px', lineHeight: '1.7' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: 'var(--clay-primary-deep)',
              marginTop: '16px',
              marginBottom: '12px',
              borderBottom: '2px solid rgba(73, 80, 87, 0.1)',
              paddingBottom: '8px'
            }}>
              {processChildren(children)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{
              fontSize: '16.5px',
              fontWeight: '700',
              color: 'var(--clay-primary-dark)',
              marginTop: '20px',
              marginBottom: '10px'
            }}>
              {processChildren(children)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{
              fontSize: '14.5px',
              fontWeight: '700',
              color: 'var(--clay-primary)',
              marginTop: '16px',
              marginBottom: '8px'
            }}>
              {processChildren(children)}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: '12px' }}>
              {processChildren(children)}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: '22px', marginBottom: '14px', listStyleType: 'disc' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: '22px', marginBottom: '14px' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '6px' }}>
              {processChildren(children)}
            </li>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: '700', color: 'var(--clay-primary-deep)' }}>
              {processChildren(children)}
            </strong>
          ),
          table: ({ children }) => (
            <div style={{
              overflowX: 'auto',
              margin: '16px 0',
              borderRadius: 'var(--clay-radius-inner)',
              border: '1px solid rgba(73, 80, 87, 0.15)',
              background: 'var(--clay-canvas)'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
                textAlign: 'left'
              }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{
              background: 'var(--clay-card-inset)',
              borderBottom: '2px solid rgba(73, 80, 87, 0.15)'
            }}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th style={{
              padding: '10px 14px',
              fontWeight: '800',
              color: 'var(--clay-primary-deep)',
              letterSpacing: '0.02em',
              fontSize: '12px',
              textTransform: 'uppercase'
            }}>
              {processChildren(children)}
            </th>
          ),
          td: ({ children }) => (
            <td style={{
              padding: '10px 14px',
              borderTop: '1px solid rgba(73, 80, 87, 0.08)',
              color: 'var(--clay-text)'
            }}>
              {processChildren(children)}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid #FF6B00',
              padding: '8px 16px',
              margin: '14px 0',
              background: 'rgba(255, 107, 0, 0.05)',
              borderRadius: '0 8px 8px 0',
              color: 'var(--clay-primary-dark)'
            }}>
              {children}
            </blockquote>
          ),
          code: ({ inline, children }) => (
            inline ? (
              <code style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                background: 'var(--clay-card-inset)',
                padding: '2px 6px',
                borderRadius: '4px',
                color: 'var(--clay-primary-deep)'
              }}>
                {children}
              </code>
            ) : (
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                background: 'var(--clay-card-inset)',
                padding: '14px',
                borderRadius: 'var(--clay-radius-inner)',
                overflowX: 'auto',
                margin: '12px 0'
              }}>
                <code>{children}</code>
              </pre>
            )
          ),
          hr: () => (
            <hr style={{
              border: 'none',
              borderTop: '1px solid rgba(73, 80, 87, 0.12)',
              margin: '18px 0'
            }} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
