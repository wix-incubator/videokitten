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
  /**
   * Delay configuration for recording processes.
   * - Single number: startup delay in milliseconds (waits after starting before considering ready)
   * - Tuple [startupDelay, stopDelay]: startup and stop delays in milliseconds
   *
   * Startup delay allows processes like scrcpy to initialize and buffer frames.
   * Stop delay ensures all buffered data is written before stopping.
   *
   * @default 200 for Android, 0 for iOS
   */
  delay?: number | [number, number];
}
