import { Router } from 'express';
import { thumbnailController } from '../controllers/thumbnailController';

export const thumbnailRouter = Router();

thumbnailRouter.get('/', thumbnailController);
