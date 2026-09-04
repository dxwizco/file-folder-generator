// src/ core/engine/Executor.ts

import type { FileSystem } from "../ports/FileSystem";
import type { TemplateProvider } from "../ports/TemplateProvider";
import type { DXWIZNode } from "../models/DXWIZNode";
import type { DXWIZExecutionStats } from "../models/DXWIZStatistics";

/**
 * Executes the actions planned by Planner.
 *
 * Executor is responsible only for filesystem changes.
 *
 * It does not:
 * - parse Markdown
 * - validate the target
 * - validate the DXWIZ tree
 * - decide what action should happen
 *
 * Those responsibilities belong to the other core components.
 */
export class Executor {
  constructor(
    private readonly fileSystem: FileSystem,
    private readonly templateProvider: TemplateProvider,
  ) {}

  /**
   * Execute all planned DXWIZNode actions.
   */
  public async execute(
    nodes: DXWIZNode[],
    force: boolean = false,
  ): Promise<DXWIZExecutionStats> {
    const statistics: DXWIZExecutionStats = {
      folders: 0,
      created: 0,
      updated: 0,
      skipped: 0,
    };

    for (const node of nodes) {
      if (node.isFolder) {
        await this.executeFolder(node, statistics);
        continue;
      }

      await this.executeFile(node, force, statistics);
    }

    return statistics;
  }

  /**
   * Create a directory when it does not already exist.
   */
  private async executeFolder(
    node: DXWIZNode,
    statistics: DXWIZExecutionStats,
  ): Promise<void> {
    const exists = await this.fileSystem.exists(node.fullPath);

    if (!exists) {
      await this.fileSystem.createDirectory(node.fullPath);
      statistics.folders++;
    }
  }

  /**
   * Execute a file action.
   */
  private async executeFile(
    node: DXWIZNode,
    force: boolean,
    statistics: DXWIZExecutionStats,
  ): Promise<void> {
    const parentDirectory = this.getParentDirectory(node.fullPath);

    if (parentDirectory) {
      await this.fileSystem.createDirectory(parentDirectory);
    }

    const exists = await this.fileSystem.exists(node.fullPath);

    /*
     * ============================================================
     * Create
     * ============================================================
     */

    if (!exists) {
      const content = this.templateProvider.getTemplate(node.relativePath);

      await this.fileSystem.writeFile(node.fullPath, content);

      statistics.created++;

      return;
    }

    /*
     * ============================================================
     * Update
     * ============================================================
     */

    if (force) {
      const content = this.templateProvider.getTemplate(node.relativePath);

      await this.fileSystem.writeFile(node.fullPath, content);

      statistics.updated++;

      return;
    }

    /*
     * ============================================================
     * Skip
     * ============================================================
     */

    statistics.skipped++;
  }

  /**
   * Get the parent directory of a filesystem path.
   *
   * This avoids using Node.js-specific path APIs so the Executor
   * remains platform-independent.
   */
  private getParentDirectory(path: string): string | null {
    const lastForwardSlash = path.lastIndexOf("/");
    const lastBackwardSlash = path.lastIndexOf("\\");

    const separatorIndex = Math.max(lastForwardSlash, lastBackwardSlash);

    if (separatorIndex <= 0) {
      return null;
    }

    return path.substring(0, separatorIndex);
  }
}
