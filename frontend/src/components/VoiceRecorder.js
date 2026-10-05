'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceRecorder({ onTranscriptUpdate, currentText = '' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false); // ref mirror for use inside callbacks
  const finalizedRef = useRef('');      // accumulates confirmed final sentences

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onresult = (event) => {
      let newFinals = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinals += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (newFinals) {
        finalizedRef.current = (finalizedRef.current + newFinals).trimStart();
      }

      setInterimText(interim);

      // Stream live: finalized sentences + current interim word(s)
      const live = (finalizedRef.current + interim).trim();
      onTranscriptUpdate(live);
    };

    recog.onerror = (e) => {
      // no-speech and network are non-fatal — onend will auto-restart
      if (e.error === 'not-allowed' || e.error === 'audio-capture') {
        isRecordingRef.current = false;
        setIsRecording(false);
        setErrorMessage(
          e.error === 'not-allowed'
            ? 'Microphone permission denied. Please allow microphone access.'
            : 'No microphone found. Please connect a microphone and try again.'
        );
      }
    };

    recog.onend = () => {
      setInterimText('');
      // Auto-restart if we're still supposed to be recording
      if (isRecordingRef.current) {
        try { recog.start(); } catch (_) {}
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recog;
  }, [onTranscriptUpdate]);

  const toggleRecording = async () => {
    setErrorMessage('');
    const recog = recognitionRef.current;

    if (!recog) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type directly into the transcript box.');
      return;
    }

    if (isRecordingRef.current) {
      // Stop: set ref first so onend doesn't restart
      isRecordingRef.current = false;
      setIsRecording(false);
      setInterimText('');
      recog.stop();
    } else {
      // Force native microphone permission prompt for Android/Capacitor WebViews
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop stream immediately since we only needed it to trigger the OS permission prompt
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error('Microphone access denied:', err);
        setErrorMessage('Microphone permission denied. Please allow microphone access in your settings.');
        return;
      }

      // Reset finalized buffer to whatever is already in the textarea
      finalizedRef.current = currentText ? currentText.trimEnd() + ' ' : '';
      isRecordingRef.current = true;
      setIsRecording(true);
      try {
        recog.start();
      } catch (err) {
        isRecordingRef.current = false;
        setIsRecording(false);
        setErrorMessage('Could not start microphone. Please check permissions.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        background: 'rgb(233, 236, 239)',
        border: isRecording ? '1.5px solid var(--clay-primary)' : 'var(--clay-border)',
        borderRadius: 'var(--clay-radius-card)',
        boxShadow: isRecording ? 'var(--clay-shadow-card-hover)' : 'var(--clay-shadow-card)',
        padding: '30px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {isRecording ? (
          <div style={{
            background: 'var(--clay-card-inset)',
            boxShadow: 'var(--clay-shadow-inset)',
            padding: '12px 28px',
            borderRadius: 'var(--clay-radius-card-sm)'
          }}>
            <div className="audio-waves">
              {[...Array(8)].map((_, i) => <div key={i} className="audio-bar" />)}
            </div>
          </div>
        ) : (
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--clay-card-inset)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '8px 12px 24px rgba(73, 80, 87, 0.12), inset 3px 3px 6px rgba(255, 255, 255, 0.9), inset -3px -3px 6px rgba(73, 80, 87, 0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--clay-primary-dark)'
          }}>
            <Mic size={28} />
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--clay-primary-deep)', letterSpacing: '-0.3px' }}>
            {isRecording ? 'Listening (Microphone Active)...' : 'Tap to Record Voice Memo'}
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--clay-primary-muted)', marginTop: '4px', fontWeight: '500' }}>
            100% on-device speech-to-text. Zero audio leaves your phone.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleRecording}
          className={`btn ${isRecording ? 'btn-secondary' : 'btn-primary'} btn-sm btn-pill`}
          style={{
            background: isRecording ? 'var(--clay-accent-coral-bg)' : undefined,
            color: isRecording ? 'var(--clay-accent-coral)' : undefined,
            borderColor: isRecording ? 'rgba(201, 42, 42, 0.2)' : undefined,
            boxShadow: isRecording ? 'var(--clay-shadow-btn-secondary)' : undefined
          }}
        >
          {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
          <span>{isRecording ? 'Stop Recording' : 'Start Microphone'}</span>
        </button>

        {errorMessage && (
          <div style={{
            fontSize: '12px', color: '#c92a2a', background: '#ffe3e3',
            border: '1px solid #ffa8a8', padding: '6px 14px',
            borderRadius: 'var(--clay-radius-pill)', fontWeight: '600'
          }}>
            {errorMessage}
          </div>
        )}

        {interimText && (
          <div style={{
            fontSize: '12px', fontStyle: 'italic', color: 'var(--clay-primary)',
            background: 'var(--clay-card-inset)', boxShadow: 'var(--clay-shadow-inset)',
            border: '1px solid rgba(255, 255, 255, 0.6)', padding: '8px 16px',
            borderRadius: 'var(--clay-radius-pill)', marginTop: '4px'
          }}>
            "{interimText}"
          </div>
        )}
      </div>
    </div>
  );
}
