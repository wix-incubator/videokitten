import crypto from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

/**
 * Ensures the directory exists for a given file path
 * @param filePath - The file path to ensure directory for
 */
export function ensureFileDirectory(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Creates a file path for video recording - handles both files and directories
 * @param platform - The platform ('android' or 'ios')
 * @param extension - The file extension (e.g., 'mp4', 'mov')
 * @param outputPath - Optional output path (file or directory)
 * @returns A complete file path for the video
 */
export function createVideoPath(platform: 'android' | 'ios', extension: string, outputPath?: string): string {
  if (!outputPath) {
    const filename = generateVideoFilename(platform, extension);
    return path.join(os.tmpdir(), filename);
  }

  // Check if path has any extension - if it does, treat as file; if not, treat as directory
  const parsedPath = path.parse(outputPath);
  const hasExtension = parsedPath.ext.length > 0;

  if (hasExtension) {
    // Has extension - treat as file path
    return outputPath;
  } else {
    // No extension - treat as directory, generate filename inside it
    const filename = generateVideoFilename(platform, extension);
    return path.join(outputPath, filename);
  }
}

/**
 * Generates a unique video filename
 * @param platform - The platform ('android' or 'ios')
 * @param extension - The file extension (e.g., 'mp4', 'mov')
 * @returns A unique filename
 */
function generateVideoFilename(platform: 'android' | 'ios', extension: string): string {
  const timestamp = Date.now();
  const uuid = crypto.randomUUID().slice(0, 8); // Use first 8 chars of UUID for brevity
  return `${platform}-video-${timestamp}-${uuid}.${extension}`;
}
