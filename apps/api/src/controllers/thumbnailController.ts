import type { Request, Response, NextFunction } from 'express';
import https from 'https';
import http from 'http';
import { logger } from '../utils/logger';

function fetchWithRedirects(
  url: string,
  res: Response,
  redirects: number = 0
): void {
  if (redirects > 5) {
    logger.warn(`Thumbnail proxy: too many redirects for ${url.slice(0, 100)}`);
    if (!res.headersSent) {
      res.status(502).json({ success: false, error: { code: 'PROXY_ERROR', message: 'Demasiadas redirecciones al obtener la imagen' } });
    }
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    if (!res.headersSent) {
      res.status(400).json({ success: false, error: { code: 'INVALID_URL', message: 'URL inválida en redirección' } });
    }
    return;
  }

  const mod = parsedUrl.protocol === 'https:' ? https : http;

  mod.get(url, (upstreamRes) => {
    const status = upstreamRes.statusCode ?? 500;

    // Follow redirects
    if (status >= 300 && status < 400 && upstreamRes.headers.location) {
      const nextUrl = new URL(upstreamRes.headers.location, url).href;
      upstreamRes.resume();
      fetchWithRedirects(nextUrl, res, redirects + 1);
      return;
    }

    if (status >= 400) {
      logger.warn(`Thumbnail proxy: upstream ${status} for ${url.slice(0, 100)}`);
      if (!res.headersSent) {
        res.status(502).json({ success: false, error: { code: 'PROXY_ERROR', message: `El servidor de imágenes respondió con ${status}` } });
      }
      upstreamRes.resume();
      return;
    }

    const contentType = upstreamRes.headers['content-type'] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    upstreamRes.pipe(res);
  }).on('error', (err) => {
    logger.error(`Thumbnail proxy error: ${err.message}`);
    if (!res.headersSent) {
      res.status(502).json({ success: false, error: { code: 'PROXY_ERROR', message: 'Error al obtener la imagen' } });
    }
  });
}

export async function thumbnailController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const imageUrl = req.query.url as string | undefined;

  if (!imageUrl) {
    res.status(400).json({ success: false, error: { code: 'INVALID_URL', message: 'URL de imagen requerida' } });
    return;
  }

  try {
    new URL(imageUrl);
  } catch {
    res.status(400).json({ success: false, error: { code: 'INVALID_URL', message: 'URL inválida' } });
    return;
  }

  fetchWithRedirects(imageUrl, res);
}
