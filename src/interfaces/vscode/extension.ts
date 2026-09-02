// src/interfaces/vscode/extension.ts

import * as path from "node:path";
import * as vscode from "vscode";

import { NodeFileSystem } from "../../adapters/filesystem/NodeFileSystem";
import { DefaultTemplateProvider } from "../../adapters/templates/DefaultTemplateProvider";
import { ForgeEngine } from "../../core/engine/ForgeEngine";
import {
  ReportRenderer,
  type ForgeRunMode,
} from "../../core/reporting/ReportRenderer";
import { VscodeOutputRenderer } from "./VscodeOutputRenderer";

/**
 * FileForge VS Code extension entry point.
 *
 * This file connects VS Code with the platform-independent
 * FileForge core engine.
 */
export function activate(context: vscode.ExtensionContext): void {
  const fileSystem = new NodeFileSystem();
  const templateProvider = new DefaultTemplateProvider();

  const engine = new ForgeEngine(fileSystem, templateProvider);
  const outputRenderer = new VscodeOutputRenderer();
  const reportRenderer = new ReportRenderer();

  /**
   * Get the active Markdown document.
   */
  function getActiveMarkdownDocument(): vscode.TextDocument | undefined {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage(
        "FileForge: No active editor found. Please open a FileForge Markdown definition.",
      );

      return undefined;
    }

    if (editor.document.languageId !== "markdown") {
      vscode.window.showErrorMessage(
        "FileForge: Please run this command from a Markdown file.",
      );

      return undefined;
    }

    return editor.document;
  }

  /**
   * Write the complete report to <definition>.output.md
   * and open it beside the definition document.
   */
  async function writeReport(
    document: vscode.TextDocument,
    report: string,
  ): Promise<void> {
    const outputPath = path.join(
      path.dirname(document.uri.fsPath),
      `${path.basename(document.uri.fsPath, path.extname(document.uri.fsPath))}.output.md`,
    );

    const outputUri = vscode.Uri.file(outputPath);

    /*
     * Always overwrite the previous report.
     */
    await vscode.workspace.fs.writeFile(outputUri, Buffer.from(report, "utf8"));

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
   * Run a FileForge command.
   */
  async function runFileForge(
    mode: ForgeRunMode,
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
       * Keep the existing concise VS Code Output panel.
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
       * Keep the VS Code notification concise and point the user
       * to the detailed report.
       */
      if (!result.validation.valid) {
        vscode.window.showErrorMessage(
          "FileForge: Validation failed. Please check the FileForge output report.",
        );
        return;
      }

      /*
       * Successful execution summary.
       */
      if (execute && result.execution) {
        vscode.window.showInformationMessage(
          `FileForge: Generation complete. Created ${result.execution.created} file(s), updated ${result.execution.updated}, and skipped ${result.execution.skipped}.`,
        );
      } else {
        vscode.window.showInformationMessage(
          "FileForge: Preview complete. No filesystem changes were made.",
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      /*
       * Keep errors concise in the notification.
       * The detailed error is also written to the report when
       * the engine returns a validation result.
       */
      vscode.window.showErrorMessage(
        `FileForge: ${message}. Please check the FileForge output report.`,
      );
    }
  }

  /*
   * ============================================================
   * FileForge: Preview
   * ============================================================
   */
  const previewCommand = vscode.commands.registerCommand(
    "fileforge.preview",
    async () => {
      await runFileForge("PREVIEW", false, false);
    },
  );

  /*
   * ============================================================
   * FileForge: Generate
   * ============================================================
   */
  const generateCommand = vscode.commands.registerCommand(
    "fileforge.generate",
    async () => {
      await runFileForge("GENERATE", true, false);
    },
  );

  /*
   * ============================================================
   * FileForge: Generate and Overwrite
   * ============================================================
   */
  const generateAndOverwriteCommand = vscode.commands.registerCommand(
    "fileforge.generateAndOverwrite",
    async () => {
      const document = getActiveMarkdownDocument();

      if (!document) {
        return;
      }

      const confirmation = await vscode.window.showWarningMessage(
        "FileForge: Generate and Overwrite will overwrite all existing files that are part of this definition. Existing file contents may be replaced by templates. Do you want to continue?",
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

        outputRenderer.showExecution(result);

        const report = reportRenderer.render(result, "GENERATE_AND_OVERWRITE");

        await writeReport(document, report);

        if (!result.validation.valid) {
          vscode.window.showErrorMessage(
            "FileForge: Validation failed. Please check the FileForge output report.",
          );
          return;
        }

        if (result.execution) {
          vscode.window.showInformationMessage(
            `FileForge: Generation complete. Created ${result.execution.created} file(s), updated ${result.execution.updated}, and skipped ${result.execution.skipped}.`,
          );
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        vscode.window.showErrorMessage(
          `FileForge: ${message}. Please check the FileForge output report.`,
        );
      }
    },
  );

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

// // ===  src/interfaces/vscode/extension.ts

// import * as vscode from "vscode";

// import { NodeFileSystem } from "../../adapters/filesystem/NodeFileSystem";
// import { DefaultTemplateProvider } from "../../adapters/templates/DefaultTemplateProvider";
// import { ForgeEngine } from "../../core/engine/ForgeEngine";
// import { VscodeOutputRenderer } from "./VscodeOutputRenderer";

// /**
//  * FileForge VS Code extension entry point.
//  *
//  * This file connects VS Code with the platform-independent
//  * FileForge core engine.
//  */
// export function activate(context: vscode.ExtensionContext): void {
//   const fileSystem = new NodeFileSystem();
//   const templateProvider = new DefaultTemplateProvider();

//   const engine = new ForgeEngine(fileSystem, templateProvider);
//   const outputRenderer = new VscodeOutputRenderer();

//   const generateCommand = vscode.commands.registerCommand(
//     "fileforge.generate",
//     async () => {
//       try {
//         const editor = vscode.window.activeTextEditor;

//         if (!editor) {
//           vscode.window.showErrorMessage("FileForge: No active editor found.");
//           return;
//         }

//         const document = editor.document;

//         if (document.languageId !== "markdown") {
//           vscode.window.showErrorMessage(
//             "FileForge: Please run this command from a Markdown file.",
//           );
//           return;
//         }

//         const content = document.getText();

//         /*
//          * First perform a preview.
//          *
//          * Preview parses and validates the definition
//          * without modifying the filesystem.
//          */
//         const previewResult = await engine.run(content, {
//           execute: false,
//           force: false,
//         });

//         outputRenderer.showPreview(previewResult);

//         /*
//          * Stop when validation fails.
//          */
//         if (!previewResult.validation.valid) {
//           vscode.window.showErrorMessage(
//             "FileForge: Validation failed. Please check the FileForge Preview output.",
//           );
//           return;
//         }

//         /*
//          * Ask the user whether to generate the structure.
//          */
//         const generateAction = await vscode.window.showInformationMessage(
//           "FileForge: Project structure is ready to generate.",
//           "Generate",
//           "Cancel",
//         );

//         if (generateAction !== "Generate") {
//           return;
//         }

//         /*
//          * Ask whether existing files should be overwritten.
//          */
//         const overwriteAction = await vscode.window.showWarningMessage(
//           "FileForge: Should existing files be overwritten?",
//           "Overwrite",
//           "Keep Existing",
//         );

//         if (!overwriteAction) {
//           return;
//         }

//         const force = overwriteAction === "Overwrite";

//         /*
//          * Execute the validated FileForge definition.
//          */
//         const executionResult = await engine.run(content, {
//           execute: true,
//           force,
//         });

//         outputRenderer.showExecution(executionResult);

//         vscode.window.showInformationMessage(
//           `FileForge: Generation complete. Created ${executionResult.execution?.created ?? 0} file(s), updated ${executionResult.execution?.updated ?? 0}, and skipped ${executionResult.execution?.skipped ?? 0}.`,
//         );
//       } catch (error) {
//         const message = error instanceof Error ? error.message : String(error);

//         vscode.window.showErrorMessage(`FileForge: ${message}`);
//       }
//     },
//   );

//   context.subscriptions.push(generateCommand);

//   /*
//    * Dispose the output renderer when the extension
//    * is deactivated.
//    */
//   context.subscriptions.push({
//     dispose: () => {
//       outputRenderer.dispose();
//     },
//   });
// }

// /**
//  * Called when the extension is deactivated.
//  */
// export function deactivate(): void {
//   // No additional cleanup is currently required.
// }
