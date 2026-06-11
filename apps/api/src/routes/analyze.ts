import { Router } from 'express';
import { analyzeController } from '../controllers/analyzeController';
import { analyzeLimiter } from '../middlewares/rateLimiter';
import { validateRequest, analyzeSchema } from '../middlewares/validateRequest';

export const analyzeRouter = Router();

analyzeRouter.post(
  '/',
  analyzeLimiter,
  validateRequest(analyzeSchema),
  analyzeController
);
