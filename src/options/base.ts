/** Error handling strategy for video recording operations */
export type OnErrorHandler = ((error: Error) => void) | 'throw' | 'ignore';

/** Base options for all video recording platforms */
export interface VideokittenOptionsBase {
  /** Device identifier (serial number for Android, UDID for iOS) */
  deviceId?: string;
  /** Output file path for the recorded video */
  outputPath?: string;
  /** AbortSignal to cancel recording operation */
  abortSignal?: any;
  /** Error handling strategy */
  onError?: OnErrorHandler;
  /** Recording timeout in seconds */
  timeout?: number;
}
