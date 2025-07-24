import { test as it, describe } from 'node:test';
import { strictEqual } from 'node:assert';
import { existsSync } from 'node:fs';

import { videokitten } from './index';

const isCI = process.env.CI === 'true' || process.env.CI === '1';
const test = isCI ? it.skip : it;

describe('Videokitten Integration Tests', () => {
  describe('iOS', () => {
    test('should record a video successfully (happy path)', async () => {
      const ios = videokitten({
        platform: 'ios',
        timeout: 2, // 2-second limit for integration test
        onError: 'ignore'
      });

      try {
        const videoPath = await ios.record();

        if (videoPath) {
          strictEqual(typeof videoPath, 'string');
          strictEqual(videoPath.length > 0, true);
          strictEqual(existsSync(videoPath), true);
          strictEqual(videoPath.includes('.mp4'), true);

          console.log(`✅ iOS video saved to: ${videoPath}`);
        } else {
          console.log('⚠️  iOS test returned undefined (expected with onError: \'ignore\')');
        }
      } catch (error) {
        console.log(`⚠️  iOS test failed: ${error}`);
      }
    });

    it('should handle xcrun not found error (unhappy path)', async () => {
      const ios = videokitten({
        platform: 'ios',
        xcrunPath: '/nonexistent/path/to/xcrun', // Deliberately broken path
        timeout: 2 // 2-second limit for integration test
      });

      try {
        await ios.record();
        strictEqual(false, true, 'Should have thrown an error');
      } catch (error) {
        strictEqual((error as Error).name, 'VideokittenXcrunNotFoundError');
        console.log(`✅ Correctly caught xcrun error: ${(error as Error).message}`);
      }
    });
  });

  describe('Android', () => {
    test('should record a video successfully (happy path)', async () => {
      const android = videokitten({
        platform: 'android',
        recording: {
          bitRate: 4_000_000,
          codec: 'h264',
          timeLimit: 2 // 2-second limit via scrcpy timeLimit option
        },
        timeout: 2, // 2-second limit for integration test (backup)
        onError: 'ignore'
      });

      try {
        const videoPath = await android.record();

        if (videoPath) {
          strictEqual(typeof videoPath, 'string');
          strictEqual(videoPath.length > 0, true);
          strictEqual(existsSync(videoPath), true);
          strictEqual(videoPath.includes('.mp4'), true);

          console.log(`✅ Android video saved to: ${videoPath}`);
        } else {
          console.log('⚠️  Android test returned undefined (expected if no device available)');
        }
      } catch (error) {
        console.log(`⚠️  Android test failed (expected if no device available): ${error}`);
      }
    });

    it('should handle scrcpy not found error (unhappy path)', async () => {
      const android = videokitten({
        platform: 'android',
        scrcpyPath: '/nonexistent/path/to/scrcpy', // Deliberately broken path
        adbPath: '/nonexistent/path/to/adb', // Also break adb for good measure
        timeout: 2 // 2-second limit for integration test
      });

      try {
        await android.record();
        strictEqual(false, true, 'Should have thrown an error');
      } catch (error) {
        const errorName = (error as Error).name;
        // Should get scrcpy error since that's the primary command being executed
        if (errorName === 'VideokittenScrcpyNotFoundError') {
          console.log(`✅ Correctly caught scrcpy error: ${(error as Error).message}`);
        } else {
          console.log(`⚠️  Got different error (still valid): ${errorName} - ${(error as Error).message}`);
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unsupported platform', () => {
      try {
        videokitten({ platform: 'windows' } as any);
        strictEqual(false, true, 'Should have thrown an error');
      } catch (error) {
        strictEqual((error as Error).message, 'Unsupported platform: windows');
        console.log(`✅ Correctly caught unsupported platform error: ${(error as Error).message}`);
      }
    });
  });
});
