import { Router } from 'express';
import { downloadController } from '../controllers/downloadController';
import { downloadLimiter } from '../middlewares/rateLimiter';
import { validateRequest, downloadSchema } from '../middlewares/validateRequest';

export const downloadRouter = Router();

downloadRouter.post(
  '/',
  downloadLimiter,
  validateRequest(downloadSchema),
  downloadController
);
