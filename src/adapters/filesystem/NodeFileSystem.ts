// src/adapters/filesystem/NodeFileSystem.ts

import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import type { FileSystem } from "../../core/ports/FileSystem";

export class NodeFileSystem implements FileSystem {
  async exists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  async isDirectory(path: string): Promise<boolean> {
    try {
      const information = await stat(path);
      return information.isDirectory();
    } catch {
      return false;
    }
  }

  async canAccess(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  async readFile(path: string): Promise<string> {
    return readFile(path, "utf8");
  }

  async writeFile(path: string, content: string): Promise<void> {
    await writeFile(path, content, "utf8");
  }

  async createDirectory(path: string): Promise<void> {
    await mkdir(path, {
      recursive: true,
    });
  }
}
