// src/adapters/filesystem/VSCodeFileSystem.ts

import * as vscode from "vscode";

import type { FileSystem } from "../../core/ports/FileSystem";

/**
 * VS Code implementation of the FileSystem port.
 *
 * This adapter keeps VS Code-specific filesystem APIs
 * outside of the core File & Folder Generator engine.
 */
export class VSCodeFileSystem implements FileSystem {
  /**
   * Check whether a path exists.
   */
  async exists(path: string): Promise<boolean> {
    try {
      const uri = this.toUri(path);

      await vscode.workspace.fs.stat(uri);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check whether a path is a directory.
   */

  async isDirectory(path: string): Promise<boolean> {
    try {
      const uri = this.toUri(path);

      const information = await vscode.workspace.fs.stat(uri);

      return information.type === vscode.FileType.Directory;
    } catch {
      return false;
    }
  }

  /**
   * Check whether a path can be accessed.
   */
  async canAccess(path: string): Promise<boolean> {
    try {
      const uri = this.toUri(path);

      await vscode.workspace.fs.stat(uri);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read a text file.
   */
  async readFile(path: string): Promise<string> {
    const uri = this.toUri(path);

    const data = await vscode.workspace.fs.readFile(uri);

    return Buffer.from(data).toString("utf8");
  }

  /**
   * Write a text file.
   */
  async writeFile(path: string, content: string): Promise<void> {
    const uri = this.toUri(path);

    const data = Buffer.from(content, "utf8");

    await vscode.workspace.fs.writeFile(uri, data);
  }

  /**
   * Create a directory.
   *
   * VS Code's filesystem API creates the requested directory.
   * Parent directories are created first when necessary.
   */
  async createDirectory(path: string): Promise<void> {
    const uri = this.toUri(path);

    await vscode.workspace.fs.createDirectory(uri);
  }

  /**
   * Convert a filesystem path into a VS Code URI.
   *
   * Windows paths such as:
   *
   * D:\Projects\MyProject
   *
   * are converted into:
   *
   * file:///D:/Projects/MyProject
   */
  private toUri(path: string): vscode.Uri {
    return vscode.Uri.file(path);
  }
}
