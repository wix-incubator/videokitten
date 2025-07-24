import type { VideokittenOptionsBase } from './base';

/** iOS video recording configuration using xcrun simctl io recordVideo */
export interface VideokittenOptionsIOS extends VideokittenOptionsBase {
  /** Platform identifier */
  platform: 'ios';
  /** Path to xcrun executable */
  xcrunPath?: string;

  /**
   * Specifies the codec type for recording.
   * Maps to --codec
   * @default "hevc"
   */
  codec?: 'h264' | 'hevc';
  /**
   * iOS: supports "internal" or "external". Default is "internal".
   * tvOS: supports only "external"
   * watchOS: supports only "internal"
   * Maps to --display
   * @default "internal"
   */
  display?: 'internal' | 'external';
  /**
   * For non-rectangular displays, handle the mask by policy.
   * ignored: The mask is ignored and the unmasked framebuffer is saved.
   * alpha: Not supported, but retained for compatibility; the mask is rendered black.
   * black: The mask is rendered black.
   * Maps to --mask
   */
  mask?: 'ignored' | 'alpha' | 'black';
  /**
   * Force the output file to be written to, even if the file already exists.
   * Maps to --force
   */
  force?: boolean;
}

/**
 * Creates xcrun simctl command line arguments from iOS options
 * @param options iOS-specific video recording options
 * @returns Array of command line arguments for xcrun simctl io recordVideo
 */
export function createIOSOptions(options: Partial<VideokittenOptionsIOS> = {}): string[] {
  const args: string[] = ['simctl', 'io'];

  // Add device ID if specified
  if (options.deviceId === undefined) {
    args.push('booted'); // Default to booted simulator
  } else {
    args.push(options.deviceId);
  }

  args.push('recordVideo');

  // Add iOS-specific options
  if (options.codec) {
    args.push('--codec', options.codec);
  }

  if (options.display) {
    args.push('--display', options.display);
  }

  if (options.mask) {
    args.push('--mask', options.mask);
  }

  if (options.force) {
    args.push('--force');
  }

  // Add output path at the end
  if (options.outputPath !== undefined) {
    args.push(options.outputPath);
  }

  return args;
}
