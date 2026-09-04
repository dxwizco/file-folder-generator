// src/interfaces/vscode/VscodeOutputRenderer.ts

import * as vscode from "vscode";

import type { DXWIZResult } from "../../core/models/DXWIZResult";

/**
 * Renders concise File & Folder Generator results inside VS Code.
 *
 * This class is responsible only for presentation.
 * It does not perform any File & Folder Generator operations.
 *
 * The detailed file structure is intentionally NOT rendered
 * here. It is written to the generated .output.md report by
 * ReportRenderer.
 */
export class VscodeOutputRenderer {
  private readonly outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel(
      "File & Folder Generator",
    );
  }

  /**
   * Show a concise preview result.
   *
   * The complete file structure is available in the
   * generated .output.md report.
   */
  public showPreview(result: DXWIZResult): void {
    this.outputChannel.clear();

    this.outputChannel.appendLine("File & Folder Generator Preview");
    this.outputChannel.appendLine("=================");
    this.outputChannel.appendLine("");

    this.outputChannel.appendLine("Mode: PREVIEW");
    this.outputChannel.appendLine(
      `Status: ${result.validation.valid ? "SUCCESS" : "FAILED"}`,
    );
    this.outputChannel.appendLine(`Target: ${result.definition.target}`);

    this.outputChannel.appendLine("");

    this.showPlanSummary(result);
    this.showValidation(result);
    this.showReportMessage();

    this.outputChannel.show(true);
  }

  /**
   * Show a concise execution result.
   *
   * The complete file structure is available in the
   * generated .output.md report.
   */
  public showExecution(result: DXWIZResult): void {
    this.outputChannel.clear();

    this.outputChannel.appendLine("File & Folder Generator Execution");
    this.outputChannel.appendLine("===================");
    this.outputChannel.appendLine("");

    this.outputChannel.appendLine("Mode: GENERATE");
    this.outputChannel.appendLine(
      `Status: ${result.validation.valid ? "SUCCESS" : "FAILED"}`,
    );
    this.outputChannel.appendLine(`Target: ${result.definition.target}`);

    this.outputChannel.appendLine("");

    this.showPlanSummary(result);
    this.showValidation(result);

    if (result.execution) {
      this.showExecutionSummary(result);
    } else {
      this.outputChannel.appendLine("No filesystem changes were made.");
      this.outputChannel.appendLine("");
    }

    this.showReportMessage();

    this.outputChannel.show(true);
  }

  /**
   * Display plan statistics and duplicate information.
   */
  private showPlanSummary(result: DXWIZResult): void {
    this.outputChannel.appendLine("PLAN SUMMARY");
    this.outputChannel.appendLine("------------");

    this.outputChannel.appendLine(`Folders planned:   ${result.plan.folders}`);

    this.outputChannel.appendLine(`Files planned:     ${result.plan.files}`);

    const duplicateCount = result.validation.duplicateCount ?? 0;

    this.outputChannel.appendLine(`Duplicates found:  ${duplicateCount}`);

    this.outputChannel.appendLine("");
  }

  /**
   * Display validation status, warnings, and errors.
   */
  private showValidation(result: DXWIZResult): void {
    this.outputChannel.appendLine("VALIDATION");
    this.outputChannel.appendLine("----------");

    this.outputChannel.appendLine(
      `Status: ${result.validation.valid ? "Valid" : "Invalid"}`,
    );

    if (result.validation.errors.length > 0) {
      this.outputChannel.appendLine("");
      this.outputChannel.appendLine("Errors:");

      for (const error of result.validation.errors) {
        this.outputChannel.appendLine(`  ❌ ${error}`);
      }
    }

    if (result.validation.warnings.length > 0) {
      this.outputChannel.appendLine("");
      this.outputChannel.appendLine("Warnings:");

      for (const warning of result.validation.warnings) {
        this.outputChannel.appendLine(`  ⚠ ${warning}`);
      }
    }

    this.outputChannel.appendLine("");
  }

  /**
   * Display actual filesystem execution statistics.
   */
  private showExecutionSummary(result: DXWIZResult): void {
    if (!result.execution) {
      return;
    }

    this.outputChannel.appendLine("EXECUTION SUMMARY");
    this.outputChannel.appendLine("-----------------");

    this.outputChannel.appendLine(
      `Folders created:   ${result.execution.folders}`,
    );

    this.outputChannel.appendLine(
      `Files created:     ${result.execution.created}`,
    );

    this.outputChannel.appendLine(
      `Files updated:     ${result.execution.updated}`,
    );

    this.outputChannel.appendLine(
      `Files skipped:     ${result.execution.skipped}`,
    );

    this.outputChannel.appendLine("");
  }

  /**
   * Tell the user where the detailed file structure is located.
   */
  private showReportMessage(): void {
    this.outputChannel.appendLine("DETAILED REPORT");
    this.outputChannel.appendLine("---------------");
    this.outputChannel.appendLine(
      "See the generated .output.md file for the complete file structure.",
    );

    this.outputChannel.appendLine("");
  }

  /**
   * Dispose the VS Code output channel.
   */
  public dispose(): void {
    this.outputChannel.dispose();
  }
}
