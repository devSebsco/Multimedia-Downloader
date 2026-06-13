import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const ERROR_STATUS: Record<string, number> = {
  INVALID_URL: 400,
  UNSUPPORTED_PLATFORM: 422,
  PRIVATE_CONTENT: 403,
  GEO_RESTRICTED: 451,
  CONTENT_NOT_FOUND: 404,
  DOWNLOAD_FAILED: 502,
  CONVERSION_FAILED: 502,
  PROXY_ERROR: 502,
  YTDLP_NOT_INSTALLED: 500,
  RATE_LIMIT: 429,
};

export function errorHandler(
  err: Error & { code?: string; status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const code = err.code || 'INTERNAL_ERROR';
  const status = err.status || ERROR_STATUS[code] || 500;
  const message = err.message || 'Error interno del servidor';

  if (status >= 500) {
    logger.error(`[${code}] ${message}`);
  } else {
    logger.warn(`[${code}] ${message}`);
  }

  const responseBody = {
    success: false,
    error: {
      code,
      message,
    },
  };

  res.status(status).json(responseBody);
}
