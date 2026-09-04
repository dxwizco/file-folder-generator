// src/interfaces/vscode/extension.ts

import * as path from "node:path";
import * as vscode from "vscode";

import { NodeFileSystem } from "../../adapters/filesystem/NodeFileSystem";
import { DefaultTemplateProvider } from "../../adapters/templates/DefaultTemplateProvider";
import { DXWIZEngine } from "../../core/engine/DXWIZEngine";
import {
  ReportRenderer,
  type DXWIZRunMode,
} from "../../core/reporting/ReportRenderer";
import { VscodeOutputRenderer } from "./VscodeOutputRenderer";

/**
 * File & Folder Generator VS Code extension entry point.
 *
 * This file connects VS Code with the platform-independent
 * File & Folder Generator core engine.
 */
export function activate(context: vscode.ExtensionContext): void {
  const fileSystem = new NodeFileSystem();
  const templateProvider = new DefaultTemplateProvider();

  const engine = new DXWIZEngine(fileSystem, templateProvider);
  const outputRenderer = new VscodeOutputRenderer();
  const reportRenderer = new ReportRenderer();

  /**
   * Get the active Markdown document.
   */
  function getActiveMarkdownDocument(): vscode.TextDocument | undefined {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage(
        "File & Folder Generator: No active editor found. Please open a DXWIZ Markdown definition.",
      );

      return undefined;
    }

    if (editor.document.languageId !== "markdown") {
      vscode.window.showErrorMessage(
        "File & Folder Generator: Please run this command from a Markdown file.",
      );

      return undefined;
    }

    return editor.document;
  }

  /**
   * Write the complete report to <definition>.output.md
   * and open it beside the definition document.
   *
   * The report is formatted specifically for Markdown so
   * the FILE STRUCTURE tree keeps its exact visual layout.
   */
  async function writeReport(
    document: vscode.TextDocument,
    report: string,
  ): Promise<void> {
    const outputPath = path.join(
      path.dirname(document.uri.fsPath),
      `${path.basename(
        document.uri.fsPath,
        path.extname(document.uri.fsPath),
      )}.output.md`,
    );

    const outputUri = vscode.Uri.file(outputPath);

    /*
     * Format the rendered report for Markdown.
     *
     * Only the FILE STRUCTURE tree is wrapped in a
     * fenced code block. The rest of the report remains
     * normal Markdown/text.
     */
    const markdownReport = formatReportForMarkdown(report);

    /*
     * Always overwrite the previous report.
     */
    await vscode.workspace.fs.writeFile(
      outputUri,
      Buffer.from(markdownReport, "utf8"),
    );

    /*
     * Open the report beside the definition file.
     */
    const reportDocument = await vscode.workspace.openTextDocument(outputUri);

    await vscode.window.showTextDocument(reportDocument, {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: true,
      preview: false,
    });
  }

  /**
   * Convert the rendered report into Markdown suitable
   * for the .output.md file.
   *
   * Only the FILE STRUCTURE section's tree is placed
   * inside a fenced code block.
   *
   * This preserves tree characters such as:
   *
   * ├──
   * └──
   * │
   *
   * without Markdown changing their appearance.
   */
  function formatReportForMarkdown(report: string): string {
    const marker = "FILE STRUCTURE\n--------------------------";

    const structureIndex = report.indexOf(marker);

    /*
     * If the marker is not found, return the report
     * unchanged rather than modifying the report unexpectedly.
     */
    if (structureIndex === -1) {
      return report;
    }

    const beforeStructure = report.slice(0, structureIndex);

    const structure = report.slice(structureIndex + marker.length);

    return [
      beforeStructure.trimEnd(),
      "",
      marker,
      "",
      "```text",
      structure.trim(),
      "```",
      "",
    ].join("\n");
  }

  /**
   * Run a File & Folder Generator command.
   */

  async function runFileFolderGenerator(
    mode: DXWIZRunMode,
    execute: boolean,
    force: boolean,
  ): Promise<void> {
    const document = getActiveMarkdownDocument();

    if (!document) {
      return;
    }

    try {
      const content = document.getText();

      const result = await engine.run(content, {
        execute,
        force,
      });

      /*
       * Keep the VS Code Output panel concise.
       *
       * The complete report, including the full file tree,
       * is written to the .output.md file below.
       */
      if (execute) {
        outputRenderer.showExecution(result);
      } else {
        outputRenderer.showPreview(result);
      }

      /*
       * Render the complete report for the .output.md file.
       */
      const report = reportRenderer.render(result, mode);

      await writeReport(document, report);

      /*
       * Validation errors are reported in the output file.
       * Keep the VS Code notification concise and point the
       * user to the detailed report.
       */
      if (!result.validation.valid) {
        vscode.window.showErrorMessage(
          "File & Folder Generator: Validation failed. Please check the output report.",
        );
        return;
      }

      /*
       * Successful execution summary.
       */
      if (execute && result.execution) {
        vscode.window.showInformationMessage(
          `File & Folder Generator: Generation complete. Created ${result.execution.created} file(s), updated ${result.execution.updated}, and skipped ${result.execution.skipped}.`,
        );
      } else {
        vscode.window.showInformationMessage(
          "File & Folder Generator: Preview complete. No filesystem changes were made.",
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      /*
       * Keep errors concise in the notification.
       */
      vscode.window.showErrorMessage(
        `File & Folder Generator: ${message}. Please check the output report.`,
      );
    }
  }

  /*
   * ============================================================
   * File & Folder Generator: Preview
   * ============================================================
   */
  const previewCommand = vscode.commands.registerCommand(
    "dxwiz.preview",
    async () => {
      await runFileFolderGenerator("PREVIEW", false, false);
    },
  );

  /*
   * ============================================================
   * File & Folder Generator: Generate
   * ============================================================
   */
  const generateCommand = vscode.commands.registerCommand(
    "dxwiz.generate",
    async () => {
      await runFileFolderGenerator("GENERATE", true, false);
    },
  );

  /*
   * ============================================================
   * File & Folder Generator: Generate and Overwrite
   * ============================================================
   */
  const generateAndOverwriteCommand = vscode.commands.registerCommand(
    "dxwiz.generateAndOverwrite",
    async () => {
      const document = getActiveMarkdownDocument();

      if (!document) {
        return;
      }

      const confirmation = await vscode.window.showWarningMessage(
        "File & Folder Generator: Generate and Overwrite will overwrite all existing files that are part of this definition. Existing file contents may be replaced by templates. Do you want to continue?",

        {
          modal: true,
        },
        "Overwrite",
        "Cancel",
      );

      if (confirmation !== "Overwrite") {
        return;
      }

      /*
       * Reuse the same active document after confirmation.
       */
      try {
        const content = document.getText();

        const result = await engine.run(content, {
          execute: true,
          force: true,
        });

        /*
         * Keep the VS Code Output panel concise.
         *
         * The complete report, including the full file tree,
         * is written to the .output.md file below.
         */
        outputRenderer.showExecution(result);

        /*
         * Render the complete report for the .output.md file.
         */
        const report = reportRenderer.render(result, "GENERATE_AND_OVERWRITE");

        await writeReport(document, report);

        /*
         * Validation errors are reported in the output file.
         */
        if (!result.validation.valid) {
          vscode.window.showErrorMessage(
            "File & Folder Generator: Validation failed. Please check the output report.",
          );
          return;
        }

        /*
         * Successful execution summary.
         */
        if (result.execution) {
          vscode.window.showInformationMessage(
            `File & Folder Generator: Generation complete. Created ${result.execution.created} file(s), updated ${result.execution.updated}, and skipped ${result.execution.skipped}.`,
          );
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        vscode.window.showErrorMessage(
          `File & Folder Generator: ${message}. Please check the output report.`,
        );
      }
    },
  );

  /*
   * Register all File & Folder Generator commands.
   */
  context.subscriptions.push(
    previewCommand,
    generateCommand,
    generateAndOverwriteCommand,
  );

  /*
   * Dispose the output renderer when the extension
   * is deactivated.
   */
  context.subscriptions.push({
    dispose: () => {
      outputRenderer.dispose();
    },
  });
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  // No additional cleanup is currently required.
}
