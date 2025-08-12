# Videokitten 📱🎬

**Videokitten** is a cross-platform Node.js library for recording videos from iOS simulators and Android emulators/devices. It provides a simple, unified API to automate screen recording for your integration tests, E2E tests, or any other automation needs.

- 🍎 **iOS Simulator Support** - Record videos using `xcrun simctl`
- 🤖 **Android Emulator/Device Support** - Record videos using the powerful `scrcpy` tool
- 🎥 **Flexible API** - Start and stop recording programmatically with full control.
- 🛠️ **Error Handling** - Built-in error classification for common issues (e.g., device not found, tools not installed).
- ✨ **TypeScript Support** - Fully typed for a great developer experience.

## Installation

```bash
npm install videokitten
```

## Quick Start

Here's a basic example of how to record a 5-second video from a booted iOS simulator:

```javascript
import { videokitten } from 'videokitten';

async function main() {
  const kitten = videokitten({ platform: 'ios' });

  console.log('Starting iOS recording...');
  const session = await kitten.startRecording();
  if (!session) {
    console.log('Recording failed to start (onError: ignore was set)');
    return;
  }

  console.log('Recording started!');

  // Let it record for 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('Stopping recording...');
  const videoPath = await session.stop();
  if (videoPath) {
    console.log(`Video saved to: ${videoPath}`);
  } else {
    console.log('Recording failed to complete');
  }
}

main().catch(console.error);
```

## API

### `videokitten(options)`

Creates a new `Videokitten` instance.

#### `options`

An object with platform-specific configuration.

##### iOS Options (`VideokittenOptionsIOS`)

```typescript
const options = {
  platform: 'ios',
  deviceId?: string;       // Default: 'booted' (the currently booted simulator)
  outputPath?: string;     // Default: a temporary file in /tmp
  xcrunPath?: string;      // Default: '/usr/bin/xcrun'
  codec?: 'h264' | 'hevc'; // Default: 'hevc'
  display?: 'internal' | 'external'; // Default: 'internal'
  force?: boolean;         // Overwrite existing file. Default: false
};
```

##### Android Options (`VideokittenOptionsAndroid`)

Videokitten uses `scrcpy` for Android recording, so the options are a direct mapping to `scrcpy`'s command-line arguments.

```typescript
const options = {
  platform: 'android',
  deviceId?: string;          // Target a specific device by serial
  outputPath?: string;        // Default: a temporary file in /tmp
  scrcpyPath?: string;        // Path to scrcpy executable. Default: 'scrcpy'
  adbPath?: string;           // Path to adb executable. Default: assumes in PATH

  // See scrcpy documentation for all available options
  recording?: {
    bitRate?: number;         // e.g., 8_000_000 for 8 Mbps
    codec?: 'h264' | 'h265' | 'av1';
    format?: 'mp4' | 'mkv';
    timeLimit?: number;       // In seconds
  },

  // And many more...
};
```

### Base Options

All platforms support these common options:

```typescript
const options = {
  platform: 'ios' | 'android',
  deviceId?: string;          // Device identifier
  outputPath?: string;        // Output file path
  abortSignal?: AbortSignal;  // Signal to cancel recording
  onError?: 'throw' | 'ignore' | ((error: Error) => void);
  timeout?: number;           // Recording timeout in seconds
  delay?: number | [number, number]; // Frame buffering delays in milliseconds
};
```

#### Delay Configuration

The `delay` option controls timing delays for frame buffering:

- **Single number**: Startup delay only (e.g., `200` = wait 200ms after process is ready)
- **Tuple `[startup, stop]`**: Both startup and stop delays (e.g., `[200, 100]`)

**Startup delay**: Waits after the process signals it's ready before considering recording started. This allows processes like scrcpy to initialize and buffer frames.

**Stop delay**: Waits before stopping the process to ensure all buffered frames are written. This prevents missing the last few frames of the recording.

