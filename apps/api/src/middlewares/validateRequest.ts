import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const analyzeSchema = z.object({
  url: z.string().url('URL inválida').min(1),
});

export const downloadSchema = z.object({
  url: z.string().url('URL inválida'),
  type: z.enum(['video', 'audio']),
  format: z.enum(['mp4', 'webm', 'mp3', 'wav']),
  quality: z.string().min(1),
  formatId: z.string().min(1),
});

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Datos de solicitud inválidos.',
          details: fieldErrors,
        },
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
