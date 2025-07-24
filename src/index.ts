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

// Main error class - users can catch this to handle any videokitten error
export { VideokittenError } from './errors';
