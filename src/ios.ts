import fs from 'node:fs';

import execa from 'execa';

import type { Videokitten } from './types';
import type { VideokittenOptionsIOS, VideokittenOptionsBase } from './options';
import { createIOSOptions } from './options';
import {
  VideokittenOperationAbortedError,
  VideokittenXcrunNotFoundError,
  VideokittenIOSSimulatorError,
  VideokittenRecordingFailedError,
  VideokittenFileWriteError
} from './errors';
import { doHandleError, createVideoPath, ensureFileDirectory, createTimeoutSignal } from './utils';

/**
 * iOS video recording implementation using xcrun simctl
 */
export class VideokittenIOS implements Videokitten<VideokittenOptionsIOS> {
  private xcrunPath: string;
  private options: VideokittenOptionsIOS;

  constructor(options: VideokittenOptionsIOS) {
    this.options = options;
    this.xcrunPath = options.xcrunPath || '/usr/bin/xcrun';
  }

  async record(overrideOptions: Partial<VideokittenOptionsBase> = {}): Promise<string | undefined> {
    const options = { ...this.options, ...overrideOptions };
    const onError = options.onError || 'throw';
    const expectedPath = createVideoPath('ios', 'mp4', options.outputPath);
    let outputPath: string | undefined = expectedPath;

    // Create unified timeout signal combining user signal and timeout
    const timeoutMs = options.timeout ? options.timeout * 1000 : undefined; // Convert seconds to ms
    const { signal, cleanup } = createTimeoutSignal(options.abortSignal, timeoutMs);

    try {
      // Check for abort signal before starting
      if (signal.aborted) {
        throw new VideokittenOperationAbortedError('iOS video recording');
      }

      // Ensure the directory exists before recording
      ensureFileDirectory(expectedPath);

      // Create command arguments using the options helper
      const args = createIOSOptions({ ...options, outputPath: expectedPath });

      await execa(this.xcrunPath, args, {
        signal
      } as any); // Type assertion to bypass outdated definitions

      // Verify the file was actually created
      if (!fs.existsSync(expectedPath)) {
        outputPath = undefined;
        throw new VideokittenFileWriteError(expectedPath, new Error('Video file was not created'));
      }

      return outputPath;
    } catch (error) {
      const recordingError = this._classifyError(error, options.deviceId || 'booted');
      return doHandleError(onError, recordingError, Promise.resolve(outputPath));
    } finally {
      // Always cleanup timeout
      cleanup();
    }
  }

  private _classifyError(error: unknown, deviceId: string): Error {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT') || error.message.includes('command not found')) {
        return new VideokittenXcrunNotFoundError(this.xcrunPath, error);
      } else if (error.message.includes('Invalid device') || error.message.includes('device not found')) {
        return new VideokittenIOSSimulatorError(deviceId, error);
      } else if (error.message.includes('aborted') || error.name === 'AbortError') {
        return new VideokittenOperationAbortedError('iOS video recording');
      } else {
        return new VideokittenRecordingFailedError('ios', error);
      }
    } else {
      return new VideokittenRecordingFailedError('ios');
    }
  }
}
