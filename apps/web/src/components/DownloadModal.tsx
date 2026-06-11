import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DownloadTarget, VideoFormat, AudioFormat, DownloadRequest } from '../types/media';
import { useLanguage } from '../hooks/useLanguage';

type DownloadEntry = {
  id: string;
  url: string;
  target: DownloadTarget;
  title: string;
  platform: string;
  status: 'pending' | 'fetching' | 'animating' | 'complete' | 'error' | 'cancelled';
  progress: number;
  bytes: number;
  total: number;
  filename: string;
  error?: string;
};

type Props = {
  entry: DownloadEntry;
  onStartDownload: (entryId: string, params: DownloadRequest) => void;
  onCancelDownload: (entryId: string) => void;
  onClose: () => void;
};

const VIDEO_EXTS = ['mp4', 'webm'] as const;
const AUDIO_EXTS = ['mp3', 'wav'] as const;

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DownloadModal({ entry, onStartDownload, onCancelDownload, onClose }: Props) {
  const { t } = useLanguage();
  const target = entry.target;

  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedFormatId, setSelectedFormatId] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');

  const formatOptions = target.type === 'video' ? VIDEO_EXTS : AUDIO_EXTS;

  const qualityOptions = useMemo(() => {
    if (target.type === 'audio') {
      return target.formats as AudioFormat[];
    }
    const filtered = (target.formats as VideoFormat[]).filter(
      f => f.ext === selectedFormat
    );
    return filtered;
  }, [target.formats, selectedFormat, target.type]);

  useEffect(() => {
    const firstExt = formatOptions[0];
    setSelectedFormat(firstExt);
    setSelectedFormatId('');
    setSelectedQuality('');
  }, [target.type]);

  useEffect(() => {
    const filtered = qualityOptions;
    if (filtered.length > 0) {
      setSelectedFormatId(filtered[0].id);
      setSelectedQuality(filtered[0].quality);
    } else {
      setSelectedFormatId('');
      setSelectedQuality('');
    }
  }, [selectedFormat, qualityOptions]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (entry.status === 'complete') {
      const timer = setTimeout(() => onClose(), 1500);
      return () => clearTimeout(timer);
    }
  }, [entry.status]);

  function handleDownload() {
    if (!selectedFormat || !selectedFormatId || !selectedQuality) return;

    const formatId = target.type === 'video'
      ? `${selectedFormatId}+bestaudio[ext=m4a]/bestvideo[ext=${selectedFormat}]+bestaudio/best[ext=${selectedFormat}]/best`
      : selectedFormatId;

    onStartDownload(entry.id, {
      url: entry.url,
      type: target.type,
      format: selectedFormat as 'mp4' | 'webm' | 'mp3' | 'wav',
      quality: selectedQuality,
      formatId,
    });
  }

  const label = target.type === 'video' ? t.modalTitleVideo : t.modalTitleAudio;

  const toggleBase: React.CSSProperties = {
    padding: '0.5rem 1rem',
    border: '1.5px solid var(--border)',
    background: 'transparent',
    fontFamily: '"Space Mono", monospace',
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  };

  const toggleActive: React.CSSProperties = {
    ...toggleBase,
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    borderColor: 'var(--text-primary)',
  };

  const panelStyle: React.CSSProperties = {
    background: 'var(--bg-secondary)',
    border: '1.5px solid var(--border-strong)',
    padding: '2rem',
    width: 'min(480px, 92vw)',
    maxHeight: 'calc(100vh - 104px)',
    overflowY: 'auto',
  };

  const isPending = entry.status === 'pending';
  const isFetching = entry.status === 'fetching';
  const isAnimating = entry.status === 'animating';
  const isComplete = entry.status === 'complete';
  const isError = entry.status === 'error';

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--overlay-bg)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          overflowY: 'auto',
          paddingTop: '80px',
          paddingBottom: '24px',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
        className="lf-modal-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="lf-modal-panel"
          style={panelStyle}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}>
              {label}
            </h2>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="lf-modal-close"
              style={{
                background: 'transparent',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Space Mono", monospace',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>

          {entry.title && (
            <p style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
              wordBreak: 'break-word',
              lineHeight: 1.4,
            }}>
              {entry.title}
            </p>
          )}

          {isPending && (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}>
                  {t.formatLabel}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {formatOptions.map((ext) => (
                    <button
                      key={ext}
                      onClick={() => setSelectedFormat(ext)}
                      style={selectedFormat === ext ? toggleActive : toggleBase}
                      className="lf-modal-btn"
                    >
                      {ext.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}>
                  {t.qualityLabel}
                </div>
                <div className="lf-quality-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {qualityOptions.map((fmt) => {
                    const fs = fmt.filesize;
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => {
                          setSelectedFormatId(fmt.id);
                          setSelectedQuality(fmt.quality);
                        }}
                        style={selectedFormatId === fmt.id ? toggleActive : toggleBase}
                        className="lf-modal-btn"
                      >
                        {fmt.quality}
                        {fs != null
                          ? ` (${(fs / 1024 / 1024).toFixed(1)} MB)`
                          : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={!selectedFormatId}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'var(--bg-btn)',
                  color: 'var(--text-btn)',
                  border: 'none',
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '1rem',
                  letterSpacing: '0.08em',
                  cursor: !selectedFormatId ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {t.confirmDownloadBtn}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="5,12 12,19 19,12"/>
                </svg>
              </button>
            </>
          )}

          {isFetching && (
            <div style={{ width: '100%' }}>
              <div style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textAlign: 'right',
                marginBottom: '0.5rem',
              }}>
                {t.downloading}
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--border)',
                border: '1px solid var(--border-strong)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div className="lf-shimmer" />
              </div>
              <button
                onClick={() => onCancelDownload(entry.id)}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.625rem',
                  background: 'transparent',
                  border: '1.5px solid var(--border)',
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                }}
              >
                {t.cancelDownload}
              </button>
            </div>
          )}

          {isAnimating && (
            <div style={{ width: '100%' }}>
              <div style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textAlign: 'right',
                marginBottom: '0.5rem',
              }}>
                {entry.progress}%
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--border)',
                border: '1px solid var(--border-strong)',
              }}>
                <div style={{
                  height: '100%',
                  background: 'var(--text-primary)',
                  width: `${entry.progress}%`,
                  transition: 'width 0.05s linear',
                }} />
              </div>
              <div style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: '0.25rem',
              }}>
                {formatBytes(entry.bytes)} / {formatBytes(entry.total)}
              </div>
              <button
                onClick={() => onCancelDownload(entry.id)}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.625rem',
                  background: 'transparent',
                  border: '1.5px solid var(--border)',
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                }}
              >
                {t.cancelDownload}
              </button>
            </div>
          )}

          {isComplete && (
            <button
              disabled
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'var(--border-strong)',
                color: 'var(--text-btn)',
                border: 'none',
                fontFamily: '"Black Ops One", cursive',
                fontSize: '1rem',
                letterSpacing: '0.08em',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ✓ {t.completed}
            </button>
          )}

          {isError && (
            <div>
              <p style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                {entry.error ?? 'Error al descargar.'}
              </p>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'var(--bg-btn)',
                  color: 'var(--text-btn)',
                  border: 'none',
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '1rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                {t.retryBtn}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes lf-shimmer-move {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        .lf-shimmer {
          width: 40%;
          height: 100%;
          background: var(--text-primary);
          position: absolute;
          top: 0;
          left: -40%;
          animation: lf-shimmer-move 1.5s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .lf-modal-panel {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 1.25rem !important;
          }
          .lf-modal-overlay {
            align-items: flex-end !important;
            padding-top: 0 !important;
          }
          .lf-modal-panel {
            max-height: 85vh !important;
          }
          .lf-modal-close {
            width: 44px !important;
            height: 44px !important;
          }
          .lf-quality-grid {
            flex-direction: column !important;
          }
          .lf-quality-grid button {
            width: 100% !important;
          }
          .lf-modal-btn { min-height: 44px; }
          .lf-modal-panel h2 { font-size: 1rem !important; }
        }
      `}</style>
    </AnimatePresence>
  );
}
