// src/core/engine/TargetValidator.ts

import type { FileSystem } from "../ports/FileSystem";

/**
 * Validates a FileForge target directory.
 *
 * This class is filesystem-aware but platform-independent.
 * It relies only on the FileSystem port.
 */
export class TargetValidator {
  constructor(private readonly fileSystem: FileSystem) {}

  /**
   * Validate that the target:
   *
   * - is not empty
   * - exists
   * - is accessible
   * - is a directory
   */
  async validate(target: string): Promise<void> {
    const normalizedTarget = target.trim();

    if (!normalizedTarget) {
      throw new Error(
        "Target path cannot be empty. Please provide a valid directory path.",
      );
    }

    const exists = await this.fileSystem.exists(normalizedTarget);

    if (!exists) {
      throw new Error(
        `Target directory does not exist:\n\n${normalizedTarget}\n\nPlease verify that the path is correct.`,
      );
    }

    const accessible = await this.fileSystem.canAccess(normalizedTarget);

    if (!accessible) {
      throw new Error(
        `Target directory cannot be accessed:\n\n${normalizedTarget}\n\nPlease check that the directory exists and that you have permission to access it.`,
      );
    }

    const directory = await this.fileSystem.isDirectory(normalizedTarget);

    if (!directory) {
      throw new Error(
        `Target path is not a directory:\n\n${normalizedTarget}\n\nPlease provide a directory path.`,
      );
    }
  }
}
