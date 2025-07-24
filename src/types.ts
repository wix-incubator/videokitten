import type { VideokittenOptionsBase, VideokittenOptionsIOS, VideokittenOptionsAndroid } from './options';

/** Main Videokitten interface for video recording operations */
export interface Videokitten<Options extends VideokittenOptionsBase = VideokittenOptions> {
  /** Record video from device screen */
  record(options?: Partial<Options>): Promise<string | undefined>;
}

export type { OnErrorHandler, VideokittenOptionsIOS, VideokittenOptionsAndroid } from './options';


/** Union type for all platform-specific options */
export type VideokittenOptions =
  | VideokittenOptionsIOS
  | VideokittenOptionsAndroid;
