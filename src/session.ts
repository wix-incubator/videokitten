import fs from 'node:fs';

import { VideokittenFileWriteError } from './errors';
import type { RecordingProcess } from './utils';
import type { OnErrorHandler } from './options';
import { doHandleError } from './utils';

export class RecordingSession {
  constructor(
    private readonly process: RecordingProcess,
    private readonly videoPath: string,
    private readonly onError?: OnErrorHandler
  ) {}

  async stop(): Promise<string | undefined> {
    try {
      await this.process.stop();

      if (!fs.existsSync(this.videoPath)) {
        throw new VideokittenFileWriteError(
          this.videoPath,
          new Error('Video file was not created')
        );
      }
      return this.videoPath;
    } catch (error) {
      doHandleError(this.onError, error as Error);
      return;
    }
  }
}
