import { test as it, describe } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import { createAndroidOptions, type VideokittenOptionsAndroid } from './android';

describe('createAndroidOptions', () => {
  it('should return empty array for empty options', () => {
    const result = createAndroidOptions({});
    deepStrictEqual(result, []);
  });

  it('should return empty array for undefined options', () => {
    const result = createAndroidOptions();
    deepStrictEqual(result, []);
  });

  describe('base options', () => {
    it('should handle deviceId', () => {
      const result = createAndroidOptions({ deviceId: 'emulator-5554' });
      deepStrictEqual(result, ['--serial', 'emulator-5554']);
    });

    it('should handle outputPath', () => {
      const result = createAndroidOptions({ outputPath: 'video.mp4' });
      deepStrictEqual(result, ['--record', 'video.mp4']);
    });

    it('should handle timeout', () => {
      const result = createAndroidOptions({ timeout: 30 });
      deepStrictEqual(result, ['--time-limit', '30']);
    });

    it('should combine base options', () => {
      const result = createAndroidOptions({
        deviceId: 'emulator-5554',
        outputPath: 'recording.mp4',
        timeout: 60
      });
      deepStrictEqual(result, [
        '--serial', 'emulator-5554',
        '--record', 'recording.mp4',
        '--time-limit', '60'
      ]);
    });
  });

  describe('tunnel options', () => {
    it('should handle tunnel host', () => {
      const result = createAndroidOptions({
        tunnel: { host: '192.168.1.100' }
      });
      deepStrictEqual(result, ['--tunnel-host', '192.168.1.100']);
    });

    it('should handle tunnel port', () => {
      const result = createAndroidOptions({
        tunnel: { port: 5555 }
      });
      deepStrictEqual(result, ['--tunnel-port', '5555']);
    });

    it('should handle tunnel host and port', () => {
      const result = createAndroidOptions({
        tunnel: { host: 'localhost', port: 27_183 }
      });
      deepStrictEqual(result, [
        '--tunnel-host', 'localhost',
        '--tunnel-port', '27183'
      ]);
    });
  });

  describe('window options', () => {
    it('should handle window disabled', () => {
      const result = createAndroidOptions({
        window: { enabled: false }
      });
      deepStrictEqual(result, ['--no-window']);
    });

    it('should not add flag when window enabled is true', () => {
      const result = createAndroidOptions({
        window: { enabled: true }
      });
      deepStrictEqual(result, []);
    });

    it('should handle borderless window', () => {
      const result = createAndroidOptions({
        window: { borderless: true }
      });
      deepStrictEqual(result, ['--window-borderless']);
    });

    it('should handle window title', () => {
      const result = createAndroidOptions({
        window: { title: 'My Android Screen' }
      });
      deepStrictEqual(result, ['--window-title', 'My Android Screen']);
    });

    it('should handle window position and size', () => {
      const result = createAndroidOptions({
        window: { x: 100, y: 200, width: 800, height: 600 }
      });
      deepStrictEqual(result, [
        '--window-x', '100',
        '--window-y', '200',
        '--window-width', '800',
        '--window-height', '600'
      ]);
    });

    it('should handle always on top', () => {
      const result = createAndroidOptions({
        window: { alwaysOnTop: true }
      });
      deepStrictEqual(result, ['--always-on-top']);
    });

    it('should handle fullscreen', () => {
      const result = createAndroidOptions({
        window: { fullscreen: true }
      });
      deepStrictEqual(result, ['--fullscreen']);
    });

    it('should handle window: false shorthand', () => {
      const result = createAndroidOptions({
        window: false
      });
      deepStrictEqual(result, ['--no-window']);
    });

    it('should combine multiple window options', () => {
      const result = createAndroidOptions({
        window: {
          borderless: true,
          title: 'Test Window',
          alwaysOnTop: true,
          fullscreen: true
        }
      });
      deepStrictEqual(result, [
        '--window-borderless',
        '--window-title', 'Test Window',
        '--always-on-top',
        '--fullscreen'
      ]);
    });
  });

  describe('recording options', () => {
    it('should handle video bit rate', () => {
      const result = createAndroidOptions({
        recording: { bitRate: 8_000_000 }
      });
      deepStrictEqual(result, ['--video-bit-rate', '8000000']);
    });

    it('should handle video codec', () => {
      const result = createAndroidOptions({
        recording: { codec: 'h265' }
      });
      deepStrictEqual(result, ['--video-codec', 'h265']);
    });

    it('should handle record format', () => {
      const result = createAndroidOptions({
        recording: { format: 'mkv' }
      });
      deepStrictEqual(result, ['--record-format', 'mkv']);
    });

    it('should handle max size', () => {
      const result = createAndroidOptions({
        recording: { maxSize: 1920 }
      });
      deepStrictEqual(result, ['--max-size', '1920']);
    });

    it('should handle crop', () => {
      const result = createAndroidOptions({
        recording: { crop: { width: 800, height: 600, x: 100, y: 50 } }
      });
      deepStrictEqual(result, ['--crop', '800:600:100:50']);
    });

    it('should handle orientation', () => {
      const result = createAndroidOptions({
        recording: { orientation: 90 }
      });
      deepStrictEqual(result, ['--record-orientation', '90']);
    });

    it('should handle time limit', () => {
      const result = createAndroidOptions({
        recording: { timeLimit: 120 }
      });
      deepStrictEqual(result, ['--time-limit', '120']);
    });
  });

  describe('audio options', () => {
    it('should handle audio disabled', () => {
      const result = createAndroidOptions({
        audio: { enabled: false }
      });
      deepStrictEqual(result, ['--no-audio']);
    });

    it('should not add flag when audio enabled is true', () => {
      const result = createAndroidOptions({
        audio: { enabled: true }
      });
      deepStrictEqual(result, []);
    });

    it('should handle audio source', () => {
      const result = createAndroidOptions({
        audio: { source: 'mic' }
      });
      deepStrictEqual(result, ['--audio-source', 'mic']);
    });

    it('should handle audio codec', () => {
      const result = createAndroidOptions({
        audio: { codec: 'aac' }
      });
      deepStrictEqual(result, ['--audio-codec', 'aac']);
    });

    it('should handle audio bit rate', () => {
      const result = createAndroidOptions({
        audio: { bitRate: 192_000 }
      });
      deepStrictEqual(result, ['--audio-bit-rate', '192000']);
    });

    it('should handle audio buffer', () => {
      const result = createAndroidOptions({
        audio: { buffer: 100 }
      });
      deepStrictEqual(result, ['--audio-buffer', '100']);
    });

    it('should handle audio encoder', () => {
      const result = createAndroidOptions({
        audio: { encoder: 'aac_encoder' }
      });
      deepStrictEqual(result, ['--audio-encoder', 'aac_encoder']);
    });

    it('should handle audio: false shorthand', () => {
      const result = createAndroidOptions({
        audio: false
      });
      deepStrictEqual(result, ['--no-audio']);
    });
  });

  describe('debug options', () => {
    it('should handle show touches', () => {
      const result = createAndroidOptions({
        debug: { showTouches: true }
      });
      deepStrictEqual(result, ['--show-touches']);
    });

    it('should handle log level', () => {
      const result = createAndroidOptions({
        debug: { logLevel: 'debug' }
      });
      deepStrictEqual(result, ['--verbosity', 'debug']);
    });

    it('should handle print FPS', () => {
      const result = createAndroidOptions({
        debug: { printFps: true }
      });
      deepStrictEqual(result, ['--print-fps']);
    });

    it('should combine debug options', () => {
      const result = createAndroidOptions({
        debug: {
          showTouches: true,
          logLevel: 'verbose',
          printFps: true
        }
      });
      deepStrictEqual(result, [
        '--show-touches',
        '--verbosity', 'verbose',
        '--print-fps'
      ]);
    });
  });

  describe('input options', () => {
    it('should handle keyboard mode', () => {
      const result = createAndroidOptions({
        input: { keyboard: 'uhid' }
      });
      deepStrictEqual(result, ['--keyboard', 'uhid']);
    });

    it('should handle mouse mode', () => {
      const result = createAndroidOptions({
        input: { mouse: 'sdk' }
      });
      deepStrictEqual(result, ['--mouse', 'sdk']);
    });

    it('should handle raw key events', () => {
      const result = createAndroidOptions({
        input: { rawKeyEvents: true }
      });
      deepStrictEqual(result, ['--raw-key-events']);
    });

    it('should handle prefer text', () => {
      const result = createAndroidOptions({
        input: { preferText: true }
      });
      deepStrictEqual(result, ['--prefer-text']);
    });

    it('should handle shortcut modifiers', () => {
      const result = createAndroidOptions({
        input: { shortcutModifiers: ['lctrl', 'lalt'] }
      });
      deepStrictEqual(result, ['--shortcut-mod', 'lctrl,lalt']);
    });

    it('should ignore empty shortcut modifiers', () => {
      const result = createAndroidOptions({
        input: { shortcutModifiers: [] }
      });
      deepStrictEqual(result, []);
    });
  });

  describe('app options', () => {
    it('should handle start app', () => {
      const result = createAndroidOptions({
        app: { startApp: 'com.example.app' }
      });
      deepStrictEqual(result, ['--start-app', 'com.example.app']);
    });

    it('should handle start app with force stop', () => {
      const result = createAndroidOptions({
        app: { startApp: 'com.example.app', forceStop: true }
      });
      deepStrictEqual(result, ['--start-app', '+com.example.app']);
    });

    it('should handle new display as boolean', () => {
      const result = createAndroidOptions({
        app: { newDisplay: true }
      });
      deepStrictEqual(result, ['--new-display']);
    });

    it('should handle new display with dimensions', () => {
      const result = createAndroidOptions({
        app: { newDisplay: { width: 1920, height: 1080 } }
      });
      deepStrictEqual(result, ['--new-display', '1920x1080']);
    });

    it('should handle new display with dimensions and DPI', () => {
      const result = createAndroidOptions({
        app: { newDisplay: { width: 1920, height: 1080, dpi: 420 } }
      });
      deepStrictEqual(result, ['--new-display', '1920x1080/420']);
    });

    it('should handle new display with DPI only', () => {
      const result = createAndroidOptions({
        app: { newDisplay: { dpi: 240 } }
      });
      deepStrictEqual(result, ['--new-display', '/240']);
    });
  });

  describe('screen options', () => {
    it('should handle turn screen off', () => {
      const result = createAndroidOptions({
        screen: { turnOff: true }
      });
      deepStrictEqual(result, ['--turn-screen-off']);
    });

    it('should handle screen timeout', () => {
      const result = createAndroidOptions({
        screen: { timeout: 300 }
      });
      deepStrictEqual(result, ['--screen-off-timeout', '300']);
    });
  });

  describe('advanced options', () => {
    it('should handle render driver', () => {
      const result = createAndroidOptions({
        advanced: { renderDriver: 'opengl' }
      });
      deepStrictEqual(result, ['--render-driver', 'opengl']);
    });

    it('should handle video source', () => {
      const result = createAndroidOptions({
        advanced: { videoSource: 'camera' }
      });
      deepStrictEqual(result, ['--video-source', 'camera']);
    });

    it('should handle OTG mode', () => {
      const result = createAndroidOptions({
        advanced: { otg: true }
      });
      deepStrictEqual(result, ['--otg']);
    });

    it('should handle stay awake', () => {
      const result = createAndroidOptions({
        advanced: { stayAwake: true }
      });
      deepStrictEqual(result, ['--stay-awake']);
    });

    it('should handle no power on', () => {
      const result = createAndroidOptions({
        advanced: { noPowerOn: true }
      });
      deepStrictEqual(result, ['--no-power-on']);
    });

    it('should handle kill ADB on close', () => {
      const result = createAndroidOptions({
        advanced: { killAdbOnClose: true }
      });
      deepStrictEqual(result, ['--kill-adb-on-close']);
    });

    it('should handle power off on close', () => {
      const result = createAndroidOptions({
        advanced: { powerOffOnClose: true }
      });
      deepStrictEqual(result, ['--power-off-on-close']);
    });

    it('should handle disable screensaver', () => {
      const result = createAndroidOptions({
        advanced: { disableScreensaver: true }
      });
      deepStrictEqual(result, ['--disable-screensaver']);
    });

    it('should combine multiple advanced options', () => {
      const result = createAndroidOptions({
        advanced: {
          stayAwake: true,
          otg: true,
          renderDriver: 'metal'
        }
      });
      deepStrictEqual(result, [
        '--render-driver', 'metal',
        '--otg',
        '--stay-awake'
      ]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle comprehensive options', () => {
      const options: Partial<VideokittenOptionsAndroid> = {
        deviceId: 'emulator-5554',
        outputPath: 'test_recording.mp4',
        timeout: 60,
        window: { enabled: false },
        recording: {
          bitRate: 4_000_000,
          codec: 'h265',
          maxSize: 1080
        },
        audio: { enabled: false },
        debug: { showTouches: true, logLevel: 'info' },
        advanced: { stayAwake: true }
      };

      const result = createAndroidOptions(options);
      deepStrictEqual(result, [
        '--serial', 'emulator-5554',
        '--record', 'test_recording.mp4',
        '--time-limit', '60',
        '--no-window',
        '--video-bit-rate', '4000000',
        '--video-codec', 'h265',
        '--max-size', '1080',
        '--no-audio',
        '--show-touches',
        '--verbosity', 'info',
        '--stay-awake'
      ]);
    });
  });
});
