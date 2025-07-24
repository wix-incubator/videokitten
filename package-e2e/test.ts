import {
  videokitten,
  VideokittenOptions,
  VideokittenOptionsIOS,
  VideokittenOptionsAndroid,
  Videokitten,
  OnErrorHandler,
  VideokittenError,
} from 'videokitten';

declare function assertType<T>(value: T): T;

// Test main videokitten factory function
assertType<typeof videokitten>(videokitten);

// Test iOS instance creation
const iosInstance = videokitten({
  platform: 'ios',
  deviceId: 'booted',
  xcrunPath: '/usr/bin/xcrun',
  codec: 'hevc',
  display: 'internal',
  mask: 'ignored',
  outputPath: '/tmp/video.mp4',
  onError: 'throw'
});
assertType<Videokitten>(iosInstance);

// Test Android instance creation
const androidInstance = videokitten({
  platform: 'android',
  deviceId: 'emulator-5554',
  adbPath: '/usr/bin/adb',
  outputPath: '/tmp/video.mp4',
  onError: 'ignore'
});
assertType<Videokitten>(androidInstance);

// Test option interfaces
assertType<VideokittenOptionsIOS>({
  platform: 'ios',
  deviceId: 'booted',
  xcrunPath: '/usr/bin/xcrun',
  codec: 'hevc',
  display: 'internal',
  mask: 'ignored',
  outputPath: '/tmp/video.mp4',
  onError: 'throw'
});

assertType<VideokittenOptionsAndroid>({
  platform: 'android',
  deviceId: 'emulator-5554',
  adbPath: '/usr/bin/adb',
  outputPath: '/tmp/video.mp4',
  onError: 'ignore'
});

// Test OnErrorHandler types
assertType<OnErrorHandler>('throw');
assertType<OnErrorHandler>('ignore');
assertType<OnErrorHandler>((error: Error) => console.error(error));

// Test Videokitten interface
const dummyVideokitten: Videokitten = {
  record: async (options?: Partial<VideokittenOptions>) => '/path/to/video.mp4'
};
assertType<Videokitten>(dummyVideokitten);

// Test method signatures
assertType<Promise<string | undefined>>(iosInstance.record());
assertType<Promise<string | undefined>>(iosInstance.record({
  deviceId: 'specific-device',
  outputPath: '/custom/path.mp4'
}));

assertType<Promise<string | undefined>>(androidInstance.record());
assertType<Promise<string | undefined>>(androidInstance.record({
  deviceId: 'emulator-5554',
  outputPath: '/custom/path.mp4'
}));

// Test error classes
assertType<Error>(new VideokittenError('test error'));

// Test union types
assertType<VideokittenOptions>({
  platform: 'ios',
  xcrunPath: '/usr/bin/xcrun',
  codec: 'hevc'
});

assertType<VideokittenOptions>({
  platform: 'android',
  adbPath: '/usr/bin/adb'
});
