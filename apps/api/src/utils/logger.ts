const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = typeof LOG_LEVELS[number];

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function timestamp(): string {
  return new Date().toISOString();
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(currentLevel);
}

export const logger = {
  debug(...args: unknown[]): void {
    if (shouldLog('debug')) console.debug(`[${timestamp()}] [DEBUG]`, ...args);
  },
  info(...args: unknown[]): void {
    if (shouldLog('info')) console.info(`[${timestamp()}] [INFO]`, ...args);
  },
  warn(...args: unknown[]): void {
    if (shouldLog('warn')) console.warn(`[${timestamp()}] [WARN]`, ...args);
  },
  error(...args: unknown[]): void {
    if (shouldLog('error')) console.error(`[${timestamp()}] [ERROR]`, ...args);
  },
};
