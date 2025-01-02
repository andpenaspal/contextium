export function assertIsError(
  error: unknown,
  msg?: string
): asserts error is Error {
  if (!(error instanceof Error)) {
    console.log(`Unknown Error Occurred ${msg}`);
    throw error;
  }
}
