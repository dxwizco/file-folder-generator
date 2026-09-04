// src/core/reporting/ReportRenderer.ts

import type { DXWIZNode } from "../models/DXWIZNode";
import type { DXWIZResult } from "../models/DXWIZResult";

export type DXWIZRunMode = "PREVIEW" | "GENERATE" | "GENERATE_AND_OVERWRITE";

/**
 * Renders a complete File & Folder Generator execution report.
 *
 * The same report format is used for:
 * - Preview
 * - Generate
 * - Generate and Overwrite
 *
 * The report intentionally places all important summaries
 * before the file structure so the result remains useful
 * even when thousands of files are generated.
 */
export class ReportRenderer {
  public render(result: DXWIZResult, mode: DXWIZRunMode): string {
    const lines: string[] = [];

    /*
     * ============================================================
     * Header
     * ============================================================
     */

    lines.push("File & Folder Generator Execution Report");
    lines.push("==========================");
    lines.push("");

    lines.push(`Mode: ${mode}`);
    lines.push(`Status: ${result.validation.valid ? "SUCCESS" : "FAILED"}`);
    lines.push(`Target: ${result.definition.target}`);
    lines.push(
      `Validation Status: ${result.validation.valid ? "Valid" : "Invalid"}`,
    );

    /*
     * Action describes what this run did to the filesystem.
     */
    if (!result.validation.valid) {
      lines.push("Action: No filesystem changes were made");
    } else if (mode === "PREVIEW") {
      lines.push("Action: No filesystem changes were made");
    } else if (mode === "GENERATE_AND_OVERWRITE") {
      lines.push(
        "Action: Files and folders generated with existing files overwritten",
      );
    } else {
      lines.push("Action: Files and folders generated successfully");
    }

    /*
     * ============================================================
     * Plan Summary
     * ============================================================
     */

    lines.push("");
    lines.push("PLAN SUMMARY:");
    lines.push("--------------------------");
    lines.push(`Folders planned: ${result.plan.folders}`);
    lines.push(`Files planned:   ${result.plan.files}`);

    const duplicateCount = result.validation.duplicateCount ?? 0;
    lines.push(`Duplicates found:  ${duplicateCount}`);

    /*
     * ============================================================
     * Execution Summary
     * ============================================================
     *
     * Keep this immediately after the plan summary so users
     * do not need to scroll through a potentially huge tree.
     *
     * Preview and failed validation runs do not have execution
     * statistics because no filesystem operation took place.
     */

    lines.push("");
    lines.push("EXECUTION SUMMARY:");
    lines.push("--------------------------");

    if (result.execution) {
      lines.push(`Folders created: ${result.execution.folders}`);
      lines.push(`Files created:   ${result.execution.created}`);
      lines.push(`Files updated:   ${result.execution.updated}`);
      lines.push(`Files skipped:   ${result.execution.skipped}`);
    } else {
      lines.push("No filesystem changes were made.");
    }

    /*
     * ============================================================
     * Warnings
     * ============================================================
     */

    if (result.validation.warnings.length > 0) {
      lines.push("");
      lines.push("WARNINGS:");
      lines.push("--------------------------");

      for (const warning of result.validation.warnings) {
        lines.push(`  ⚠ ${warning}`);
      }
    }

    /*
     * ============================================================
     * Errors
     * ============================================================
     */

    if (result.validation.errors.length > 0) {
      lines.push("");
      lines.push("ERRORS:");
      lines.push("--------------------------");

      for (const error of result.validation.errors) {
        lines.push(`  ✖ ${error}`);
      }
    }

    /*
     * ============================================================
     * File Structure
     * ============================================================
     *
     * Render the structure as a tree instead of a flat list.
     *
     * Example:
     *
     * TestProject
     * ├── app
     * │   ├── (group)
     * │   │   └── page.tsx ✨
     * │   └── [dynamic-route]
     * │       └── page.tsx ✨
     * └── README.md ⏭
     *
     * The tree is intentionally rendered as plain text here.
     * The output file writer can wrap it in a Markdown code block.
     */

    lines.push("");
    lines.push("FILE STRUCTURE");
    lines.push("--------------------------");

    lines.push(...this.renderTree(result.nodes));

    return lines.join("\n");
  }