**Defaults**:
- **Android**: `200` - scrcpy needs time to buffer frames
- **iOS**: `0` - iOS handles buffering internally

```typescript
// Custom delays for Android
const android = videokitten({
  platform: 'android',
  delay: [300, 150] // 300ms startup, 150ms stop delay
});

// Just startup delay
const android = videokitten({
  platform: 'android',
  delay: 250 // 250ms startup delay only
});
```

### `kitten.startRecording(overrideOptions)`

Starts a new recording session.

- `overrideOptions`: An optional object to override the options provided to the `videokitten` constructor.

Returns a `Promise<RecordingSession | undefined>`. Returns `undefined` if recording fails to start and `onError` is set to `'ignore'`.

### `RecordingSession`

An object representing an active recording session.

#### `session.stop()`

Stops the recording gracefully and returns the path to the saved video file.

Returns a `Promise<string | undefined>`. Returns `undefined` if recording fails to complete and `onError` is set to `'ignore'`.

## Advanced Usage

### Stopping with an `AbortSignal`

You can use a standard `AbortSignal` to stop the recording. This is useful for integrating with other parts of your application that use abort controllers.

```javascript
import { videokitten } from 'videokitten';

async function recordWithSignal() {
  const kitten = videokitten({ platform: 'android' });
  const controller = new AbortController();

  // Abort after 10 seconds
  setTimeout(() => controller.abort(), 10000);

  try {
    const session = await kitten.startRecording({ abortSignal: controller.signal });
    if (!session) {
      console.log('Recording failed to start (onError: ignore was set)');
      return;
    }

    console.log('Recording... press Ctrl+C or wait 10s to stop.');

    // The `stop()` promise will be rejected with an AbortError
    // when the signal is aborted.
    const videoPath = await session.stop();
    if (videoPath) {
      console.log(`Video saved to: ${videoPath}`);
    } else {
      console.log('Recording failed to complete');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Recording was aborted successfully.');
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

recordWithSignal();
```

### Error Handling

Videokitten throws specific error classes to help you handle different failure scenarios.

```typescript
import { videokitten, VideokittenError, VideokittenXcrunNotFoundError } from 'videokitten';

try {
  const kitten = videokitten({ platform: 'ios', xcrunPath: '/invalid/path' });
  const session = await kitten.startRecording();
  if (!session) {
    console.log('Recording failed to start (onError: ignore was set)');
    return;
  }

  const videoPath = await session.stop();
  if (videoPath) {
    console.log(`Video saved to: ${videoPath}`);
  }
} catch (error) {
  if (error instanceof VideokittenXcrunNotFoundError) {
    console.error('xcrun is not installed or not in the correct path!');
  } else if (error instanceof VideokittenError) {
    console.error('A videokitten error occurred:', error.message);
  } else {
    console.error('An unknown error occurred:', error);
  }
}
```

Available error classes:

- `VideokittenError` (base class)
- `VideokittenDeviceNotFoundError`
- `VideokittenXcrunNotFoundError`       // xcrun tool not found (iOS)
- `VideokittenScrcpyNotFoundError`      // scrcpy tool not found (Android)
- `VideokittenAdbNotFoundError`         // adb tool not found (Android)
- `VideokittenIOSSimulatorError`
- `VideokittenAndroidDeviceError`
- `VideokittenFileWriteError`
- `VideokittenOperationAbortedError`
- `VideokittenRecordingFailedError`

## Requirements

- **Node.js**: v16.14.0 or higher
- **iOS**: macOS with Xcode Command Line Tools installed.
  - `xcrun` tool (usually available at `/usr/bin/xcrun`)
- **Android**: `scrcpy` and `adb` must be installed and available in your system's `PATH`.
  - [scrcpy releases](https://github.com/Genymobile/scrcpy/releases)
  - [Android SDK Platform-Tools](https://developer.android.com/studio/releases/platform-tools)

## License

MIT

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).
