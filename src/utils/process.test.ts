import { test, describe } from 'node:test';
import { strictEqual, rejects } from 'node:assert';
import path from 'node:path';

import { RecordingProcess } from './process';

const FIXTURES_DIR = path.join(__dirname, '__fixtures__');

describe('RecordingProcess Integration Tests', () => {
  test('should start a process and stop it gracefully', async () => {
    const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');
    const process = new RecordingProcess({
      command: 'node',
      args: [scriptPath],
      readyMatcher: (data) => data.includes('Ready'),
    });

    await process.started();
    await process.stop();
  });

  test('should reject on start if process exits with an error code', async () => {
    const scriptPath = path.join(FIXTURES_DIR, 'error-on-start.mjs');
    const process = new RecordingProcess({
      command: 'node',
      args: [scriptPath],
    });

    await rejects(
      () => process.started(),
      (err: Error) => {
        strictEqual(err.message.includes('This process fails immediately.'), true);
        return true;
      },
      'Should have rejected on start'
    );
  });

  test('should handle processes that exit quickly and successfully', async () => {
    const scriptPath = path.join(FIXTURES_DIR, 'quick-exit-success.mjs');
    const process = new RecordingProcess({
      command: 'node',
      args: [scriptPath],
    });

    // It might resolve or reject depending on timing, but it shouldn't hang.
    // The main thing is that stop() should resolve correctly.
    try {
      await process.started();
    } catch {
      // Ignore if it fails to start because it exited too quickly
    }
    await process.stop();
  });

  test('should be stoppable via AbortSignal', async () => {
    const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');
    const controller = new AbortController();

    const process = new RecordingProcess({
      command: 'node',
      args: [scriptPath],
      signal: controller.signal,
      readyMatcher: (data) => data.includes('Ready'),
    });

    await process.started();

    setTimeout(() => controller.abort(), 100);

    await process.stop();
  });

  test('should reject if command does not exist', async () => {
    const process = new RecordingProcess({
      command: 'non-existent-command-12345',
      args: [],
    });

    await rejects(
      () => process.started(),
      (err: Error & { code: string }) => {
        strictEqual(err.code, 'ENOENT');
        return true;
      },
      'Should have rejected with ENOENT'
    );
  });

  describe('Delay functionality', () => {
    test('should apply startup delay when specified as single number', async () => {
      const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');
      const startTime = Date.now();

      const process = new RecordingProcess({
        command: 'node',
        args: [scriptPath],
        readyMatcher: (data) => data.includes('Ready'),
        delay: 100, // 100ms startup delay
      });

      await process.started();
      const elapsed = Date.now() - startTime;

      // Should take at least 100ms due to startup delay
      strictEqual(elapsed >= 100, true, `Expected at least 100ms delay, got ${elapsed}ms`);

      await process.stop();
    });

    test('should apply startup delay when specified as tuple [startup, stop]', async () => {
      const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');
      const startTime = Date.now();

      const process = new RecordingProcess({
        command: 'node',
        args: [scriptPath],
        readyMatcher: (data) => data.includes('Ready'),
        delay: [150, 50], // 150ms startup, 50ms stop delay
      });

      await process.started();
      const elapsed = Date.now() - startTime;

      // Should take at least 150ms due to startup delay
      strictEqual(elapsed >= 150, true, `Expected at least 150ms delay, got ${elapsed}ms`);

      await process.stop();
    });

    test('should apply stop delay when specified as tuple [startup, stop]', async () => {
      const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');

      const process = new RecordingProcess({
        command: 'node',
        args: [scriptPath],
        readyMatcher: (data) => data.includes('Ready'),
        delay: [0, 100], // No startup delay, 100ms stop delay
      });

      await process.started();

      const stopStartTime = Date.now();
      await process.stop();
      const stopElapsed = Date.now() - stopStartTime;

      // Should take at least 100ms due to stop delay
      strictEqual(stopElapsed >= 100, true, `Expected at least 100ms stop delay, got ${stopElapsed}ms`);
    });

    test('should work without delays when delay is 0', async () => {
      const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');
      const startTime = Date.now();

      const process = new RecordingProcess({
        command: 'node',
        args: [scriptPath],
        readyMatcher: (data) => data.includes('Ready'),
        delay: 0, // No delays
      });

      await process.started();
      const elapsed = Date.now() - startTime;

      // Should be very fast (just the time to spawn and get "Ready" output)
      strictEqual(elapsed < 100, true, `Expected fast startup, got ${elapsed}ms`);

      await process.stop();
    });

    test('should work without delays when delay is [0, 0]', async () => {
      const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');
      const startTime = Date.now();

      const process = new RecordingProcess({
        command: 'node',
        args: [scriptPath],
        readyMatcher: (data) => data.includes('Ready'),
        delay: [0, 0], // No delays
      });

      await process.started();
      const elapsed = Date.now() - startTime;

      // Should be very fast (just the time to spawn and get "Ready" output)
      strictEqual(elapsed < 100, true, `Expected fast startup, got ${elapsed}ms`);

      await process.stop();
    });

    test('should handle processes without readyMatcher using delay', async () => {
      const scriptPath = path.join(FIXTURES_DIR, 'successful-start-and-stop.mjs');
      const startTime = Date.now();

      const process = new RecordingProcess({
        command: 'node',
        args: [scriptPath],
        // No readyMatcher - should wait for any stderr output
        delay: 200, // 200ms startup delay
      });

      await process.started();
      const elapsed = Date.now() - startTime;

      // Should take at least 200ms due to startup delay
      strictEqual(elapsed >= 200, true, `Expected at least 200ms delay, got ${elapsed}ms`);

      await process.stop();
    });
  });
});
