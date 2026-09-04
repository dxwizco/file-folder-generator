// src/ core/engine/DXWIZEngine.ts

import type { FileSystem } from "../ports/FileSystem";
import type { TemplateProvider } from "../ports/TemplateProvider";
import type { DXWIZResult } from "../models/DXWIZResult";
import type { DXWIZPlanStats } from "../models/DXWIZStatistics";
import type { DXWIZNode } from "../models/DXWIZNode";

import { MarkdownParser } from "./MarkdownParser";
import { TargetValidator } from "./TargetValidator";
import { TreeParser } from "./TreeParser";
import { Validator } from "./Validator";
import { Planner } from "./Planner";
import { Executor } from "./Executor";

/**
 * Main File & Folder Generator application engine.
 *
 * DXWIZEngine coordinates the complete File & Folder Generator workflow:
 *
 * Markdown
 *   ↓
 * Parse definition
 *   ↓
 * Validate target
 *   ↓
 * Build DXWIZ tree
 *   ↓
 * Validate tree
 *   ↓
 * Plan actions
 *   ↓
 * Execute changes (optional)
 *   ↓
 * Return DXWIZResult
 *
 * The engine is platform-independent.
 *
 * It does not know anything about:
 * - VS Code
 * - Node.js
 * - CLI
 * - Web
 *
 * Those concerns are handled by adapters and interfaces.
 */
export class DXWIZEngine {
  private readonly markdownParser: MarkdownParser;
  private readonly targetValidator: TargetValidator;
  private readonly treeParser: TreeParser;
  private readonly validator: Validator;
  private readonly planner: Planner;
  private readonly executor: Executor;

  constructor(fileSystem: FileSystem, templateProvider: TemplateProvider) {
    this.markdownParser = new MarkdownParser();

    this.targetValidator = new TargetValidator(fileSystem);

    this.treeParser = new TreeParser();

    this.validator = new Validator();

    this.planner = new Planner(fileSystem);

    this.executor = new Executor(fileSystem, templateProvider);
  }

  /**
   * Run File & Folder Generator against a Markdown document.
   *
   * Default behavior is preview mode.
   *
   * Set execute=true to actually create/update files.
   *
   * Set force=true to allow existing files to be updated.
   */
  public async run(
    content: string,
    options: {
      execute?: boolean;
      force?: boolean;
    } = {},
  ): Promise<DXWIZResult> {
    const execute = options.execute ?? false;
    const force = options.force ?? false;

    /*
     * ============================================================
     * 1. Parse Markdown
     * ============================================================
     */

    const definition = this.markdownParser.parse(content);

    /*
     * ============================================================
     * 2. Validate target
     * ============================================================
     *
     * This checks:
     * - target is not empty
     * - target exists
     * - target is accessible
     * - target is a directory
     */

    await this.targetValidator.validate(definition.target);

    /*
     * ============================================================
     * 3. Build DXWIZ tree
     * ============================================================
     */

    const nodes = this.treeParser.parse(definition.lines, definition.target);

    /*
     * ============================================================
     * 4. Validate tree
     * ============================================================
     */

    const validation = this.validator.validate(nodes);

    /*
     * ============================================================
     * 5. Calculate plan statistics
     * ============================================================
     */

    const plan = this.createPlanStats(nodes);

    /*
     * ============================================================
     * 6. Stop on validation errors
     * ============================================================
     *
     * We still return the parsed definition,
     * nodes, validation and plan.
     *
     * No filesystem changes are made.
     */

    if (!validation.valid) {
      return {
        definition,
        nodes,
        validation,
        plan,
      };
    }

    /*
     * ============================================================
     * 7. Plan actions
     * ============================================================
     *
     * Planner determines:
     *
     * folder
     * create
     * update
     * skip
     */

    await this.planner.plan(nodes, force);

    /*
     * ============================================================
     * 8. Preview mode
     * ============================================================
     *
     * Preview does not modify the filesystem.
     */

    if (!execute) {
      return {
        definition,
        nodes,
        validation,
        plan,
      };
    }

    /*
     * ============================================================
     * 9. Execution mode
     * ============================================================
     */

    const execution = await this.executor.execute(nodes, force);

    /*
     * ============================================================
     * 10. Return complete result
     * ============================================================
     */

    return {
      definition,
      nodes,
      validation,
      plan,
      execution,
    };
  }

  /**
   * Calculate the number of folders and files
   * represented by the DXWIZ tree.
   */
  private createPlanStats(nodes: DXWIZNode[]): DXWIZPlanStats {
    let folders = 0;
    let files = 0;

    for (const node of nodes) {
      if (node.isFolder) {
        folders++;
      } else {
        files++;
      }
    }

    return {
      folders,
      files,
    };
  }
}
