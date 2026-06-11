import rateLimit from 'express-rate-limit';

export const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Demasiadas solicitudes. Espera un minuto.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const downloadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Demasiadas descargas. Espera un minuto.' } },
  standardHeaders: true,
  legacyHeaders: false,
});
