import { spawn, execFileSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { logger } from '../utils/logger';
import type { MediaInfo, VideoFormat, AudioFormat, ContentType } from '../types/media';

function getYtDlpPath(): string {
  const CANDIDATES: string[] = [
    process.env.YTDLP_PATH,
    'yt-dlp',
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp',
    path.join(__dirname, '../../bin/yt-dlp'),
    path.join(os.homedir(), '.local/bin/yt-dlp'),
  ].filter(Boolean) as string[];

  for (const candidate of CANDIDATES) {
    if (candidate === 'yt-dlp') {
      try {
        execFileSync('yt-dlp', ['--version'], { stdio: 'ignore' });
        logger.debug(`yt-dlp found in PATH`);
        return 'yt-dlp';
      } catch {
        continue;
      }
    }
    if (fs.existsSync(candidate)) {
      logger.debug(`yt-dlp found at ${candidate}`);
      return candidate;
    }
  }

  logger.error('yt-dlp not found. Checked: ' + CANDIDATES.join(', '));
  throw new Error('yt-dlp not found. Run scripts/install.sh');
}

type YtDlpFormat = {
  format_id: string;
  ext: string;
  resolution: number | null;
  width: number | null;
  height: number | null;
  filesize: number | null;
  vcodec: string;
  acodec: string;
  tbr: number | null;
};

type YtDlpDump = {
  title: string;
  thumbnail: string | null;
  duration: number | null;
  formats: YtDlpFormat[];
  ext: string;
};

function buildPlatformArgs(platform: string, extra: string[] = []): string[] {
  const base = [
    ...extra,
    '--no-playlist',
    '--extractor-retries', '3',
  ];

  if (platform === 'youtube') {
    // Don't override player_client — let yt-dlp use its defaults (android_vr, ios_downgraded, etc.)
    // Just skip webpage extraction to avoid bot detection on datacenter IPs
    base.push('--extractor-args', 'youtube:player_skip=webpage');

    const cookiesPath = process.env.YOUTUBE_COOKIES_PATH;
    if (cookiesPath) {
      if (fs.existsSync(cookiesPath)) {
        base.push('--cookies', cookiesPath);
      } else {
        logger.warn(`YOUTUBE_COOKIES_PATH set but file not found at ${cookiesPath}`);
      }
    }
  } else if (platform === 'instagram') {
    const proxyUrl = process.env.INSTAGRAM_PROXY_URL;
    if (proxyUrl) {
      base.push('--proxy', proxyUrl);
    }

    const cookiesPath = process.env.INSTAGRAM_COOKIES_PATH;
    if (cookiesPath) {
      if (fs.existsSync(cookiesPath)) {
        base.push('--cookies', cookiesPath);
      } else {
        logger.warn(`INSTAGRAM_COOKIES_PATH set but file not found at ${cookiesPath}`);
      }
    }

    if (!proxyUrl && !cookiesPath) {
      throw Object.assign(
        new Error('Instagram requiere configuración de proxy o cookies en producción'),
        { code: 'PROXY_REQUIRED' }
      );
    }
  }

  return base;
}

export function getMediaInfo(url: string, platform: string): Promise<MediaInfo> {
  return new Promise((resolve, reject) => {
    const ytDlpPath = getYtDlpPath();
    const args = [...buildPlatformArgs(platform), '--dump-json', url];

    logger.debug(`Spawning: ${ytDlpPath} ${args.join(' ')}`);

    const proc = spawn(ytDlpPath, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(Object.assign(new Error('yt-dlp no encontrado. Ejecuta scripts/install.sh'), { code: 'YTDLP_NOT_INSTALLED' }));
      } else {
        reject(Object.assign(new Error(`yt-dlp spawn failed: ${err.message}`), { code: 'DOWNLOAD_FAILED' }));
      }
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        const lower = stderr.toLowerCase();
        const snippet = stderr.slice(0, 600);
        logger.error(`yt-dlp exit code ${code}. stderr snippet: ${snippet}`);
        if (lower.includes('private video') || lower.includes('login required') || lower.includes('sign in') || lower.includes('confirm your age') || lower.includes('bot')) {
          reject(Object.assign(new Error('Este contenido es privado o requiere inicio de sesión.'), { code: 'PRIVATE_CONTENT' }));
        } else if (lower.includes('not available') || lower.includes('geo') || lower.includes('blocked') || lower.includes('country')) {
          reject(Object.assign(new Error('Este contenido no está disponible en tu región.'), { code: 'GEO_RESTRICTED' }));
        } else if (lower.includes('connection refused') || lower.includes('could not connect') || lower.includes('max retries') || lower.includes('connectionerror') || lower.includes('reset peer') || lower.includes('connection reset')) {
          reject(Object.assign(new Error('Error de conexión. Verifica la configuración de proxy o cookies.'), { code: 'PROXY_ERROR' }));
        } else {
          reject(Object.assign(new Error('Error al descargar la información del video.'), { code: 'DOWNLOAD_FAILED' }));
        }
        return;
      }

      try {
        const lines = stdout.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const data: YtDlpDump = JSON.parse(lastLine);

        const contentType: ContentType = data.formats.every((f: YtDlpFormat) => f.vcodec === 'none') ? 'audio' : 'video';

        const combinedFormats: YtDlpFormat[] = data.formats.filter((f: YtDlpFormat) =>
          !['none', undefined, null].includes(f.vcodec) &&
          f.vcodec !== '' &&
          !['none', undefined, null].includes(f.acodec) &&
          f.acodec !== '' &&
          ['mp4', 'webm'].includes(f.ext) &&
          (f.height != null && f.height > 0)
        );

        const videoFormats: VideoFormat[] = (contentType === 'audio' ? [] : data.formats)
          .filter((f: YtDlpFormat) => {
            if (contentType === 'audio') return false;
            return !['none', undefined, null].includes(f.vcodec) &&
                   f.vcodec !== '' &&
                   ['mp4', 'webm'].includes(f.ext) &&
                   (f.height != null && f.height > 0);
          })
          .map((f: YtDlpFormat) => ({
            id: f.format_id,
            quality: f.height ? `${f.height}p` : `${f.tbr ? Math.round(f.tbr) : 0}k`,
            ext: f.ext as 'mp4' | 'webm',
            filesize: f.filesize,
          }))
          .sort((a: VideoFormat, b: VideoFormat) => {
            const aNum = parseInt(a.quality);
            const bNum = parseInt(b.quality);
            return bNum - aNum;
          });

        const pureAudioFormats = data.formats
          .filter((f: YtDlpFormat) => {
            const isAudioOnly = f.vcodec === 'none' || f.vcodec === '' || f.vcodec == null;
            const hasAudio = f.acodec !== 'none' && f.acodec !== '' && f.acodec != null;
            return isAudioOnly && hasAudio;
          });

        const audioFormats: AudioFormat[] = (pureAudioFormats.length > 0 ? pureAudioFormats : combinedFormats)
          .map((f: YtDlpFormat) => ({
            id: f.format_id,
            quality: f.tbr ? `${Math.round(f.tbr)}kbps` : 'unknown',
            ext: f.ext as 'm4a' | 'mp3' | 'wav',
          }))
          .sort((a: AudioFormat, b: AudioFormat) => {
            const aNum = parseInt(a.quality);
            const bNum = parseInt(b.quality);
            return bNum - aNum;
          });

        resolve({
          title: data.title,
          thumbnail: data.thumbnail || null,
          duration: data.duration || null,
          platform: 'youtube',
          contentType,
          formats: {
            video: videoFormats,
            audio: audioFormats,
          },
        });
      } catch (parseErr) {
        logger.error('Failed to parse yt-dlp output:', parseErr);
        reject(Object.assign(new Error('Error al procesar la respuesta de yt-dlp.'), { code: 'DOWNLOAD_FAILED' }));
      }
    });
  });
}

export function downloadMedia(url: string, formatId: string, outputPath: string, platform: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ytDlpPath = getYtDlpPath();
    const isMerged = formatId.includes('+');
    const args = isMerged
      ? [...buildPlatformArgs(platform), '-f', formatId, '-o', `${outputPath}.%(ext)s`, '--merge-output-format', 'mp4', url]
      : [...buildPlatformArgs(platform), '-f', formatId, '-o', outputPath, url];

    logger.debug(`Spawning: ${ytDlpPath} ${args.join(' ')}`);

    const proc = spawn(ytDlpPath, args);
    let stderr = '';

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(Object.assign(new Error('yt-dlp no encontrado.'), { code: 'YTDLP_NOT_INSTALLED' }));
      } else {
        reject(Object.assign(new Error(`Error al descargar: ${err.message}`), { code: 'DOWNLOAD_FAILED' }));
      }
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        logger.error(`downloadMedia exit code ${code}. stderr: ${stderr.slice(0, 600)}`);
        reject(Object.assign(new Error('Error al descargar el archivo multimedia.'), { code: 'DOWNLOAD_FAILED' }));
      } else {
        resolve();
      }
    });
  });
}
