import {
  doHandleError,
  createVideoPath,
  ensureFileDirectory,
  createTimeoutSignal,
  RecordingProcess,
} from './utils';
import { RecordingSession } from './session';
import type { Videokitten } from './types';
import type {
  VideokittenOptionsIOS,
  VideokittenOptionsBase,
} from './options';
import { createIOSOptions } from './options';
import {
  VideokittenOperationAbortedError,
  VideokittenXcrunNotFoundError,
  VideokittenIOSSimulatorError,
  VideokittenRecordingFailedError,
} from './errors';

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

  async startRecording(
    overrideOptions: Partial<VideokittenOptionsBase> = {}
  ): Promise<RecordingSession | undefined> {
    const options = { ...this.options, ...overrideOptions };
    const onError = options.onError || 'throw';
    const expectedPath = createVideoPath('ios', 'mp4', options.outputPath);

    // Create unified timeout signal combining user signal and timeout
    const timeoutMs = options.timeout ? options.timeout * 1000 : undefined;
    const { signal, cleanup } = createTimeoutSignal(
      options.abortSignal,
      timeoutMs
    );

    try {
      // Ensure the directory exists before recording
      ensureFileDirectory(expectedPath);

      // Create command arguments using the options helper
      const args = createIOSOptions({ ...options, outputPath: expectedPath });
      const process = new RecordingProcess({
        command: this.xcrunPath,
        args,
        signal,
        readyMatcher: (data) => data.includes('Recording started'),
        delay: options.delay,
      });

      await process.started();
      return new RecordingSession(process, expectedPath, onError);
    } catch (error) {
      const recordingError = this._classifyError(
        error,
        options.deviceId || 'booted'
      );
      doHandleError(onError, recordingError);
      return;
    } finally {
      cleanup();
    }
  }

  private _classifyError(error: unknown, deviceId: string): Error {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT') || error.message.includes('command not found')) {
        return new VideokittenXcrunNotFoundError(this.xcrunPath, error);
      } else if (error.message.includes('Invalid device') || error.message.includes('device not found')) {
        return new VideokittenIOSSimulatorError(deviceId, error);
      } else if (
        error.message.includes('aborted') ||
        error.name === 'AbortError'
      ) {
        return new VideokittenOperationAbortedError('iOS video recording');
      } else {
        return new VideokittenRecordingFailedError('ios', error);
      }
    } else {
      return new VideokittenRecordingFailedError('ios');
    }
  }
}
