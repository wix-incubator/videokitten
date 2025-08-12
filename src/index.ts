import type { VideokittenOptions } from './types';
import { VideokittenIOS } from './ios';
import { VideokittenAndroid } from './android';

/**
 * Create a Videokitten instance based on the provided options.
 */
export function videokitten(options: VideokittenOptions) {
  switch (options.platform) {
    case 'ios': {
      return new VideokittenIOS(options);
    }
    case 'android': {
      return new VideokittenAndroid(options);
    }
    default: {
      throw new Error(`Unsupported platform: ${(options as any).platform}`);
    }
  }
}

// Core types that users need
export type { Videokitten, VideokittenOptions } from './types';
export type {
  VideokittenOptionsIOS,
  VideokittenOptionsAndroid,
  OnErrorHandler
} from './options';

// Public error classes - users can catch these to handle specifically videokitten errors
export { VideokittenError, VideokittenOperationAbortedError } from './errors';
