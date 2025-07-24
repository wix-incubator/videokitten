/**
 * Base error class for Videokitten errors
 */
export class VideokittenError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'VideokittenError';
  }
}

/**
 * Error thrown when a device is not found
 */
export class VideokittenDeviceNotFoundError extends VideokittenError {
  constructor(deviceId: string, cause?: Error) {
    super(`Device not found: ${deviceId}`, { cause });
    this.name = 'VideokittenDeviceNotFoundError';
  }
}

/**
 * Error thrown when xcrun tool is not found or not executable
 */
export class VideokittenXcrunNotFoundError extends VideokittenError {
  constructor(xcrunPath: string, cause?: Error) {
    super(`xcrun not found at path: ${xcrunPath}`, { cause });
    this.name = 'VideokittenXcrunNotFoundError';
  }
}

/**
 * Error thrown when adb tool is not found or not executable
 */
export class VideokittenAdbNotFoundError extends VideokittenError {
  constructor(adbPath: string, cause?: Error) {
    const troubleshooting = `
To fix ADB issues:

1. Check if Android SDK is installed:
   • Android Studio: Check SDK Manager for Android SDK Platform-Tools
   • Command line: Look for ANDROID_HOME or ANDROID_SDK_ROOT environment variables

2. Add ADB to your PATH:
   • macOS/Linux: export PATH="$ANDROID_HOME/platform-tools:$PATH"
   • Windows: Add %ANDROID_HOME%\\platform-tools to your PATH

3. Use adbPath option:
   • videokitten({ platform: 'android', adbPath: '/path/to/adb' })
   • Common locations:
     - macOS: ~/Library/Android/sdk/platform-tools/adb
     - Linux: ~/Android/Sdk/platform-tools/adb
     - Windows: %USERPROFILE%\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe

4. Install Android SDK Platform-Tools:
   • Via Android Studio SDK Manager
   • Standalone: https://developer.android.com/studio/releases/platform-tools`;

    super(`adb not found at path: ${adbPath}${troubleshooting}`, { cause });
    this.name = 'VideokittenAdbNotFoundError';
  }
}

/**
 * Error thrown when scrcpy tool is not found or not executable
 */
export class VideokittenScrcpyNotFoundError extends VideokittenError {
  constructor(scrcpyPath: string, cause?: Error) {
    const installInstructions = `
To install scrcpy:

• macOS: brew install scrcpy
• Linux: apt install scrcpy (Ubuntu/Debian) or snap install scrcpy
• Windows: winget install scrcpy or download from GitHub releases
• From source: https://github.com/Genymobile/scrcpy

Make sure scrcpy is in your PATH or provide the full path via scrcpyPath option.`;

    super(`scrcpy not found at path: ${scrcpyPath}${installInstructions}`, { cause });
    this.name = 'VideokittenScrcpyNotFoundError';
  }
}

/**
 * Error thrown when iOS simulator is not available
 */
export class VideokittenIOSSimulatorError extends VideokittenError {
  constructor(deviceId: string, cause?: Error) {
    super(`iOS Simulator not available or not booted: ${deviceId}`, { cause });
    this.name = 'VideokittenIOSSimulatorError';
  }
}

/**
 * Error thrown when Android device/emulator is not available
 */
export class VideokittenAndroidDeviceError extends VideokittenError {
  constructor(deviceId: string, cause?: Error) {
    super(`Android device/emulator not available: ${deviceId}`, { cause });
    this.name = 'VideokittenAndroidDeviceError';
  }
}

/**
 * Error thrown when video file cannot be written
 */
export class VideokittenFileWriteError extends VideokittenError {
  constructor(outputPath: string, cause?: Error) {
    super(`Failed to write video file: ${outputPath}`, { cause });
    this.name = 'VideokittenFileWriteError';
  }
}

/**
 * Error thrown when operation is aborted
 */
export class VideokittenOperationAbortedError extends VideokittenError {
  constructor(operation: string = 'operation') {
    super(`${operation} was aborted`);
    this.name = 'VideokittenOperationAbortedError';
  }
}

/**
 * Error thrown when video recording command fails with unknown error
 */
export class VideokittenRecordingFailedError extends VideokittenError {
  constructor(platform: 'ios' | 'android', cause?: Error) {
    super(`${platform.toUpperCase()} video recording command failed`, { cause });
    this.name = 'VideokittenRecordingFailedError';
  }
}
