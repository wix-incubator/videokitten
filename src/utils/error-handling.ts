import type { OnErrorHandler } from '../options';

/**
 * Handles errors based on the provided error handler strategy
 * @param handler - The error handling strategy ('throw', 'ignore', or a function)
 * @param error - The error to handle
 * @param result - The result to return when not throwing
 * @returns The result if not throwing, otherwise throws the error
 */
export function doHandleError<R>(handler: OnErrorHandler | undefined, error: Error, result: R): R {
  if (handler) {
    if (handler === 'throw') {
      throw error;
    } else if (handler === 'ignore') {
      return result; // Return result even though operation might have failed
    } else {
      handler(error);
      return result;
    }
  }

  throw error;
}
