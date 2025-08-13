import {
  videokitten,
  VideokittenOptions,
  VideokittenOptionsIOS,
  VideokittenOptionsAndroid,
  Videokitten,
  VideokittenError,
  VideokittenOperationAbortedError,
  OnErrorHandler,
  RecordingSession,
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
  onError: 'throw',
});
assertType<Videokitten>(iosInstance);

// Test Android instance creation
const androidInstance = videokitten({
  platform: 'android',
  deviceId: 'emulator-5554',
  adbPath: '/usr/bin/adb',
  outputPath: '/tmp/video.mp4',
  onError: 'ignore',
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
  onError: 'throw',
});

assertType<VideokittenOptionsAndroid>({
  platform: 'android',
  deviceId: 'emulator-5554',
  adbPath: '/usr/bin/adb',
  outputPath: '/tmp/video.mp4',
  onError: 'ignore',
});

// Test OnErrorHandler types
assertType<OnErrorHandler>('throw');
assertType<OnErrorHandler>('ignore');
assertType<OnErrorHandler>((error: Error) => console.error(error));

// Test Videokitten interface
const dummyVideokitten: Videokitten = {
  startRecording: async (options?: Partial<VideokittenOptions>) => {
    return {
      stop: async () => '/path/to/video.mp4',
    } as RecordingSession;
  },
};
assertType<Videokitten>(dummyVideokitten);

// Test method signatures
assertType<Promise<RecordingSession | undefined>>(iosInstance.startRecording());
assertType<Promise<RecordingSession | undefined>>(
  iosInstance.startRecording({
    deviceId: 'specific-device',
    outputPath: '/custom/path.mp4',
  })
);

assertType<Promise<RecordingSession | undefined>>(androidInstance.startRecording());
assertType<Promise<RecordingSession | undefined>>(
  androidInstance.startRecording({
    deviceId: 'emulator-5554',
    outputPath: '/custom/path.mp4',
  })
);

// Test error classes
assertType<Error>(new VideokittenError('test error'));
assertType<VideokittenError>(new VideokittenOperationAbortedError());

// Test union types
assertType<VideokittenOptions>({
  platform: 'ios',
  xcrunPath: '/usr/bin/xcrun',
  codec: 'hevc',
});

assertType<VideokittenOptions>({
  platform: 'android',
  adbPath: '/usr/bin/adb',
});
