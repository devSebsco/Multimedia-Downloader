import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger';

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore — file may not exist
  }
}

export async function purgeOldTempFiles(tempDir: string): Promise<void> {
  const files = await fs.readdir(tempDir).catch(() => []);
  const now = Date.now();
  for (const file of files) {
    const filePath = path.join(tempDir, file);
    const stat = await fs.stat(filePath).catch(() => null);
    if (stat && now - stat.mtimeMs > 3_600_000) {
      await deleteFile(filePath);
      logger.info(`Purged old temp file: ${file}`);
    }
  }
}
