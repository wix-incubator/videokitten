import fs from 'node:fs';

import execa from 'execa';

import type { Videokitten } from './types';
import type { VideokittenOptionsAndroid, VideokittenOptionsBase } from './options';
import { createAndroidOptions } from './options';
import {
  VideokittenOperationAbortedError,
  VideokittenScrcpyNotFoundError,
  VideokittenAndroidDeviceError,
  VideokittenFileWriteError,
  VideokittenRecordingFailedError
} from './errors';
import { doHandleError, createVideoPath, ensureFileDirectory } from './utils';

/**
 * Gets the appropriate file extension based on the recording format
 * @param format - The recording format from options
 * @returns The file extension (without dot)
 */
function getFileExtension(format?: string): string {
  // scrcpy defaults to mp4 when no format is specified
  return format || 'mp4';
}

/**
 * Android video recording implementation using scrcpy
 */
export class VideokittenAndroid implements Videokitten<VideokittenOptionsAndroid> {
  private scrcpyPath: string;
  private options: VideokittenOptionsAndroid;

  constructor(options: VideokittenOptionsAndroid) {
    this.options = { audio: false, window: false, ...options };
    this.scrcpyPath = options.scrcpyPath || 'scrcpy'; // Fallback to PATH
  }

  async record(overrideOptions: Partial<VideokittenOptionsBase> = {}): Promise<string | undefined> {
    const options = { ...this.options, ...overrideOptions };
    const onError = options.onError || 'throw';

    // Determine the correct file extension based on recording format
    const extension = getFileExtension(options.recording?.format);
    const expectedPath = createVideoPath('android', extension, options.outputPath);
    let outputPath: string | undefined = expectedPath;

    try {
      // Check for abort signal before starting
      if (options.abortSignal?.aborted) {
        throw new VideokittenOperationAbortedError('Android video recording');
      }

      // Ensure the directory exists before recording
      ensureFileDirectory(expectedPath);

      // Create scrcpy command arguments (includes --time-limit if timeout is set)
      const args = createAndroidOptions({ ...options, outputPath: expectedPath });

      // Set up environment variables for scrcpy
      const env = { ...process.env };

      // Set ADB environment variable if adbPath is specified
      // This tells scrcpy where to find the adb executable
      if (options.adbPath) {
        env.ADB = options.adbPath;
      }

      await execa(this.scrcpyPath, args, {
        env,
        signal: options.abortSignal
      } as any); // Type assertion to bypass outdated definitions

      // Verify the file was actually created
      if (!fs.existsSync(expectedPath)) {
        outputPath = undefined;
        throw new VideokittenFileWriteError(expectedPath, new Error('Video file was not created'));
      }

      return outputPath;
    } catch (error) {
      const recordingError = this._classifyError(error, options.deviceId || 'default', expectedPath);
      return doHandleError(onError, recordingError, Promise.resolve(outputPath));
    }
  }

  private _classifyError(error: unknown, deviceId: string, outputPath: string): Error {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT') || error.message.includes('command not found')) {
        return new VideokittenScrcpyNotFoundError(this.scrcpyPath, error);
      } else if (error.message.includes('device not found') || error.message.includes('device offline')) {
        return new VideokittenAndroidDeviceError(deviceId, error);
      } else if (error.message.includes('aborted') || error.name === 'AbortError') {
        return new VideokittenOperationAbortedError('Android video recording');
      } else if ((error as NodeJS.ErrnoException).code === 'ENOENT' || (error as NodeJS.ErrnoException).code === 'EACCES') {
        return new VideokittenFileWriteError(outputPath, error);
      } else {
        return new VideokittenRecordingFailedError('android', error);
      }
    } else {
      return new VideokittenRecordingFailedError('android');
    }
  }
}
