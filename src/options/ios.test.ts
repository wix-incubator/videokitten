import { test as it, describe } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import { createIOSOptions, type VideokittenOptionsIOS } from './ios';

describe('createIOSOptions', () => {
  it('should return basic xcrun simctl command for empty options', () => {
    const result = createIOSOptions({});
    deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo']);
  });

  it('should return basic xcrun simctl command for undefined options', () => {
    const result = createIOSOptions();
    deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo']);
  });

  describe('device targeting', () => {
    it('should use "booted" as default device', () => {
      const result = createIOSOptions({});
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo']);
    });

    it('should handle specific device ID', () => {
      const result = createIOSOptions({ deviceId: 'ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV' });
      deepStrictEqual(result, ['simctl', 'io', 'ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV', 'recordVideo']);
    });

    it('should handle device name', () => {
      const result = createIOSOptions({ deviceId: 'iPhone 15 Pro' });
      deepStrictEqual(result, ['simctl', 'io', 'iPhone 15 Pro', 'recordVideo']);
    });
  });

  describe('codec options', () => {
    it('should handle h264 codec', () => {
      const result = createIOSOptions({ codec: 'h264' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--codec', 'h264']);
    });

    it('should handle hevc codec', () => {
      const result = createIOSOptions({ codec: 'hevc' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--codec', 'hevc']);
    });
  });

  describe('display options', () => {
    it('should handle internal display', () => {
      const result = createIOSOptions({ display: 'internal' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--display', 'internal']);
    });

    it('should handle external display', () => {
      const result = createIOSOptions({ display: 'external' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--display', 'external']);
    });
  });

  describe('mask options', () => {
    it('should handle ignored mask', () => {
      const result = createIOSOptions({ mask: 'ignored' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--mask', 'ignored']);
    });

    it('should handle alpha mask', () => {
      const result = createIOSOptions({ mask: 'alpha' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--mask', 'alpha']);
    });

    it('should handle black mask', () => {
      const result = createIOSOptions({ mask: 'black' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--mask', 'black']);
    });
  });

  describe('force option', () => {
    it('should handle force flag', () => {
      const result = createIOSOptions({ force: true });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '--force']);
    });

    it('should not add force flag when false', () => {
      const result = createIOSOptions({ force: false });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo']);
    });
  });

  describe('output path', () => {
    it('should handle output path', () => {
      const result = createIOSOptions({ outputPath: 'recording.mov' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', 'recording.mov']);
    });

    it('should handle output path with absolute path', () => {
      const result = createIOSOptions({ outputPath: '/Users/test/Desktop/video.mp4' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '/Users/test/Desktop/video.mp4']);
    });
  });

  describe('combined options', () => {
    it('should handle multiple options in correct order', () => {
      const result = createIOSOptions({
        deviceId: 'iPhone 15 Pro',
        codec: 'h264',
        display: 'external',
        mask: 'black',
        force: true,
        outputPath: 'test.mp4'
      });
      deepStrictEqual(result, [
        'simctl', 'io', 'iPhone 15 Pro', 'recordVideo',
        '--codec', 'h264',
        '--display', 'external',
        '--mask', 'black',
        '--force',
        'test.mp4'
      ]);
    });

    it('should handle partial options', () => {
      const result = createIOSOptions({
        codec: 'hevc',
        force: true,
        outputPath: 'partial.mov'
      });
      deepStrictEqual(result, [
        'simctl', 'io', 'booted', 'recordVideo',
        '--codec', 'hevc',
        '--force',
        'partial.mov'
      ]);
    });

    it('should maintain correct argument order', () => {
      const result = createIOSOptions({
        outputPath: 'order_test.mp4',
        force: true,
        codec: 'h264',
        deviceId: 'test-device',
        display: 'internal',
        mask: 'ignored'
      });
      deepStrictEqual(result, [
        'simctl', 'io', 'test-device', 'recordVideo',
        '--codec', 'h264',
        '--display', 'internal',
        '--mask', 'ignored',
        '--force',
        'order_test.mp4'
      ]);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical iPhone recording', () => {
      const result = createIOSOptions({
        deviceId: 'iPhone 15 Pro',
        codec: 'hevc',
        display: 'internal',
        outputPath: 'iphone_demo.mov'
      });
      deepStrictEqual(result, [
        'simctl', 'io', 'iPhone 15 Pro', 'recordVideo',
        '--codec', 'hevc',
        '--display', 'internal',
        'iphone_demo.mov'
      ]);
    });

    it('should handle Apple TV recording', () => {
      const result = createIOSOptions({
        deviceId: 'Apple TV 4K',
        codec: 'h264',
        display: 'external',
        force: true,
        outputPath: 'appletv_recording.mp4'
      });
      deepStrictEqual(result, [
        'simctl', 'io', 'Apple TV 4K', 'recordVideo',
        '--codec', 'h264',
        '--display', 'external',
        '--force',
        'appletv_recording.mp4'
      ]);
    });

    it('should handle Apple Watch recording', () => {
      const result = createIOSOptions({
        deviceId: 'Apple Watch Series 9',
        codec: 'hevc',
        display: 'internal',
        mask: 'ignored',
        outputPath: 'watch_demo.mov'
      });
      deepStrictEqual(result, [
        'simctl', 'io', 'Apple Watch Series 9', 'recordVideo',
        '--codec', 'hevc',
        '--display', 'internal',
        '--mask', 'ignored',
        'watch_demo.mov'
      ]);
    });

    it('should handle booted device with minimal options', () => {
      const result = createIOSOptions({
        outputPath: 'quick_recording.mp4'
      });
      deepStrictEqual(result, [
        'simctl', 'io', 'booted', 'recordVideo',
        'quick_recording.mp4'
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string device ID', () => {
      const result = createIOSOptions({ deviceId: '' });
      deepStrictEqual(result, ['simctl', 'io', '', 'recordVideo']);
    });

    it('should handle empty string output path', () => {
      const result = createIOSOptions({ outputPath: '' });
      deepStrictEqual(result, ['simctl', 'io', 'booted', 'recordVideo', '']);
    });

    it('should handle all iOS-specific options together', () => {
      const options: Partial<VideokittenOptionsIOS> = {
        platform: 'ios',
        deviceId: 'test-device',
        outputPath: 'test.mov',
        codec: 'h264',
        display: 'external',
        mask: 'black',
        force: true
      };

      const result = createIOSOptions(options);
      deepStrictEqual(result, [
        'simctl', 'io', 'test-device', 'recordVideo',
        '--codec', 'h264',
        '--display', 'external',
        '--mask', 'black',
        '--force',
        'test.mov'
      ]);
    });
  });
});
