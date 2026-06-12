import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { analyzeRouter } from './routes/analyze';
import { downloadRouter } from './routes/download';
import { thumbnailRouter } from './routes/thumbnail';
import { errorHandler } from './middlewares/errorHandler';
import { purgeOldTempFiles } from './utils/cleanup';
import { logger } from './utils/logger';

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  logger.warn('.env file not found — using process.env only (expected on Render/Vercel)');
}

const app = express();
const PORT = process.env.PORT || 3001;
const TEMP_DIR = process.env.TEMP_DIR || './temp';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4321';

if (!process.env.FRONTEND_URL) {
  logger.warn('FRONTEND_URL not set, defaulting to http://localhost:4321');
  logger.warn('Set FRONTEND_URL in your hosting dashboard to your frontend domain');
}

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const corsOrigins = FRONTEND_URL.split(',').map(s => s.trim());
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: '10kb' }));

app.use('/analyze', analyzeRouter);
app.use('/download', downloadRouter);
app.use('/thumbnail', thumbnailRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', frontend_url: FRONTEND_URL }));

app.use(errorHandler);

setInterval(() => {
  purgeOldTempFiles(TEMP_DIR).catch(err => logger.error('Temp cleanup error:', err));
}, 30 * 60 * 1000);

app.listen(PORT, () => {
  logger.info(`API running on http://localhost:${PORT}`);
});
