import { spawn, type ChildProcess } from 'node:child_process';

export type ProcessOptions = {
  command: string;
  args: string[];
  env?: NodeJS.ProcessEnv;
  signal?: AbortSignal;
  readyMatcher?: (data: string) => boolean;
  delay?: number | [number, number];
};

export class RecordingProcess {
  private readonly child: ChildProcess;
  private readonly signal?: AbortSignal;
  private stderrBuffer = '';
  private processExited = false;
  private exitCode: number | null = null;
  private exitError?: Error;

  constructor(private readonly options: ProcessOptions) {
    this.signal = options.signal;
    this.child = spawn(options.command, options.args, {
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.child.stderr?.on('data', (chunk: Buffer) => {
      this.stderrBuffer += chunk.toString();
    });

    this.child.on('exit', (code) => {
      this.processExited = true;
      this.exitCode = code;
    });

    this.child.on('error', (err) => {
      this.processExited = true;
      this.exitError = err;
    });

    this.signal?.addEventListener('abort', this.onAbort);
  }

  async started(): Promise<void> {
    await this.waitForProcessReady();
    await this.sleep(this.startupDelay);
  }

  async stop(): Promise<void> {
    await this.sleep(this.stopDelay);
    await this.stopProcess();
  }

  private onAbort = () => {
    if (!this.processExited) {
      try {
        this.child.kill('SIGINT');
      } catch {
        // Ignore errors if process is already dead
      }
    }
  };

  private get startupDelay(): number {
    return Array.isArray(this.options.delay) ? this.options.delay[0] : this.options.delay ?? 0;
  }

  private get stopDelay(): number {
    return Array.isArray(this.options.delay) ? this.options.delay[1] : this.options.delay ?? 0;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async waitForProcessReady(): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.processExited) {
        return reject(this.getExitError());
      }

      const readyMatcher = this.options.readyMatcher;
      let resolved = false;

      const resolveOnce = () => {
        if (!resolved) {
          resolved = true;
          this.child.stdout?.removeListener('data', onData);
          this.child.stderr?.removeListener('data', onData);
          this.child.removeListener('spawn', resolveOnce);
          this.child.removeListener('exit', onExit);
          this.child.removeListener('error', onExit);
          resolve();
        }
      };

      const onData = (chunk: Buffer) => {
        if (readyMatcher!(chunk.toString())) {
          resolveOnce();
        }
      };

      const onExit = () => {
        if (!resolved) {
          reject(this.getExitError());
        }
      };

      if (readyMatcher) {
        this.child.stdout?.on('data', onData);
        this.child.stderr?.on('data', onData);
      } else {
        this.child.once('spawn', resolveOnce);
      }

      this.child.once('exit', onExit);
      this.child.once('error', onExit);

      if (this.signal?.aborted) {
        reject(new Error('Operation was aborted.'));
      }
    });
  }

  private async stopProcess(): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.processExited) {
        if (this.exitError) {
          return reject(this.exitError);
        } else if (this.exitCode !== 0 && this.exitCode !== null) {
          return reject(this.getExitError());
        }
        return resolve();
      }

      this.child.once('exit', () => {
        this.signal?.removeEventListener('abort', this.onAbort);
        resolve();
      });

      this.child.once('error', (err) => {
        this.signal?.removeEventListener('abort', this.onAbort);
        reject(err);
      });

      try {
        this.child.kill('SIGINT');
      } catch (error) {
        reject(error);
      }
    });
  }

  private getExitError(): Error {
    if (this.exitError) {
      return this.exitError;
    }

    if (this.signal?.aborted) {
      return new Error('Operation was aborted.');
    }

    const message = this.stderrBuffer.trim() || `Process exited with code ${this.exitCode || 'unknown'}`;
    return new Error(message);
  }
}