  /**
   * Render the DXWIZ nodes as a tree.
   *
   * DXWIZNode.depth is used to determine the nesting level.
   * The nodes are expected to already be ordered in tree/preorder
   * order by the planner.
   */
  private renderTree(nodes: DXWIZNode[]): string[] {
    if (nodes.length === 0) {
      return [];
    }

    const lines: string[] = [];

    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];

      /*
       * Root node has no tree prefix.
       */
      if (node.depth === 0) {
        lines.push(this.renderTreeNode(node));
        continue;
      }

      let prefix = "";

      /*
       * Each level between the root and the current node
       * represents an ancestor.
       *
       * Example:
       *
       * TestProject
       * ├── app
       * │   ├── testfolder
       *
       * When rendering "testfolder", the "app" ancestor
       * has another sibling ("components", "public", etc.),
       * so we need to keep the vertical │ connector.
       *
       * The important part is that we check the ancestor's
       * own depth, not the depth before it.
       */
      for (let depth = 1; depth < node.depth; depth++) {
        prefix += this.hasFollowingSiblingAtDepth(nodes, index, depth)
          ? "│   "
          : "    ";
      }

      /*
       * Add the connector for the current node.
       */
      prefix += this.isLastSibling(nodes, index) ? "└── " : "├── ";

      lines.push(`${prefix}${this.renderTreeNode(node)}`);
    }

    return lines;
  }

  /**
   * Determine whether the ancestor at the specified depth
   * has another sibling after its branch.
   *
   * This determines whether a vertical │ connector should
   * continue through that level.
   */
  private hasFollowingSiblingAtDepth(
    nodes: DXWIZNode[],
    currentIndex: number,
    depth: number,
  ): boolean {
    /*
     * Find the nearest ancestor at the requested depth
     * before the current node.
     */
    let ancestorIndex = currentIndex - 1;

    while (ancestorIndex >= 0) {
      if (nodes[ancestorIndex].depth === depth) {
        break;
      }

      ancestorIndex--;
    }

    if (ancestorIndex < 0) {
      return false;
    }

    /*
     * Look forward from the ancestor.
     *
     * If another node exists at the same depth before
     * returning to a shallower depth, that ancestor has
     * a following sibling.
     */
    for (let index = ancestorIndex + 1; index < nodes.length; index++) {
      const node = nodes[index];

      if (node.depth < depth) {
        break;
      }

      if (node.depth === depth) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determine whether a parent at the given depth has another
   * sibling after the current node's branch.
   *
   * This controls whether a vertical │ connector should continue
   * through that level.
   */
  private parentHasFollowingSibling(
    nodes: DXWIZNode[],
    currentIndex: number,
    parentDepth: number,
  ): boolean {
    /*
     * Find the nearest parent node before the current node.
     */
    let parentIndex = currentIndex - 1;

    while (parentIndex >= 0) {
      const parent = nodes[parentIndex];

      if (parent.depth === parentDepth) {
        break;
      }

      parentIndex--;
    }

    if (parentIndex < 0) {
      return false;
    }

    /*
     * Look after the parent for another node at the same
     * depth before the tree returns to a shallower level.
     */
    for (let index = parentIndex + 1; index < nodes.length; index++) {
      const node = nodes[index];

      if (node.depth < parentDepth) {
        break;
      }

      if (node.depth === parentDepth) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determine whether a node is the final sibling at its depth.
   */
  private isLastSibling(nodes: DXWIZNode[], index: number): boolean {
    const currentDepth = nodes[index].depth;

    for (let next = index + 1; next < nodes.length; next++) {
      const nextDepth = nodes[next].depth;

      /*
       * A shallower node means the current branch has ended.
       */
      if (nextDepth < currentDepth) {
        return true;
      }

      /*
       * A node at the same depth means there is another sibling.
       */
      if (nextDepth === currentDepth) {
        return false;
      }
    }

    return true;
  }

  /**
   * Render a single tree node.
   *
   * Folders are rendered without an icon.
   * Files use an action icon instead of [CREATE], [UPDATE], etc.
   */
  private renderTreeNode(node: DXWIZNode): string {
    if (node.isFolder) {
      return node.name;
    }

    return `${node.name} ${this.getActionIcon(node.action)}`;
  }

  /**
   * Return a compact visual icon for the file action.
   */
  private getActionIcon(action: DXWIZNode["action"]): string {
    switch (action) {
      case "create":
        return "✨";

      case "update":
        return "🔄";

      case "skip":
        return "⏭";

      default:
        return "";
    }
  }
}
