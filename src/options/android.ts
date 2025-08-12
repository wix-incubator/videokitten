import type { VideokittenOptionsBase } from './base';

/** Android-specific video recording options */
export interface VideokittenOptionsAndroid extends VideokittenOptionsBase {
  /** Platform identifier */
  platform: 'android';
  /** Path to adb executable */
  adbPath?: string;
  /** Path to scrcpy executable */
  scrcpyPath?: string;

  /** Network tunnel configuration for scrcpy */
  tunnel?: ScrcpyTunnelOptions;

  /** Window display configuration for scrcpy */
  window?: false | ScrcpyWindowOptions;

  /** Video recording configuration */
  recording?: ScrcpyVideoRecordingOptions;

  /** Audio recording configuration for scrcpy */
  audio?: false | ScrcpyAudioOptions;

  /** Debug and overlay configuration */
  debug?: ScrcpyDebugOptions;

  /** Input simulation configuration for scrcpy */
  input?: ScrcpyInputOptions;

  /** Android app management */
  app?: ScrcpyAppOptions;

  /** Screen management configuration */
  screen?: ScrcpyScreenOptions;

  /** Advanced scrcpy configuration options */
  advanced?: ScrcpyAdvancedOptions;
}

/** Network tunnel configuration for scrcpy remote device connections */
export interface ScrcpyTunnelOptions {
  /**
   * Set the IP address of the adb tunnel to reach the scrcpy server.
   * This option automatically enables --force-adb-forward.
   * @default "localhost"
   */
  host?: string;
  /**
   * Set the TCP port of the adb tunnel to reach the scrcpy server.
   * This option automatically enables --force-adb-forward.
   * @default 0 (not forced): the local port used for establishing the tunnel will be used
   */
  port?: number;
}

/** Window display configuration for scrcpy video recording */
export interface ScrcpyWindowOptions {
  /**
   * Enable/disable scrcpy window. When disabled, implies --no-video-playback.
   * Maps to --no-window when false
   */
  enabled?: boolean;
  /**
   * Disable window decorations (display borderless window).
   * Maps to --window-borderless
   */
  borderless?: boolean;
  /**
   * Set a custom window title.
   * Maps to --window-title
   */
  title?: string;
  /**
   * Set the initial window horizontal position.
   * Maps to --window-x
   * @default "auto"
   */
  x?: number;
  /**
   * Set the initial window vertical position.
   * Maps to --window-y
   * @default "auto"
   */
  y?: number;
  /**
   * Set the initial window width.
   * Maps to --window-width
   * @default 0 (automatic)
   */
  width?: number;
  /**
   * Set the initial window height.
   * Maps to --window-height
   * @default 0 (automatic)
   */
  height?: number;
  /**
   * Make scrcpy window always on top (above other windows).
   * Maps to --always-on-top
   */
  alwaysOnTop?: boolean;
  /**
   * Start in fullscreen.
   * Maps to -f, --fullscreen
   */
  fullscreen?: boolean;
}

/** Video recording quality and format configuration */
export interface ScrcpyVideoRecordingOptions {
  /**
   * Encode the video at the given bit rate, expressed in bits/s.
   * Unit suffixes are supported: 'K' (x1000) and 'M' (x1000000).
   * Maps to -b, --video-bit-rate
   * @default 8M (8000000)
   */
  bitRate?: number;
  /**
   * Select a video codec.
   * Maps to --video-codec
   * @default "h264"
   */
  codec?: 'h264' | 'h265' | 'av1';
  /**
   * Force recording format.
   * Maps to --record-format
   */
  format?: 'mp4' | 'mkv' | 'm4a' | 'mka' | 'opus' | 'aac' | 'flac' | 'wav';

  /**
   * Limit both the width and height of the video to value. The other dimension is computed so that the device aspect-ratio is preserved.
   * Maps to -m, --max-size
   * @default 0 (unlimited)
   */
  maxSize?: number;

  /**
   * Crop the device screen on the server.
   * The values are expressed in the device natural orientation (typically, portrait for a phone, landscape for a tablet).
   * Maps to --crop=width:height:x:y
   */
  crop?: {
    /** Crop width */
    width: number;
    /** Crop height */
    height: number;
    /** Crop X offset */
    x: number;
    /** Crop Y offset */
    y: number;
  };

