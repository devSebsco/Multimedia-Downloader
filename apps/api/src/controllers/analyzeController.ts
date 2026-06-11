import type { Request, Response, NextFunction } from 'express';
import { getMediaInfo } from '../services/ytDlpService';
import { isSupportedPlatform, detectPlatform } from '../services/platformService';
import { logger } from '../utils/logger';

export async function analyzeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url } = req.body as { url: string };

    if (!isSupportedPlatform(url)) {
      res.status(422).json({
        success: false,
        error: {
          code: 'UNSUPPORTED_PLATFORM',
          message: `La plataforma no es compatible. URL: ${url}`,
        },
      });
      return;
    }

    logger.debug(`Analyzing URL: ${url}`);
    const platform = detectPlatform(url);
    const info = await getMediaInfo(url, platform);
    info.platform = platform;

    res.json({
      success: true,
      data: info,
    });
  } catch (err) {
    next(err);
  }
}
