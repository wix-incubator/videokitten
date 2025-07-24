import { test, describe } from 'node:test';
import { strictEqual } from 'node:assert';

import {
  VideokittenError,
  VideokittenDeviceNotFoundError,
  VideokittenXcrunNotFoundError,
  VideokittenAdbNotFoundError,
  VideokittenScrcpyNotFoundError,
  VideokittenIOSSimulatorError,
  VideokittenAndroidDeviceError,
  VideokittenFileWriteError,
  VideokittenOperationAbortedError,
  VideokittenRecordingFailedError
} from './errors';

describe('Videokitten Error Classes', () => {

  describe('VideokittenError', () => {
    test('should create base error with message', () => {
      const error = new VideokittenError('Test error message');

      strictEqual(error.name, 'VideokittenError');
      strictEqual(error.message, 'Test error message');
      strictEqual(error instanceof Error, true);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create base error with cause', () => {
      const causeError = new Error('Underlying cause');
      const error = new VideokittenError('Test error message', { cause: causeError });

      strictEqual(error.name, 'VideokittenError');
      strictEqual(error.message, 'Test error message');
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenDeviceNotFoundError', () => {
    test('should create device not found error with device ID', () => {
      const deviceId = 'device-123';
      const error = new VideokittenDeviceNotFoundError(deviceId);

      strictEqual(error.name, 'VideokittenDeviceNotFoundError');
      strictEqual(error.message, `Device not found: ${deviceId}`);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create device not found error with cause', () => {
      const deviceId = 'device-123';
      const causeError = new Error('Underlying cause');
      const error = new VideokittenDeviceNotFoundError(deviceId, causeError);

      strictEqual(error.name, 'VideokittenDeviceNotFoundError');
      strictEqual(error.message, `Device not found: ${deviceId}`);
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenXcrunNotFoundError', () => {
    test('should create xcrun not found error with path', () => {
      const xcrunPath = '/usr/bin/xcrun';
      const error = new VideokittenXcrunNotFoundError(xcrunPath);

      strictEqual(error.name, 'VideokittenXcrunNotFoundError');
      strictEqual(error.message, `xcrun not found at path: ${xcrunPath}`);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create xcrun not found error with cause', () => {
      const xcrunPath = '/nonexistent/xcrun';
      const causeError = new Error('File not found');
      const error = new VideokittenXcrunNotFoundError(xcrunPath, causeError);

      strictEqual(error.name, 'VideokittenXcrunNotFoundError');
      strictEqual(error.message, `xcrun not found at path: ${xcrunPath}`);
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenAdbNotFoundError', () => {
    test('should create adb not found error with path and troubleshooting info', () => {
      const adbPath = '/usr/bin/adb';
      const error = new VideokittenAdbNotFoundError(adbPath);

      strictEqual(error.name, 'VideokittenAdbNotFoundError');
      strictEqual(error.message.startsWith(`adb not found at path: ${adbPath}`), true);
      strictEqual(error.message.includes('To fix ADB issues:'), true);
      strictEqual(error.message.includes('Check if Android SDK is installed'), true);
      strictEqual(error.message.includes('Add ADB to your PATH'), true);
      strictEqual(error.message.includes('Use adbPath option'), true);
      strictEqual(error.message.includes('Android SDK Platform-Tools'), true);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create adb not found error with cause', () => {
      const adbPath = '/nonexistent/adb';
      const causeError = new Error('File not found');
      const error = new VideokittenAdbNotFoundError(adbPath, causeError);

      strictEqual(error.name, 'VideokittenAdbNotFoundError');
      strictEqual(error.message.startsWith(`adb not found at path: ${adbPath}`), true);
      strictEqual(error.message.includes('ANDROID_HOME'), true);
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenScrcpyNotFoundError', () => {
    test('should create scrcpy not found error with path and installation info', () => {
      const scrcpyPath = '/usr/bin/scrcpy';
      const error = new VideokittenScrcpyNotFoundError(scrcpyPath);

      strictEqual(error.name, 'VideokittenScrcpyNotFoundError');
      strictEqual(error.message.startsWith(`scrcpy not found at path: ${scrcpyPath}`), true);
      strictEqual(error.message.includes('To install scrcpy:'), true);
      strictEqual(error.message.includes('brew install scrcpy'), true);
      strictEqual(error.message.includes('apt install scrcpy'), true);
      strictEqual(error.message.includes('winget install scrcpy'), true);
      strictEqual(error.message.includes('github.com/Genymobile/scrcpy'), true);
      strictEqual(error.message.includes('scrcpyPath option'), true);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create scrcpy not found error with cause', () => {
      const scrcpyPath = '/nonexistent/scrcpy';
      const causeError = new Error('File not found');
      const error = new VideokittenScrcpyNotFoundError(scrcpyPath, causeError);

      strictEqual(error.name, 'VideokittenScrcpyNotFoundError');
      strictEqual(error.message.startsWith(`scrcpy not found at path: ${scrcpyPath}`), true);
      strictEqual(error.message.includes('PATH'), true);
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenIOSSimulatorError', () => {
    test('should create iOS simulator error with device ID', () => {
      const deviceId = 'booted';
      const error = new VideokittenIOSSimulatorError(deviceId);

      strictEqual(error.name, 'VideokittenIOSSimulatorError');
      strictEqual(error.message, `iOS Simulator not available or not booted: ${deviceId}`);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create iOS simulator error with cause', () => {
      const deviceId = 'simulator-123';
      const causeError = new Error('Simulator not running');
      const error = new VideokittenIOSSimulatorError(deviceId, causeError);

      strictEqual(error.name, 'VideokittenIOSSimulatorError');
      strictEqual(error.message, `iOS Simulator not available or not booted: ${deviceId}`);
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenAndroidDeviceError', () => {
    test('should create Android device error with device ID', () => {
      const deviceId = 'emulator-5554';
      const error = new VideokittenAndroidDeviceError(deviceId);

      strictEqual(error.name, 'VideokittenAndroidDeviceError');
      strictEqual(error.message, `Android device/emulator not available: ${deviceId}`);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create Android device error with cause', () => {
      const deviceId = 'device-123';
      const causeError = new Error('Device offline');
      const error = new VideokittenAndroidDeviceError(deviceId, causeError);

      strictEqual(error.name, 'VideokittenAndroidDeviceError');
      strictEqual(error.message, `Android device/emulator not available: ${deviceId}`);
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenFileWriteError', () => {
    test('should create file write error with output path', () => {
      const outputPath = '/tmp/video.mp4';
      const error = new VideokittenFileWriteError(outputPath);

      strictEqual(error.name, 'VideokittenFileWriteError');
      strictEqual(error.message, `Failed to write video file: ${outputPath}`);
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create file write error with cause', () => {
      const outputPath = '/readonly/video.mp4';
      const causeError = new Error('Permission denied');
      const error = new VideokittenFileWriteError(outputPath, causeError);

      strictEqual(error.name, 'VideokittenFileWriteError');
      strictEqual(error.message, `Failed to write video file: ${outputPath}`);
      strictEqual(error.cause, causeError);
    });
  });

  describe('VideokittenOperationAbortedError', () => {
    test('should create operation aborted error with default operation', () => {
      const error = new VideokittenOperationAbortedError();

      strictEqual(error.name, 'VideokittenOperationAbortedError');
      strictEqual(error.message, 'operation was aborted');
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create operation aborted error with custom operation', () => {
      const operation = 'recording';
      const error = new VideokittenOperationAbortedError(operation);

      strictEqual(error.name, 'VideokittenOperationAbortedError');
      strictEqual(error.message, `${operation} was aborted`);
      strictEqual(error instanceof VideokittenError, true);
    });
  });

  describe('VideokittenRecordingFailedError', () => {
    test('should create recording failed error for iOS', () => {
      const error = new VideokittenRecordingFailedError('ios');

      strictEqual(error.name, 'VideokittenRecordingFailedError');
      strictEqual(error.message, 'IOS video recording command failed');
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create recording failed error for Android', () => {
      const error = new VideokittenRecordingFailedError('android');

      strictEqual(error.name, 'VideokittenRecordingFailedError');
      strictEqual(error.message, 'ANDROID video recording command failed');
      strictEqual(error instanceof VideokittenError, true);
    });

    test('should create recording failed error with cause', () => {
      const causeError = new Error('Command execution failed');
      const error = new VideokittenRecordingFailedError('ios', causeError);

      strictEqual(error.name, 'VideokittenRecordingFailedError');
      strictEqual(error.message, 'IOS video recording command failed');
      strictEqual(error.cause, causeError);
    });
  });

  describe('Error inheritance', () => {
    test('all custom errors should inherit from VideokittenError', () => {
      const errors = [
        new VideokittenDeviceNotFoundError('device-123'),
        new VideokittenXcrunNotFoundError('/usr/bin/xcrun'),
        new VideokittenAdbNotFoundError('/usr/bin/adb'),
        new VideokittenScrcpyNotFoundError('/usr/bin/scrcpy'),
        new VideokittenIOSSimulatorError('booted'),
        new VideokittenAndroidDeviceError('emulator-5554'),
        new VideokittenFileWriteError('/tmp/video.mp4'),
        new VideokittenOperationAbortedError('recording'),
        new VideokittenRecordingFailedError('ios')
      ];

      for (const error of errors) {
        strictEqual(error instanceof VideokittenError, true);
        strictEqual(error instanceof Error, true);
      }
    });
  });
});
