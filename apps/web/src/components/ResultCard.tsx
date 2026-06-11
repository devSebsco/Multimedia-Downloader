import type { MediaInfo, DownloadTarget, VideoFormat, AudioFormat } from '../types/media';
import { useLanguage } from '../hooks/useLanguage';

type Props = {
  media: MediaInfo;
  url: string;
  onDownload: (target: DownloadTarget) => void;
  onReset: () => void;
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ResultCard({ media, onDownload, onReset }: Props) {
  const { t } = useLanguage();
  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    border: '1.5px solid var(--border-strong)',
    padding: '0.25rem 0.6rem',
    fontFamily: '"Space Mono", monospace',
    fontSize: '0.6rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    background: 'transparent',
  };

  const btnStyle: React.CSSProperties = {
    padding: '0.75rem 1.25rem',
    background: 'var(--bg-btn)',
    color: 'var(--text-btn)',
    border: 'none',
    fontFamily: '"Black Ops One", cursive',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%)',
    transition: 'background 0.2s',
  };

  return (
    <div style={{
      border: '1.5px solid var(--border-strong)',
      backgroundColor: 'var(--bg-card)',
      marginBottom: '1rem',
    }}>
      <div className="result-body" style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
      }}>
        <div className="result-thumb">
          {media.thumbnail ? (
            <img
              src={media.thumbnail}
              alt=""
              loading="lazy"
              style={{
                width: '120px',
                height: '80px',
                objectFit: 'cover',
                flexShrink: 0,
                borderRight: '1.5px solid var(--border-strong)',
              }}
            />
          ) : (
            <div style={{
              width: '120px',
              height: '80px',
              flexShrink: 0,
              borderRight: '1.5px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              background: 'var(--bg-input)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.35rem',
            lineHeight: 1.3,
            wordBreak: 'break-word',
          }}>
            {media.title}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '0.75rem',
          }}>
            <span style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              {media.platform}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>•</span>
            <span style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
            }}>
              {formatDuration(media.duration)}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>•</span>
            <span style={badgeStyle}>{media.contentType === 'video' ? t.badgeVideo : t.badgeAudio}</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        padding: '0 1rem 1rem 1rem',
      }}>
        {media.contentType === 'video' && (
          <button
            style={btnStyle}
            onClick={() => onDownload({ type: 'video', formats: media.formats.video as VideoFormat[], duration: media.duration, title: media.title, platform: media.platform })}
          >
            {t.downloadVideoBtn}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="5,12 12,19 19,12"/>
            </svg>
          </button>
        )}

        {media.contentType === 'video' && (
          <button
            style={btnStyle}
            onClick={() => onDownload({
              type: 'audio',
              formats: media.formats.audio.length > 0
                ? (media.formats.audio as AudioFormat[])
                : (media.formats.video as VideoFormat[]),
              duration: media.duration,
              title: media.title,
              platform: media.platform,
            })}
          >
            {t.downloadAudioOnlyBtn}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </button>
        )}

        {media.contentType === 'audio' && (
          <button
            style={btnStyle}
            onClick={() => onDownload({ type: 'audio', formats: media.formats.audio as AudioFormat[], duration: media.duration, title: media.title, platform: media.platform })}
          >
            {t.downloadAudioBtn}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="5,12 12,19 19,12"/>
            </svg>
          </button>
        )}
      </div>

      <div style={{
        padding: '0 1rem 0.75rem 1rem',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={onReset}
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          {t.newSearchBtn}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .result-body { flex-direction: column !important; }
          .result-thumb img,
          .result-thumb div {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 3 / 2 !important;
            border-right: none !important;
            border-bottom: 1.5px solid var(--border-strong) !important;
          }
          .result-thumb div svg { width: 32px; height: 32px; }
          .result-body + div button { min-height: 44px; }
        }
      `}</style>
    </div>
  );
}
