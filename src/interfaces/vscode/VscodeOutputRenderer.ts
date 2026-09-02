// src/interfaces/vscode/VscodeOutputRenderer.ts

import * as vscode from "vscode";

import type { ForgeResult } from "../../core/models/ForgeResult";

/**
 * Renders FileForge results inside VS Code.
 *
 * This class is responsible only for presentation.
 * It does not perform any FileForge operations.
 */
export class VscodeOutputRenderer {
  private readonly outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel("FileForge");
  }

  /**
   * Show a preview of the planned Forge operation.
   */
  public showPreview(result: ForgeResult): void {
    this.outputChannel.clear();

    this.outputChannel.appendLine("FileForge Preview");
    this.outputChannel.appendLine("=================");
    this.outputChannel.appendLine("");

    this.outputChannel.appendLine(`Target: ${result.definition.target}`);
    this.outputChannel.appendLine("");

    this.showStatistics(result);
    this.showValidation(result);
    this.showNodes(result);

    this.outputChannel.show(true);
  }

  /**
   * Show the result after execution.
   */
  public showExecution(result: ForgeResult): void {
    this.outputChannel.clear();

    this.outputChannel.appendLine("FileForge Execution");
    this.outputChannel.appendLine("==================");
    this.outputChannel.appendLine("");

    this.outputChannel.appendLine(`Target: ${result.definition.target}`);
    this.outputChannel.appendLine("");

    this.showStatistics(result);
    this.showValidation(result);
    this.showNodes(result);

    if (result.execution) {
      this.outputChannel.appendLine("");
      this.outputChannel.appendLine("Execution Statistics");
      this.outputChannel.appendLine("---------------------");
      this.outputChannel.appendLine(
        `Folders created: ${result.execution.folders}`,
      );
      this.outputChannel.appendLine(
        `Files created:   ${result.execution.created}`,
      );
      this.outputChannel.appendLine(
        `Files updated:   ${result.execution.updated}`,
      );
      this.outputChannel.appendLine(
        `Files skipped:   ${result.execution.skipped}`,
      );
    }

    this.outputChannel.show(true);
  }

  /**
   * Display validation errors and warnings.
   */
  private showValidation(result: ForgeResult): void {
    this.outputChannel.appendLine("Validation");
    this.outputChannel.appendLine("----------");

    if (result.validation.valid) {
      this.outputChannel.appendLine("Status: Valid");
    } else {
      this.outputChannel.appendLine("Status: Invalid");
    }

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
   * Display plan statistics.
   */
  private showStatistics(result: ForgeResult): void {
    this.outputChannel.appendLine("Plan Statistics");
    this.outputChannel.appendLine("---------------");
    this.outputChannel.appendLine(`Folders: ${result.plan.folders}`);
    this.outputChannel.appendLine(`Files:   ${result.plan.files}`);
    this.outputChannel.appendLine("");
  }

  /**
   * Display the planned/executed nodes.
   */
  private showNodes(result: ForgeResult): void {
    this.outputChannel.appendLine("File Structure");
    this.outputChannel.appendLine("--------------");

    if (result.nodes.length === 0) {
      this.outputChannel.appendLine("(No nodes found)");
      return;
    }

    for (const node of result.nodes) {
      const action = this.getActionLabel(node.action);

      const type = node.isFolder ? "📁" : "📄";

      this.outputChannel.appendLine(`${type} ${node.relativePath}  ${action}`);
    }

    this.outputChannel.appendLine("");
  }

  /**
   * Convert an internal ForgeAction into readable output.
   */
  private getActionLabel(action: string): string {
    switch (action) {
      case "folder":
        return "[FOLDER]";

      case "create":
        return "[CREATE]";

      case "update":
        return "[UPDATE]";

      case "skip":
        return "[SKIP]";

      case "none":
        return "[NONE]";

      default:
        return `[${action.toUpperCase()}]`;
    }
  }

  /**
   * Dispose the VS Code output channel.
   */
  public dispose(): void {
    this.outputChannel.dispose();
  }
}
