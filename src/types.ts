import type { RecordingSession } from './session';
import type {
  VideokittenOptionsBase,
  VideokittenOptionsIOS,
  VideokittenOptionsAndroid,
} from './options';

export { RecordingSession } from './session';

/** Main Videokitten interface for video recording operations */
export interface Videokitten<Options extends VideokittenOptionsBase = VideokittenOptions> {
  /** Start recording and return a session controller */
  startRecording(options?: Partial<Options>): Promise<RecordingSession | undefined>;
}

/** Union type for all platform-specific options */
export type VideokittenOptions =
  | VideokittenOptionsIOS
  | VideokittenOptionsAndroid;
