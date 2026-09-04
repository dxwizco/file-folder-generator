// src/ core/engine/MarkdownParser.ts

import type { DXWIZDefinition } from "../models/DXWIZDefinition";

/**
 * Parses a Markdown document containing a DXWIZ definition.
 *
 * Expected format:
 *
 * ```dxwiz
 * target: "D:\Projects\MyProject"
 *
 * MyProject/
 *     src/
 *         app.ts
 *     README.md
 * ```
 *
 * The parser is intentionally filesystem-independent.
 * It only parses the Markdown document.
 *
 * Filesystem validation is performed later by DXWIZEngine
 * through the FileSystem abstraction.
 */
export class MarkdownParser {
  /**
   * Parse a Markdown document and extract its DXWIZ definition.
   */
  parse(content: string): DXWIZDefinition {
    const lines = content.split(/\r?\n/);

    const blockLines = this.extractDXWIZBlock(lines);

    const targetIndex = blockLines.findIndex((line) => this.isTargetLine(line));

    // target: is mandatory.
    if (targetIndex === -1) {
      throw new Error(
        'Target path is required. Add a line such as: target: "D:\\Projects\\MyProject"',
      );
    }

    const target = this.parseTarget(blockLines[targetIndex]);

    const scaffoldLines = [
      ...blockLines.slice(0, targetIndex),
      ...blockLines.slice(targetIndex + 1),
    ];

    return {
      target,
      lines: scaffoldLines,
    };
  }

  /**
   * Extract the first ```dxwiz block.
   */
  private extractDXWIZBlock(lines: string[]): string[] {
    const result: string[] = [];

    let inside = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (!inside) {
        if (trimmed === "```dxwiz") {
          inside = true;
        }

        continue;
      }

      if (trimmed === "```") {
        break;
      }

      result.push(line);
    }

    if (result.length === 0) {
      throw new Error("No dxwiz block found in the document.");
    }

    return result;
  }

  /**
   * Determine whether a line is a target declaration.
   */
  private isTargetLine(line: string): boolean {
    return /^\s*target\s*:/i.test(line);
  }

  /**
   * Parse the target declaration.
   * Supported:
   * target: "D:\Projects\App"
   * target: 'D:\Projects\App'
   * target: D:\Projects\App
   */
  private parseTarget(line: string): string {
    const match = line.match(/^\s*target\s*:\s*(.*?)\s*$/i);

    if (!match) {
      throw new Error('Invalid target declaration. Expected: target: "path"');
    }

    let target = match[1].trim();

    // Empty target:
    //
    // target:
    // target: ""
    // target: ''
    //
    // All must fail.
    if (!target) {
      throw new Error(
        "Target path cannot be empty. Please provide a valid directory path.",
      );
    }

    // Remove matching surrounding quotes.
    if (
      (target.startsWith('"') && target.endsWith('"')) ||
      (target.startsWith("'") && target.endsWith("'"))
    ) {
      target = target.slice(1, -1).trim();
    }

    if (!target) {
      throw new Error(
        "Target path cannot be empty. Please provide a valid directory path.",
      );
    }

    return target;
  }
}