  /**
   * Set the record orientation. The number represents the clockwise rotation in degrees.
   * Maps to --record-orientation or --orientation
   * @default 0
   */
  orientation?: 0 | 90 | 180 | 270;

  /**
   * Set the maximum mirroring time, in seconds.
   * Maps to --time-limit
   */
  timeLimit?: number;
}

/** Audio recording configuration for scrcpy */
export interface ScrcpyAudioOptions {
  /**
   * Enable/disable audio forwarding.
   * Maps to --no-audio when false
   */
  enabled?: boolean;
  /**
   * Select the audio source.
   * Maps to --audio-source
   * @default "output"
   */
  source?: 'output' | 'playback' | 'mic' | 'mic-unprocessed' | 'mic-camcorder' | 'mic-voice-recognition' | 'mic-voice-communication' | 'voice-call' | 'voice-call-uplink' | 'voice-call-downlink' | 'voice-performance';
  /**
   * Select an audio codec.
   * Maps to --audio-codec
   * @default "opus"
   */
  codec?: 'opus' | 'aac' | 'flac' | 'raw';
  /**
   * Encode the audio at the given bit rate, expressed in bits/s.
   * Unit suffixes are supported: 'K' (x1000) and 'M' (x1000000).
   * Maps to --audio-bit-rate
   * @default 128K (128000)
   */
  bitRate?: number;
  /**
   * Configure the audio buffering delay (in milliseconds).
   * Lower values decrease the latency, but increase the likelihood of buffer underrun (causing audio glitches).
   * Maps to --audio-buffer
   * @default 50
   */
  buffer?: number;
  /**
   * Use a specific MediaCodec audio encoder (depending on the codec provided by --audio-codec).
   * The available encoders can be listed by --list-encoders.
   * Maps to --audio-encoder
   */
  encoder?: string;
}

/** Debug and logging configuration for scrcpy */
export interface ScrcpyDebugOptions {
  /**
   * Enable "show touches" on start, restore the initial value on exit.
   * It only shows physical touches (not clicks from scrcpy).
   * Maps to -t, --show-touches
   */
  showTouches?: boolean;
  /**
   * Set the log level.
   * Maps to -V, --verbosity
   * @default "info"
   */
  logLevel?: 'verbose' | 'debug' | 'info' | 'warn' | 'error';
  /**
   * Start FPS counter, to print framerate logs to the console.
   * It can be started or stopped at any time with MOD+i.
   * Maps to --print-fps
   */
  printFps?: boolean;
}

/** Input simulation configuration for scrcpy */
export interface ScrcpyInputOptions {
  /**
   * Select how to send keyboard inputs to the device.
   * Possible values are "disabled", "sdk", "uhid" and "aoa".
   * Maps to --keyboard
   */
  keyboard?: 'disabled' | 'sdk' | 'uhid' | 'aoa';
  /**
   * Select how to send mouse inputs to the device.
   * Possible values are "disabled", "sdk", "uhid" and "aoa".
   * Maps to --mouse
   */
  mouse?: 'disabled' | 'sdk' | 'uhid' | 'aoa';
  /**
   * Inject key events for all input keys, and ignore text events.
   * Maps to --raw-key-events
   */
  rawKeyEvents?: boolean;
  /**
   * Inject alpha characters and space as text events instead of key events.
   * This avoids issues when combining multiple keys to enter a special character,
   * but breaks the expected behavior of alpha keys in games (typically WASD).
   * Maps to --prefer-text
   */
  preferText?: boolean;
  /**
   * Specify the modifiers to use for scrcpy shortcuts.
   * Possible keys are "lctrl", "rctrl", "lalt", "ralt", "lsuper" and "rsuper".
   * Several shortcut modifiers can be specified.
   * Maps to --shortcut-mod
   * @default ["lalt", "lsuper"] (left-Alt or left-Super)
   */
  shortcutModifiers?: string[];
}

/** Android app management configuration for scrcpy */
export interface ScrcpyAppOptions {
  /**
   * Package name of app to start.
   * Maps to --start-app
   */
  startApp?: string;
  /**
   * Force stop app before starting (use '+' prefix).
   * Maps to --start-app=+package
   */
  forceStop?: boolean;
  /**
   * Create a new display with specified resolution and density.
   * Maps to --new-display
   */
  newDisplay?: boolean | { width?: number; height?: number; dpi?: number };
}

