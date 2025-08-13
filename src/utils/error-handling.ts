import type { OnErrorHandler } from '../options';

/**
 * Handles errors based on the provided error handler strategy
 * @param handler - The error handling strategy ('throw', 'ignore', or a function)
 * @param error - The error to handle
 * @param result - The result to return when not throwing
 * @returns The result if not throwing, otherwise throws the error
 */
export function doHandleError(handler: OnErrorHandler | undefined, error: Error): void {
  if (!handler || handler === 'throw') {
    throw error;
  }

  if (handler === 'ignore') {
    return;
  }

  handler(error);
}
