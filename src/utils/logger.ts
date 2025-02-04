import winston from 'winston';
const { printf, timestamp, combine, colorize, splat } = winston.format;

const consoleFormat = printf(
  ({ level, message, timestamp: formattedTimestamp, ...meta }) => {
    const metadata =
      Object.keys(meta).length > 0
        ? ` - Metadata: ${JSON.stringify(meta)}`
        : '';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `[${level}] - (${formattedTimestamp}): ${message}${metadata}`;
  }
);

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    splat(),
    consoleFormat
  ),
  transports: [new winston.transports.Console()],
});

export const printLogger = winston.createLogger({
  level: 'info', // This sets the minimum log level (debug is the lowest)
  format: winston.format.combine(
    winston.format.timestamp(),
    // eslint-disable-next-line no-shadow
    winston.format.printf(({ timestamp, level, message }) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: 'debug.log',
    }),
  ],
});

export default logger;
