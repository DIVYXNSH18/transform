'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Film, Play, Pause, Download, Copy, Check, Sparkles, 
  Clock, Music, Volume2, Type, Sliders, RefreshCw, FileText, Monitor, ChevronRight
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function VideoPackageViewer({
  content = '',
  ico = null,
  sourceText = '',
  onCitationClick,
  onRegenerate,
  isRegenerating = false
}) {
  const [activeSubTab, setActiveSubTab] = useState('storyboard'); // 'storyboard' | 'teleprompter' | 'subtitles' | 'raw'
  const [isPlayingPrompter, setIsPlayingPrompter] = useState(false);
  const [prompterSpeed, setPrompterSpeed] = useState(130); // Words per minute
  const [prompterFontSize, setPrompterFontSize] = useState(24);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedVtt, setCopiedVtt] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeakingScene, setActiveSpeakingScene] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const prompterRef = useRef(null);

  // Load browser TTS voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
          const englishIdx = available.findIndex(v => v.lang.startsWith('en'));
          if (englishIdx !== -1) setSelectedVoiceIndex(englishIdx);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Stop speech when changing subtabs or unmounting
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingScene(null);
    }
  }, [activeSubTab]);

  // Auto-scroll loop for teleprompter
  useEffect(() => {
    let animId;
    if (isPlayingPrompter && prompterRef.current) {
      const step = () => {
        if (prompterRef.current) {
          // Speed scale: 130 wpm roughly maps to ~1.2 pixels per frame
          const scrollStep = (prompterSpeed / 130) * 0.8;
          prompterRef.current.scrollTop += scrollStep;
          if (prompterRef.current.scrollTop + prompterRef.current.clientHeight >= prompterRef.current.scrollHeight) {
            setIsPlayingPrompter(false);
            return;
          }
        }
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlayingPrompter, prompterSpeed]);

  if (!content) return null;

  // Extract Scene Cards from Markdown
  const extractScenes = (text) => {
    const scenes = [];
    const sceneRegex = /###\s*Scene\s*(\d+)[:\s]*([^\n(]*)(?:\(([^)]+)\))?([\s\S]*?)(?=(?:###\s*Scene|\n##\s|$))/gi;
    let match;
    while ((match = sceneRegex.exec(text)) !== null) {
      const sceneNum = match[1];
      const sceneTitle = (match[2] || `Scene ${sceneNum}`).trim();
      const timecode = (match[3] || '').trim();
      const body = match[4];

      const visualMatch = body.match(/(?:Visuals?\s*(?:&|and)?\s*B-Roll|Visual Shot):\s*([^\n]+(?:\n(?!(?:On-Screen|Voiceover|Audio|SFX|###|##))[^\n]+)*)/i);
      const onScreenMatch = body.match(/(?:On-Screen Text|Text Overlay):\s*"?([^"\n]+)"?/i);
      const voiceoverMatch = body.match(/(?:Voiceover Narration|Voiceover|Narration):\s*"?([^"\n]+(?:\n(?!(?:Audio|SFX|###|##))[^\n]+)*)"?/i);
      const sfxMatch = body.match(/(?:Audio\s*(?:&|and)?\s*SFX|SFX|Sound|Audio):\s*([^\n]+)/i);

      scenes.push({
        number: sceneNum,
        title: sceneTitle,
        timecode: timecode || `00:${String((sceneNum - 1) * 12).padStart(2, '0')} - 00:${String(sceneNum * 12).padStart(2, '0')}`,
        visuals: visualMatch ? visualMatch[1].trim() : 'Dynamic kinetic typography and product UI overlay.',
        onScreenText: onScreenMatch ? onScreenMatch[1].trim() : null,
        voiceover: voiceoverMatch ? voiceoverMatch[1].trim() : 'Narrative segment explaining core objective.',
        sfx: sfxMatch ? sfxMatch[1].trim() : 'Rhythmic tech ambient synth.'
      });
    }
    return scenes;
  };

  // Extract Continuous Narration Script
  const extractTeleprompterScript = (text) => {
    const scriptMatch = text.match(/(?:##\s*📝?\s*(?:Complete\s*)?(?:Teleprompter|Narration Script)[^\n]*\n)([\s\S]*?)(?:(?=\n##\s)|$)/i);
    if (scriptMatch) {
      return scriptMatch[1].replace(/```/g, '').trim();
    }
    // Fallback: concatenate scene voiceovers
    const scenes = extractScenes(text);
    if (scenes.length > 0) {
      return scenes.map(s => s.voiceover).join(' ');
    }
    return ico?.executive_overview || text;
  };

  // Extract VTT / Subtitles
  const extractVtt = (text) => {
    const subMatch = text.match(/(?:##\s*💬?\s*Subtitles[^\n]*\n)([\s\S]*?)(?:(?=\n##\s)|$)/i);
    let raw = subMatch ? subMatch[1].replace(/```(?:vtt|srt)?/gi, '').replace(/```/g, '').trim() : '';
    if (!raw || !raw.includes('-->')) {
      const timeMatch = text.match(/(\d+\s*\n\d{2}:\d{2}:\d{2}[\s\S]*)/);
      if (timeMatch) raw = timeMatch[1].trim();
    }
    if (raw && raw.includes('-->')) {
      return `WEBVTT - TransformAI Subtitles\n\n${raw.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')}`;
    }
    const scenes = extractScenes(text);
    if (scenes.length > 0) {
      const cues = scenes.map((s, idx) => {
        const start = `00:00:${String(idx * 12).padStart(2, '0')}.000`;
        const end = `00:00:${String((idx + 1) * 12).padStart(2, '0')}.000`;
        return `${idx + 1}\n${start} --> ${end}\n${s.voiceover.slice(0, 90)}`;
      });
      return `WEBVTT - TransformAI Subtitles\n\n${cues.join('\n\n')}`;
    }
    return `WEBVTT - TransformAI Subtitles\n\n1\n00:00:01.000 --> 00:00:06.000\n${(ico?.primary_objective || 'TransformAI Video Package').slice(0, 80)}`;
  };

  const scenes = extractScenes(content);
  const teleprompterScript = extractTeleprompterScript(content);
  const vttContent = extractVtt(content);
  const wordCount = teleprompterScript.split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((wordCount / prompterSpeed) * 60);

  const handleDownloadVtt = () => {
    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (ico?.event_title || 'TransformAI').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${safeTitle}_subtitles.vtt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(teleprompterScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch (e) {}
  };

  const handleCopyVtt = async () => {
    try {
      await navigator.clipboard.writeText(vttContent);
      setCopiedVtt(true);
      setTimeout(() => setCopiedVtt(false), 2000);
    } catch (e) {}
  };

  const handleTogglePrompterTts = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPlayingPrompter(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(teleprompterScript);
      const rate = Math.min(Math.max(prompterSpeed / 130, 0.7), 1.8);
      utterance.rate = rate;
      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPlayingPrompter(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPlayingPrompter(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPlayingPrompter(true);
    }
  };

  const handleSpeakSceneVoiceover = (sceneNum, text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (activeSpeakingScene === sceneNum && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingScene(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }
      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveSpeakingScene(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setActiveSpeakingScene(null);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setActiveSpeakingScene(sceneNum);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Studio Controls Bar */}
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
        {/* Sub-tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('storyboard')}
            className={`btn btn-sm btn-pill ${activeSubTab === 'storyboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <Film size={13} />
            <span>Storyboard ({scenes.length} Scenes)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('teleprompter')}
            className={`btn btn-sm btn-pill ${activeSubTab === 'teleprompter' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <Volume2 size={13} />
            <span>Teleprompter Script ({wordCount} words)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subtitles')}
            className={`btn btn-sm btn-pill ${activeSubTab === 'subtitles' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <Type size={13} />
            <span>Subtitles (.VTT)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('raw')}
            className={`btn btn-sm btn-pill ${activeSubTab === 'raw' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <FileText size={13} />
            <span>Full Document</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleDownloadVtt}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ fontSize: '11.5px', gap: '5px' }}
          >
            <Download size={13} />
            <span>Export .VTT</span>
          </button>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm btn-pill"
              style={{ fontSize: '11.5px', gap: '5px' }}
            >
              <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab 1: Visual Storyboard Cards */}
      {activeSubTab === 'storyboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {scenes.length === 0 ? (
            <div className="bento-card" style={{ padding: '30px', textAlign: 'center' }}>
              <p>No structured scenes detected. Switch to "Full Document" mode to view output.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {scenes.map((scene, idx) => (
                <div
                  key={idx}
                  className="bento-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(112, 72, 232, 0.2)'
                  }}
                >
                  {/* Top Bar: Scene Badge & Timecode */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(112, 72, 232, 0.12)',
                      color: '#7048e8',
                      padding: '3px 10px',
                      borderRadius: 'var(--clay-radius-pill)',
                      border: '1px solid rgba(112, 72, 232, 0.25)'
                    }}>
                      SCENE {scene.number} // {scene.title.toUpperCase()}
                    </span>

                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--clay-primary-muted)',
                      fontWeight: '700'
                    }}>
                      <Clock size={12} />
                      {scene.timecode}
                    </span>
                  </div>

                  {/* Visuals & B-Roll */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--clay-primary-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Film size={11} /> Visual Shot & B-Roll:
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--clay-primary-deep)', fontWeight: '600' }}>
                      {scene.visuals}
                    </div>
                  </div>

                  {/* On-Screen Text Pill (if any) */}
                  {scene.onScreenText && (
                    <div style={{
                      background: 'var(--clay-card-inset)',
                      boxShadow: 'var(--clay-shadow-inset)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.6)'
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--clay-primary-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                        📺 On-Screen Overlay:
                      </div>
                      <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--clay-primary)' }}>
                        "{scene.onScreenText}"
                      </div>
                    </div>
                  )}

                  {/* Voiceover Narration */}
                  <div style={{
                    background: activeSpeakingScene === scene.number ? '#ede9fe' : '#f8f9fa',
                    borderLeft: `3px solid ${activeSpeakingScene === scene.number ? '#5b21b6' : '#7048e8'}`,
                    padding: '10px 14px',
                    borderRadius: '0 8px 8px 0',
                    marginBottom: '12px',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#7048e8', textTransform: 'uppercase' }}>
                        🎙️ Voiceover:
                      </span>
                      <button
                        onClick={() => handleSpeakSceneVoiceover(scene.number, scene.voiceover)}
                        className="btn btn-secondary btn-sm btn-pill"
                        style={{ fontSize: '10px', padding: '2px 8px', gap: '4px' }}
                        title="Listen to scene voiceover narration"
                      >
                        {activeSpeakingScene === scene.number && isSpeaking ? <Pause size={10} color="#e03131" /> : <Volume2 size={10} color="#7048e8" />}
                        <span>{activeSpeakingScene === scene.number && isSpeaking ? 'Stop' : 'Listen (TTS)'}</span>
                      </button>
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.55', color: '#212529', fontStyle: 'italic' }}>
                      "{scene.voiceover}"
                    </div>
                  </div>

                  {/* Audio & SFX */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: 'var(--clay-primary-muted)',
                    fontFamily: 'var(--font-mono)',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    paddingTop: '8px'
                  }}>
                    <Music size={12} color="#7048e8" />
                    <span>SFX: {scene.sfx}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Teleprompter Studio */}
      {activeSubTab === 'teleprompter' && (
        <div className="bento-card" style={{ padding: '24px' }}>
          {/* Prompter Controls Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsPlayingPrompter(!isPlayingPrompter)}
                className={`btn btn-sm btn-pill ${isPlayingPrompter && !isSpeaking ? 'btn-danger' : 'btn-primary'}`}
                style={{ gap: '6px', padding: '8px 14px', fontWeight: '800' }}
              >
                {isPlayingPrompter && !isSpeaking ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlayingPrompter && !isSpeaking ? 'Pause Autoscroll' : 'Start Prompter'}</span>
              </button>

              {/* TTS Read Aloud Button */}
              <button
                onClick={handleTogglePrompterTts}
                className={`btn btn-sm btn-pill ${isSpeaking ? 'btn-danger' : 'btn-secondary'}`}
                style={{
                  gap: '6px',
                  padding: '8px 14px',
                  fontWeight: '800',
                  background: isSpeaking ? '#e03131' : 'rgba(112, 72, 232, 0.12)',
                  color: isSpeaking ? '#ffffff' : '#7048e8',
                  border: '1px solid rgba(112, 72, 232, 0.3)'
                }}
                title="Speak teleprompter script aloud with browser speech synthesis while auto-scrolling"
              >
                {isSpeaking ? <Pause size={14} /> : <Volume2 size={14} />}
                <span>{isSpeaking ? 'Stop Voiceover' : 'Read Script (TTS)'}</span>
              </button>

              <button
                onClick={handleCopyScript}
                className="btn btn-secondary btn-sm btn-pill"
                style={{ gap: '6px' }}
              >
                {copiedScript ? <Check size={13} color="var(--clay-accent-green)" /> : <Copy size={13} />}
                <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            {/* Reading Speed, Voice Picker & Font Adjusters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {voices.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--clay-primary-muted)' }}>
                    Voice:
                  </span>
                  <select
                    value={selectedVoiceIndex}
                    onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.15)',
                      background: 'var(--clay-card-inset)',
                      maxWidth: '130px',
                      cursor: 'pointer'
                    }}
                  >
                    {voices.slice(0, 15).map((v, i) => (
                      <option key={i} value={i}>
                        {v.name.replace(/Microsoft|Google/gi, '').slice(0, 20)} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--clay-primary-muted)' }}>
                  Speed: {prompterSpeed} WPM (~{estimatedSeconds}s)
                </span>
                <input
                  type="range"
                  min="90"
                  max="200"
                  step="5"
                  value={prompterSpeed}
                  onChange={(e) => setPrompterSpeed(Number(e.target.value))}
                  style={{ width: '100px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--clay-primary-muted)' }}>
                  Size: {prompterFontSize}px
                </span>
                <input
                  type="range"
                  min="18"
                  max="36"
                  step="2"
                  value={prompterFontSize}
                  onChange={(e) => setPrompterFontSize(Number(e.target.value))}
                  style={{ width: '80px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Teleprompter Scroll Screen */}
          <div
            ref={prompterRef}
            style={{
              maxHeight: '420px',
              overflowY: 'auto',
              background: '#0d1117',
              borderRadius: '16px',
              padding: '36px 42px',
              boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.6)',
              border: '2px solid #30363d',
              position: 'relative'
            }}
          >
            {/* Guide Center Marker */}
            <div style={{
              position: 'sticky',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(112, 72, 232, 0.4)',
              pointerEvents: 'none',
              zIndex: 2
            }} />

            <div style={{
              color: '#f0f6fc',
              fontSize: `${prompterFontSize}px`,
              lineHeight: '1.8',
              fontWeight: '600',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              whiteSpace: 'pre-line',
              textAlign: 'center',
              letterSpacing: '0.2px'
            }}>
              {teleprompterScript}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Subtitles (.VTT / .SRT) */}
      {activeSubTab === 'subtitles' && (
        <div className="bento-card" style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--clay-primary-deep)' }}>
                WebVTT Timed Subtitle Track
              </div>
              <div style={{ fontSize: '11px', color: 'var(--clay-primary-muted)' }}>
                Compatible with Premiere Pro, DaVinci Resolve, Final Cut Pro, and YouTube/Vimeo.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopyVtt}
                className="btn btn-secondary btn-sm btn-pill"
                style={{ gap: '6px' }}
              >
                {copiedVtt ? <Check size={13} color="var(--clay-accent-green)" /> : <Copy size={13} />}
                <span>{copiedVtt ? 'Copied VTT!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownloadVtt}
                className="btn btn-primary btn-sm btn-pill"
                style={{ gap: '6px' }}
              >
                <Download size={13} />
                <span>Download .VTT File</span>
              </button>
            </div>
          </div>

          <pre style={{
            background: 'var(--clay-primary-deep)',
            color: '#79c0ff',
            padding: '20px',
            borderRadius: 'var(--clay-radius-inner)',
            fontSize: '12.5px',
            fontFamily: 'var(--font-mono)',
            overflowX: 'auto',
            maxHeight: '360px',
            lineHeight: '1.6'
          }}>
            {vttContent}
          </pre>
        </div>
      )}

      {/* Subtab 4: Full Document Markdown View */}
      {activeSubTab === 'raw' && (
        <div className="bento-card prose">
          <MarkdownRenderer
            content={content}
            ico={ico}
            sourceText={sourceText}
            onCitationClick={onCitationClick}
            onRetry={onRegenerate}
            isRegenerating={isRegenerating}
          />
        </div>
      )}
    </div>
  );
}
