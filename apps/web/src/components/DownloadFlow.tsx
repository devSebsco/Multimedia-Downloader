import { useState, useEffect, useRef } from 'react';
import { analyzeUrl, ApiError, downloadFile, triggerDownload } from '../lib/api';
import type { MediaInfo, DownloadTarget, DownloadRequest, VideoFormat, AudioFormat } from '../types/media';
import ResultCard from './ResultCard';
import DownloadModal from './DownloadModal';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

type FlowState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; media: MediaInfo; url: string }
  | { status: 'error'; message: string };

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

const ERROR_MESSAGES: Record<string, keyof typeof translations.es> = {
  INVALID_URL:          'errorInvalidUrl',
  UNSUPPORTED_PLATFORM: 'errorUnsupported',
  PRIVATE_CONTENT:      'errorPrivate',
  GEO_RESTRICTED:       'errorGeo',
  DOWNLOAD_FAILED:      'errorDownload',
  CONVERSION_FAILED:    'errorConversion',
  RATE_LIMIT:           'errorRateLimit',
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DownloadFlow() {
  const { t } = useLanguage();
  const [flow, setFlow] = useState<FlowState>({ status: 'idle' });
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<DownloadEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  const blobMap = useRef<Map<string, Blob>>(new Map());
  const abortMap = useRef<Map<string, AbortController>>(new Map());
  const cancelledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    function check() { setMobile(window.innerWidth <= 640); }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isLoading = flow.status === 'loading';
  const activeEntry = entries.find(e => e.id === activeEntryId) ?? null;
  const activeEntries = entries.filter(e => e.status !== 'pending' && e.status !== 'cancelled');

  async function handleAnalyze() {
    const url = input.trim();
    if (!url) return;
    setFlow({ status: 'loading' });
    try {
      const media = await analyzeUrl(url);
      setFlow({ status: 'success', media, url });
    } catch (err) {
      const message = err instanceof ApiError && ERROR_MESSAGES[err.code]
        ? t[ERROR_MESSAGES[err.code]]
        : t.errorUnknown;
      setFlow({ status: 'error', message });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAnalyze();
  }

  function openModal(target: DownloadTarget, url: string) {
    const id = crypto.randomUUID();
    setEntries(prev => [...prev, {
      id,
      url,
      target,
      title: target.title ?? '',
      platform: target.platform ?? '',
      status: 'pending',
      progress: 0,
      bytes: 0,
      total: 0,
      filename: '',
    }]);
    setActiveEntryId(id);
  }

  function closeModal() {
    setEntries(prev => prev.filter(e => e.status !== 'pending'));
    setActiveEntryId(null);
  }

  function cancelDownload(entryId: string) {
    cancelledRef.current.add(entryId);
    abortMap.current.get(entryId)?.abort();
    abortMap.current.delete(entryId);
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, status: 'cancelled' } : e));
    if (activeEntryId === entryId) setActiveEntryId(null);
  }

  function removeEntry(entryId: string) {
    cancelledRef.current.delete(entryId);
    abortMap.current.get(entryId)?.abort();
    abortMap.current.delete(entryId);
    blobMap.current.delete(entryId);
    setEntries(prev => prev.filter(e => e.id !== entryId));
    if (activeEntryId === entryId) setActiveEntryId(null);
  }

  function startDownload(entryId: string, params: DownloadRequest) {
    if (cancelledRef.current.has(entryId)) return;
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    const formats = entry.target.type === 'video'
      ? (entry.target.formats as VideoFormat[])
      : (entry.target.formats as AudioFormat[]);
    const fmt = formats.find(f => f.id === params.formatId);
    let maxTotal = fmt?.filesize ?? 0;
    if (maxTotal === 0 && entry.target.duration && fmt) {
      const bm = fmt.quality.match(/(\d+)kbps/);
      if (bm) maxTotal = Math.round(parseInt(bm[1], 10) * 1000 / 8 * entry.target.duration);
    }

    const controller = new AbortController();
    abortMap.current.set(entryId, controller);

    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, status: 'fetching' } : e));
    runDownload(entryId, params, maxTotal, controller.signal);
  }

  async function runDownload(id: string, params: DownloadRequest, maxTotal: number, signal: AbortSignal) {
    const update = (partial: Partial<DownloadEntry>) => {
      setEntries(prev => prev.map(e => e.id === id ? { ...e, ...partial } : e));
    };

    if (cancelledRef.current.has(id)) return;

    try {
      const result = await downloadFile(params, signal);
      if (cancelledRef.current.has(id)) return;

      blobMap.current.set(id, result.blob);
      const realMax = maxTotal > 0 ? maxTotal : result.size;
      update({ status: 'animating', total: realMax, filename: result.filename });

      const startTime = performance.now();
      const duration = 3000;

      await new Promise<void>((resolve) => {
        const animate = (now: number) => {
          if (cancelledRef.current.has(id)) { resolve(); return; }
          const t = Math.min((now - startTime) / duration, 1);
          update({ progress: Math.round(100 * t), bytes: Math.round(realMax * t) });
          if (t < 1) requestAnimationFrame(animate);
          else resolve();
        };
        requestAnimationFrame(animate);
      });

      if (cancelledRef.current.has(id)) return;

      const blob = blobMap.current.get(id);
      if (blob) triggerDownload(blob, result.filename);

      update({ status: 'complete', progress: 100, bytes: realMax });
    } catch (err) {
      if (cancelledRef.current.has(id)) return;
      if (err instanceof Error && err.name === 'AbortError') return;
      update({ status: 'error', error: err instanceof Error ? err.message : 'Error al descargar.' });
    } finally {
      cancelledRef.current.delete(id);
      abortMap.current.delete(id);
    }
  }

  function reset() {
    setFlow({ status: 'idle' });
    setInput('');
  }

  return (
    <div style={{ width: '100%' }}>

      <div className="flow-input-row" style={{
        display: 'flex',
        border: `1.5px solid ${isLoading ? 'var(--border)' : 'var(--border-strong)'}`,
        backgroundColor: 'var(--bg-input)',
        marginBottom: '1rem',
        overflow: 'hidden',
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.2s',
      }}>
        <div className="flow-icon" style={{
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted)',
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>

        <input
          type="url"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mobile ? t.heroPlaceholderMobile : t.heroPlaceholder}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '1rem 0.5rem',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: '"Space Mono", monospace',
            fontSize: 'clamp(0.7rem, 1.4vw, 0.875rem)',
            color: 'var(--text-primary)',
            minWidth: 0,
          }}
        />

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '1rem 1.5rem',
            background: isLoading ? 'var(--border-strong)' : 'var(--bg-btn)',
            color: 'var(--text-btn)',
            border: 'none',
            fontFamily: '"Black Ops One", cursive',
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isLoading ? '4px' : '8px',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%)',
            transition: 'background 0.2s',
          }}
        >
          {isLoading ? (
            <>
              <span style={{
                width: '12px', height: '12px',
                border: '2px solid var(--text-btn)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'lf-spin 0.7s linear infinite',
                display: 'inline-block',
                flexShrink: 0,
              }}/>
              {t.analyzingBtn}
            </>
          ) : (
            <>
              {t.analyzeBtn}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes lf-spin {
          to { transform: rotate(360deg); }
        }
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
          .retry-btn { min-height: 44px; }
          .flow-icon { padding: 0 0.5rem !important; }
          .analyze-btn { padding: 0.75rem 0.75rem !important; min-height: 44px; }
        }
        @media (max-width: 360px) {
          .flow-icon { padding: 0 0.25rem !important; }
          .analyze-btn { padding: 0.5rem !important; flex-shrink: 1 !important; min-height: 40px; font-size: 0.75rem; }
          .analyze-btn svg { width: 12px; height: 12px; }
        }
      `}</style>

      <p className="hero-privacy" style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '1.5rem',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        {t.heroPrivacy}
      </p>

      {flow.status === 'error' && (
        <div style={{
          border: '1.5px solid var(--border-strong)',
          backgroundColor: 'var(--bg-card)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-primary)', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              wordBreak: 'break-word',
            }}>
              {flow.message}
            </span>
          </div>
          <button
            onClick={reset}
            className="retry-btn"
            style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              padding: '0.5rem 1rem',
              border: '1.5px solid var(--border-strong)',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {t.retryBtn}
          </button>
        </div>
      )}

      {flow.status === 'success' && (
        <ResultCard
          media={flow.media}
          url={flow.url}
          onDownload={(target) => openModal(target, flow.url)}
          onReset={reset}
        />
      )}

      {activeEntries.length > 0 && (
        <div className="lf-active-section" style={{
          border: '1.5px solid var(--border-strong)',
          marginBottom: '1rem',
        }}>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
            padding: '0.75rem 1rem',
            borderBottom: '1.5px solid var(--border-strong)',
          }}>
            {t.activeDownloads}
          </div>
          {activeEntries.map(entry => {
            const isFetching = entry.status === 'fetching';
            const isAnimating = entry.status === 'animating';
            const isComplete = entry.status === 'complete';
            const isError = entry.status === 'error';
            const canRemove = isComplete || isError;

            return (
              <div
                key={entry.id}
                onClick={() => setActiveEntryId(entry.id)}
                className="lf-entry-row"
              >
                <div className="lf-entry-top">
                  <div className="lf-entry-dot" style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: isComplete ? 'var(--text-primary)'
                      : isError ? 'var(--text-secondary)'
                      : 'var(--text-muted)',
                  }} />
                  <div className="lf-entry-info">
                    <div className="lf-entry-title">
                      {entry.title || entry.platform}
                    </div>
                    <div className="lf-entry-platform">{entry.platform}</div>
                  </div>
                  {isComplete && (
                    <span className="lf-entry-badge">✓ {t.completed}</span>
                  )}
                  {isError && <span className="lf-entry-badge">✕</span>}
                  {isFetching && (
                    <span className="lf-entry-badge">{t.downloading}</span>
                  )}
                  {isAnimating && (
                    <span className="lf-entry-badge">{entry.progress}%</span>
                  )}
                  {canRemove && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                      className="lf-entry-remove"
                    >✕</button>
                  )}
                </div>
                {(isFetching || isAnimating) && (
                  <div className="lf-entry-bar-row">
                    {isFetching && (
                      <div className="lf-entry-bar">
                        <div className="lf-shimmer" />
                      </div>
                    )}
                    {isAnimating && (
                      <>
                        <div className="lf-entry-bar">
                          <div className="lf-entry-bar-fill" style={{ width: `${entry.progress}%` }} />
                        </div>
                        <span className="lf-entry-bar-label">
                          {formatBytes(entry.bytes)} / {formatBytes(entry.total)}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeEntry && (
        <DownloadModal
          entry={activeEntry}
          onStartDownload={startDownload}
          onCancelDownload={cancelDownload}
          onClose={closeModal}
        />
      )}

      <style>{`
        .lf-entry-row {
          padding: 0.625rem 1rem;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          font-family: "Space Mono", monospace;
        }
        .lf-entry-row:last-child { border-bottom: none; }
        .lf-entry-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .lf-entry-info { flex: 1; min-width: 0; }
        .lf-entry-title {
          font-weight: 700;
          font-size: 0.75rem;
          overflow-wrap: break-word;
          color: var(--text-primary);
        }
        .lf-entry-platform {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lf-entry-badge {
          font-size: 0.65rem;
          color: var(--text-primary);
          flex-shrink: 0;
          white-space: nowrap;
        }
        .lf-entry-remove {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.25rem;
          flex-shrink: 0;
        }
        .lf-entry-bar-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .lf-entry-bar {
          flex: 1;
          height: 6px;
          background: var(--border);
          overflow: hidden;
          position: relative;
        }
        .lf-entry-bar-fill {
          height: 100%;
          background: var(--text-primary);
          transition: width 0.05s linear;
        }
        .lf-entry-bar-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          flex-shrink: 0;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .lf-entry-row { padding: 0.75rem 0.625rem; }
          .lf-entry-title { font-size: 0.7rem; }
          .lf-entry-top { gap: 0.5rem; }
          .lf-entry-badge { font-size: 0.6rem; }
          .lf-entry-remove { font-size: 0.75rem; padding: 0.5rem; }
          .lf-entry-bar-label { font-size: 0.6rem; }
        }
        @media (max-width: 360px) {
          .lf-entry-title { font-size: 0.65rem; }
        }
      `}</style>
    </div>
  );
}
