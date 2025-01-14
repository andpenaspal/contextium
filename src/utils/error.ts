import logger from 'src/utils/logger';

export function assertIsError(
  error: unknown,
  msg?: string
): asserts error is Error {
  if (!(error instanceof Error)) {
    logger.error(`Unknown Error Occurred ${msg}`);
    throw error;
  }
}
