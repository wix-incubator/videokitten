# Videokitten 📱🎬

A cross-platform Node.js library for recording videos from iOS simulators and Android devices/emulators.

## Features

- 🍎 **iOS Simulator Support** - Record videos using `xcrun simctl`
- 🤖 **Android Device/Emulator Support** - Record videos using `scrcpy`
- 🔄 **Cross-platform** - Unified API for both platforms
- 📁 **Flexible Output** - Save to custom paths or auto-generate temp files
- ⏱️ **Timeout Support** - Set recording time limits
- ⚡ **AbortController Support** - Cancel operations gracefully
- 🎯 **TypeScript** - Full type safety and IntelliSense
- 🔧 **Configurable** - Extensive options for both platforms
- 🚨 **Rich Error Handling** - Detailed error types with proper inheritance

## Installation

```bash
npm install videokitten
```

## Quick Start

### iOS Simulator

```typescript
import { videokitten } from 'videokitten';

const ios = videokitten({
  platform: 'ios',
  deviceId: 'booted', // Default: 'booted'
  codec: 'hevc', // Default: 'hevc'
  timeout: 30, // Record for 30 seconds
  outputPath: '/path/to/video.mp4' // Optional: auto-generated if not provided
});

const videoPath = await ios.record();
console.log(`Video saved to: ${videoPath}`);
```

### Android Device/Emulator

```typescript
import { videokitten } from 'videokitten';

const android = videokitten({
  platform: 'android',
  deviceId: 'emulator-5554', // Optional
  recording: {
    codec: 'h264',
    bitRate: 8_000_000,
    timeLimit: 30 // Record for 30 seconds
  },
  outputPath: '/path/to/video.mp4' // Optional: auto-generated if not provided
});

const videoPath = await android.record();
console.log(`Video saved to: ${videoPath}`);
```

## API Reference

### Factory Function

#### `videokitten(options: VideokittenOptions)`

Creates a platform-specific video recording instance.

**Parameters:**
- `options` - Configuration object (see platform-specific options below)

**Returns:** `Videokitten` instance

### iOS Options

```typescript
interface VideokittenOptionsIOS {
  platform: 'ios';
  deviceId?: string;        // Default: 'booted'
  xcrunPath?: string;       // Default: '/usr/bin/xcrun'
  codec?: 'h264' | 'hevc';  // Default: 'hevc'
  display?: 'internal' | 'external'; // Default: 'internal'
  mask?: 'ignored' | 'alpha' | 'black'; // Default: 'ignored'
  force?: boolean;          // Overwrite existing files
  outputPath?: string;      // Auto-generated if not provided
  timeout?: number;         // Recording timeout in seconds
  abortSignal?: AbortSignal;
  onError?: OnErrorHandler;
}
```

### Android Options

```typescript
interface VideokittenOptionsAndroid {
  platform: 'android';
  deviceId?: string;        // Device serial number
  adbPath?: string;         // Path to adb executable
  scrcpyPath?: string;      // Path to scrcpy executable
  recording?: {
    bitRate?: number;       // Video bitrate (default: 8M)
    codec?: 'h264' | 'h265' | 'av1'; // Video codec
    format?: 'mp4' | 'mkv' | 'm4a' | 'mka' | 'opus' | 'aac' | 'flac' | 'wav';
    maxSize?: number;       // Max video dimensions
    timeLimit?: number;     // Recording time limit in seconds
    orientation?: 0 | 90 | 180 | 270;
  };
  window?: false | {        // Display window options (default: false)
    enabled?: boolean;
    borderless?: boolean;
    title?: string;
    // ... more window options
  };
  audio?: false | {         // Audio recording options (default: false)
    enabled?: boolean;
    source?: 'output' | 'mic' | 'playback';
    codec?: 'opus' | 'aac' | 'flac' | 'raw';
    // ... more audio options
  };
  outputPath?: string;      // Auto-generated if not provided
  timeout?: number;         // Recording timeout in seconds
  abortSignal?: AbortSignal;
  onError?: OnErrorHandler;
}
```

### Error Handling

You can control error behavior using the `onError` option:

```typescript
type OnErrorHandler = 'throw' | 'ignore' | ((error: Error) => void);
```

**Options:**
- `'throw'` (default) - Throws the error
- `'ignore'` - Suppresses the error and returns undefined
- `function` - Custom error handler function

```typescript
// Custom error handling
const ios = videokitten({
  platform: 'ios',
  onError: (error) => {
    console.error('Recording failed:', error.message);
    // Custom logging, reporting, etc.
  }
});
```

### Instance Methods

#### `record(options?: Partial<VideokittenOptionsBase>): Promise<string | undefined>`

Records a video and returns the path to the saved file.

**Parameters:**
- `options` - Optional override options for this specific recording

**Returns:** Promise that resolves to the video file path or undefined if failed

**Example:**
```typescript
// Use instance defaults
const path1 = await ios.record();

// Override specific options for this recording
const path2 = await ios.record({
  outputPath: '/custom/path.mp4',
  deviceId: 'specific-device',
  timeout: 10 // Record for 10 seconds
});
```

### Abort Controller Support

Cancel recording operations gracefully:

```typescript
const controller = new AbortController();

const ios = videokitten({
  platform: 'ios',
  abortSignal: controller.signal
});

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const path = await ios.record();
  console.log('Video saved:', path);
} catch (error) {
  if (error.name === 'VideokittenOperationAbortedError') {
    console.log('Recording was cancelled');
  }
}
```

## Error Types

Videokitten provides specific error types for different failure scenarios:

```typescript
import {
  VideokittenError,                    // Base error class - catch this for all errors
} from 'videokitten';

// All specific error types extend VideokittenError:
// - VideokittenDeviceNotFoundError      // Device/simulator not found
// - VideokittenXcrunNotFoundError       // xcrun tool not found (iOS)
// - VideokittenAdbNotFoundError         // adb tool not found (Android)
// - VideokittenScrcpyNotFoundError      // scrcpy tool not found (Android)
// - VideokittenIOSSimulatorError        // iOS simulator not available
// - VideokittenAndroidDeviceError       // Android device not available
// - VideokittenFileWriteError           // Failed to write video file
// - VideokittenOperationAbortedError    // Operation was aborted
// - VideokittenRecordingFailedError     // Generic recording failure
```

All errors extend the base `VideokittenError` class, which extends the standard `Error` class.

## Requirements

### iOS
- macOS with Xcode and iOS Simulator
- `xcrun` tool (usually available at `/usr/bin/xcrun`)

### Android
- `scrcpy` tool installed (https://github.com/Genymobile/scrcpy)
- Android SDK with `adb` tool
- Android device connected or emulator running

## CommonJS Support

Videokitten supports both ES modules and CommonJS:

```javascript
// ES modules
import { videokitten } from 'videokitten';

// CommonJS
const { videokitten } = require('videokitten');
```

## License

MIT

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).