/** Android screen management configuration for scrcpy */
export interface ScrcpyScreenOptions {
  /**
   * Turn the device screen off immediately.
   * Maps to -S, --turn-screen-off
   */
  turnOff?: boolean;
  /**
   * Set the screen off timeout while scrcpy is running (restore the initial value on exit).
   * Maps to --screen-off-timeout
   */
  timeout?: number;
}

/** Advanced scrcpy configuration options */
export interface ScrcpyAdvancedOptions {
  /**
   * Request SDL to use the given render driver (this is just a hint).
   * Supported names are currently "direct3d", "opengl", "opengles2", "opengles", "metal" and "software".
   * Maps to --render-driver
   */
  renderDriver?: 'direct3d' | 'opengl' | 'opengles2' | 'opengles' | 'metal' | 'software';
  /**
   * Select the video source.
   * Camera mirroring requires Android 12+.
   * Maps to --video-source
   * @default "display"
   */
  videoSource?: 'display' | 'camera';
  /**
   * Run in OTG mode: simulate physical keyboard and mouse, as if the computer keyboard and mouse were plugged directly to the device via an OTG cable.
   * In this mode, adb (USB debugging) is not necessary, and mirroring is disabled.
   * Maps to --otg
   */
  otg?: boolean;
  /**
   * Keep the device on while scrcpy is running, when the device is plugged in.
   * Maps to -w, --stay-awake
   */
  stayAwake?: boolean;
  /**
   * Do not power on the device on start.
   * Maps to --no-power-on when true
   */
  noPowerOn?: boolean;
  /**
   * Kill adb when scrcpy terminates.
   * Maps to --kill-adb-on-close
   */
  killAdbOnClose?: boolean;
  /**
   * Power off the device screen when closing scrcpy.
   * Maps to --power-off-on-close
   */
  powerOffOnClose?: boolean;
  /**
   * Disable screensaver while scrcpy is running.
   * Maps to --disable-screensaver
   */
  disableScreensaver?: boolean;
}

/**
 * Creates scrcpy command line arguments from Android options
 * @param options Android-specific video recording options
 * @returns Array of command line arguments for scrcpy
 */
