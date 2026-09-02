// src/core/reporting/ReportRenderer.ts

import type { ForgeNode } from "../models/ForgeNode";
import type { ForgeResult } from "../models/ForgeResult";

export type ForgeRunMode = "PREVIEW" | "GENERATE" | "GENERATE_AND_OVERWRITE";

/**
 * Renders a complete FileForge execution report.
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
  public render(result: ForgeResult, mode: ForgeRunMode): string {
    const lines: string[] = [];

    /*
     * ============================================================
     * Header
     * ============================================================
     */

    lines.push("FileForge Execution Report");
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
     * Full File Structure
     * ============================================================
     *
     * This intentionally comes after all summaries.
     * The tree may contain thousands of lines.
     */

    lines.push("");
    lines.push("FILE STRUCTURE");
    lines.push("--------------------------");

    for (const node of result.nodes) {
      lines.push(this.renderNode(node));
    }

    return lines.join("\n");
  }

  /**
   * Render one node from the FileForge tree.
   */
  private renderNode(node: ForgeNode): string {
    const icon = node.isFolder ? "📁" : "📄";

    if (node.isFolder) {
      return `${icon} ${node.relativePath}  [FOLDER]`;
    }

    const action = node.action.toUpperCase();

    return `${icon} ${node.relativePath}  [${action}]`;
  }
}

// // === src/core/reporting/ReportRenderer.ts

// import type { ForgeNode } from "../models/ForgeNode";
// import type { ForgeResult } from "../models/ForgeResult";

// export type ForgeRunMode = "PREVIEW" | "GENERATE" | "GENERATE_AND_OVERWRITE";

// /**
//  * Renders a complete FileForge execution report.
//  *
//  * The same report format is used for:
//  * - Preview
//  * - Generate
//  * - Generate and Overwrite
//  */
// export class ReportRenderer {
//   public render(result: ForgeResult, mode: ForgeRunMode): string {
//     const lines: string[] = [];

//     lines.push("FileForge Execution");
//     lines.push("==================");
//     lines.push("");

//     lines.push(`Target: ${result.definition.target}`);
//     lines.push("");

//     lines.push("Plan Statistics");
//     lines.push("---------------");
//     lines.push(`Folders: ${result.plan.folders}`);
//     lines.push(`Files:   ${result.plan.files}`);
//     lines.push("");

//     lines.push("Validation");
//     lines.push("----------");
//     lines.push(`Status: ${result.validation.valid ? "Valid" : "Invalid"}`);

//     if (result.validation.warnings.length > 0) {
//       lines.push("");
//       lines.push("Warnings:");

//       for (const warning of result.validation.warnings) {
//         lines.push(`  ⚠ ${warning}`);
//       }
//     }

//     if (result.validation.errors.length > 0) {
//       lines.push("");
//       lines.push("Errors:");

//       for (const error of result.validation.errors) {
//         lines.push(`  ✖ ${error}`);
//       }
//     }

//     lines.push("");

//     lines.push("File Structure");
//     lines.push("--------------");

//     for (const node of result.nodes) {
//       lines.push(this.renderNode(node));
//     }

//     /*
//      * Keep execution statistics only when an actual
//      * execution result exists.
//      *
//      * Preview must not invent filesystem statistics.
//      */
//     if (result.execution) {
//       lines.push("");
//       lines.push("Execution Statistics");
//       lines.push("---------------------");
//       lines.push(`Folders created: ${result.execution.folders}`);
//       lines.push(`Files created:   ${result.execution.created}`);
//       lines.push(`Files updated:   ${result.execution.updated}`);
//       lines.push(`Files skipped:   ${result.execution.skipped}`);
//     } else if (mode === "PREVIEW") {
//       lines.push("");
//       lines.push("No filesystem changes were made.");
//     }

//     lines.push("");
//     lines.push("=========================");
//     lines.push(" FileForge Summary");
//     lines.push("=========================");
//     lines.push("");

//     lines.push(`Mode: ${mode}`);
//     lines.push(`Status: ${result.validation.valid ? "SUCCESS" : "FAILED"}`);
//     lines.push("");

//     lines.push(`Folders planned: ${result.plan.folders}`);
//     lines.push(`Files planned:   ${result.plan.files}`);

//     const duplicateCount = result.validation.duplicateCount ?? 0;
//     lines.push(`Duplicates found:  ${duplicateCount}`);

//     return lines.join("\n");
//   }

//   private renderNode(node: ForgeNode): string {
//     const icon = node.isFolder ? "📁" : "📄";

//     if (node.isFolder) {
//       return `${icon} ${node.relativePath}  [FOLDER]`;
//     }

//     const action = node.action.toUpperCase();

//     return `${icon} ${node.relativePath}  [${action}]`;
//   }
// }
