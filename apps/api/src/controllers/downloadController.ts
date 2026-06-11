import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { downloadMedia } from '../services/ytDlpService';
import { detectPlatform } from '../services/platformService';
import { extractAudio } from '../services/ffmpegService';
import { deleteFile } from '../utils/cleanup';
import { logger } from '../utils/logger';

const TEMP_DIR = process.env.TEMP_DIR || './temp';

const CONTENT_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
};

export async function downloadController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { url, type, format, formatId } = req.body as {
    url: string;
    type: 'video' | 'audio';
    format: 'mp4' | 'webm' | 'mp3' | 'wav';
    quality: string;
    formatId: string;
  };

  const tempId = uuidv4();
  const rawPath = path.join(TEMP_DIR, `${tempId}_raw`);
  const outputPath = path.join(TEMP_DIR, `${tempId}.${format}`);

  try {
    logger.debug(`Downloading: ${url} (format: ${formatId})`);

    const platform = detectPlatform(url);
    await downloadMedia(url, formatId, rawPath, platform);

    // Resolve actual path: merged formatIds output at rawPath.EXT
    function resolveRawPath(): string {
      if (fs.existsSync(rawPath)) return rawPath;
      const dir = path.dirname(rawPath);
      const base = path.basename(rawPath);
      const files = fs.readdirSync(dir);
      const match = files.find(f => f.startsWith(base + '.'));
      return match ? path.join(dir, match) : rawPath;
    }

    const actualRawPath = resolveRawPath();
    let finalPath: string;

    if (type === 'audio' && (format === 'mp3' || format === 'wav')) {
      logger.debug(`Converting audio to ${format}`);
      await extractAudio(actualRawPath, format, outputPath);
      finalPath = outputPath;
    } else {
      finalPath = actualRawPath;
    }

    const contentType = CONTENT_TYPES[format] || 'application/octet-stream';
    const filename = `download.${format}`;
    const stats = fs.statSync(finalPath);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);

    const readStream = fs.createReadStream(finalPath);
    readStream.pipe(res);

    readStream.on('error', (err) => {
      logger.error(`Stream error: ${err.message}`);
      if (!res.headersSent) {
        next(Object.assign(new Error('Error al enviar el archivo.'), { code: 'DOWNLOAD_FAILED' }));
      }
    });

    readStream.on('end', () => {
      logger.debug(`Download complete for ${tempId}`);
    });
  } catch (err) {
    next(err);
  } finally {
    res.on('close', async () => {
      await deleteFile(rawPath);
      // Also clean up merged file (rawPath.EXT)
      const dir = path.dirname(rawPath);
      const base = path.basename(rawPath);
      for (const f of fs.readdirSync(dir)) {
        if (f.startsWith(base + '.') || f.startsWith(base + '_')) {
          await deleteFile(path.join(dir, f));
        }
      }
      if (outputPath !== rawPath) {
        await deleteFile(outputPath);
      }
    });
  }
}