export function createAndroidOptions(options: Partial<VideokittenOptionsAndroid> = {}): string[] {
  const args: string[] = [];

  // Base options
  if (options.deviceId) {
    args.push('--serial', options.deviceId);
  }

  if (options.outputPath) {
    args.push('--record', options.outputPath);
  }

  // Use unified timeout from base options as the scrcpy time-limit
  if (options.timeout !== undefined) {
    args.push('--time-limit', options.timeout.toString());
  }

  // Tunnel options
  if (options.tunnel) {
    if (options.tunnel.host) {
      args.push('--tunnel-host', options.tunnel.host);
    }
    if (options.tunnel.port !== undefined) {
      args.push('--tunnel-port', options.tunnel.port.toString());
    }
  }

  // Window options
  if (options.window) {
    if (options.window.enabled === false) {
      args.push('--no-window');
    }
    if (options.window.borderless) {
      args.push('--window-borderless');
    }
    if (options.window.title) {
      args.push('--window-title', options.window.title);
    }
    if (options.window.x !== undefined) {
      args.push('--window-x', options.window.x.toString());
    }
    if (options.window.y !== undefined) {
      args.push('--window-y', options.window.y.toString());
    }
    if (options.window.width !== undefined) {
      args.push('--window-width', options.window.width.toString());
    }
    if (options.window.height !== undefined) {
      args.push('--window-height', options.window.height.toString());
    }
    if (options.window.alwaysOnTop) {
      args.push('--always-on-top');
    }
    if (options.window.fullscreen) {
      args.push('--fullscreen');
    }
  } else if (options.window === false) {
    args.push('--no-window');
  }

  // Video recording options
  if (options.recording) {
    if (options.recording.bitRate !== undefined) {
      args.push('--video-bit-rate', options.recording.bitRate.toString());
    }
    if (options.recording.codec) {
      args.push('--video-codec', options.recording.codec);
    }
    if (options.recording.format) {
      args.push('--record-format', options.recording.format);
    }
    if (options.recording.maxSize !== undefined) {
      args.push('--max-size', options.recording.maxSize.toString());
    }
    if (options.recording.crop) {
      const { width, height, x, y } = options.recording.crop;
      args.push('--crop', `${width}:${height}:${x}:${y}`);
    }
    if (options.recording.orientation !== undefined) {
      args.push('--record-orientation', options.recording.orientation.toString());
    }
    // Do not pass duplicate time limit if base timeout is provided
    if (options.recording.timeLimit !== undefined && options.timeout === undefined) {
      args.push('--time-limit', options.recording.timeLimit.toString());
    }
  }

  // Audio options
  if (options.audio) {
    if (options.audio.enabled === false) {
      args.push('--no-audio');
    }
    if (options.audio.source) {
      args.push('--audio-source', options.audio.source);
    }
    if (options.audio.codec) {
      args.push('--audio-codec', options.audio.codec);
    }
    if (options.audio.bitRate !== undefined) {
      args.push('--audio-bit-rate', options.audio.bitRate.toString());
    }
    if (options.audio.buffer !== undefined) {
      args.push('--audio-buffer', options.audio.buffer.toString());
    }
    if (options.audio.encoder) {
      args.push('--audio-encoder', options.audio.encoder);
    }
  } else if (options.audio === false) {
    args.push('--no-audio');
  }

  // Debug options
  if (options.debug) {
    if (options.debug.showTouches) {
      args.push('--show-touches');
    }
    if (options.debug.logLevel) {
      args.push('--verbosity', options.debug.logLevel);
    }
    if (options.debug.printFps) {
      args.push('--print-fps');
    }
  }

  // Input options
  if (options.input) {
    if (options.input.keyboard) {
      args.push('--keyboard', options.input.keyboard);
    }
    if (options.input.mouse) {
      args.push('--mouse', options.input.mouse);
    }
    if (options.input.rawKeyEvents) {
      args.push('--raw-key-events');
    }
    if (options.input.preferText) {
      args.push('--prefer-text');
    }
    if (options.input.shortcutModifiers && options.input.shortcutModifiers.length > 0) {
      args.push('--shortcut-mod', options.input.shortcutModifiers.join(','));
    }
  }

  // App options
  if (options.app) {
    if (options.app.startApp) {
      const prefix = options.app.forceStop ? '+' : '';
      args.push('--start-app', `${prefix}${options.app.startApp}`);
    }
    if (options.app.newDisplay) {
      if (typeof options.app.newDisplay === 'boolean' && options.app.newDisplay) {
        args.push('--new-display');
      } else if (typeof options.app.newDisplay === 'object') {
        let displayValue = '';
        if (options.app.newDisplay.width && options.app.newDisplay.height) {
          displayValue = `${options.app.newDisplay.width}x${options.app.newDisplay.height}`;
        }
        if (options.app.newDisplay.dpi) {
          displayValue += `/${options.app.newDisplay.dpi}`;
        }
        if (displayValue) {
          args.push('--new-display', displayValue);
        } else {
          args.push('--new-display');
        }
      }
    }
  }

  // Screen options
  if (options.screen) {
    if (options.screen.turnOff) {
      args.push('--turn-screen-off');
    }
    if (options.screen.timeout !== undefined) {
      args.push('--screen-off-timeout', options.screen.timeout.toString());
    }
  }

  // Advanced options
  if (options.advanced) {
    if (options.advanced.renderDriver) {
      args.push('--render-driver', options.advanced.renderDriver);
    }
    if (options.advanced.videoSource) {
      args.push('--video-source', options.advanced.videoSource);
    }
    if (options.advanced.otg) {
      args.push('--otg');
    }
    if (options.advanced.stayAwake) {
      args.push('--stay-awake');
    }
    if (options.advanced.noPowerOn) {
      args.push('--no-power-on');
    }
    if (options.advanced.killAdbOnClose) {
      args.push('--kill-adb-on-close');
    }
    if (options.advanced.powerOffOnClose) {
      args.push('--power-off-on-close');
    }
    if (options.advanced.disableScreensaver) {
      args.push('--disable-screensaver');
    }
  }

  return args;
}
