// src/core/ports/FileSystem.ts

export interface FileSystem {
  /**
   * Check whether a path exists.
   */
  exists(path: string): Promise<boolean>;

  /**
   * Check whether a path is a directory.
   */
  isDirectory(path: string): Promise<boolean>;

  /**
   * Check whether a path can be accessed.
   *
   * Implementations should return false when the path exists
   * but the current process does not have sufficient access.
   */
  canAccess(path: string): Promise<boolean>;

  /**
   * Read a text file.
   */
  readFile(path: string): Promise<string>;

  /**
   * Write a text file.
   */
  writeFile(path: string, content: string): Promise<void>;

  /**
   * Create a directory.
   *
   * Implementations should create parent directories
   * when necessary.
   */
  createDirectory(path: string): Promise<void>;
}
