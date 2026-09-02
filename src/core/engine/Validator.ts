// src/ core/engine/Validator.ts

import type { ForgeNode } from "../models/ForgeNode";
import type { ForgeValidation } from "../models/ForgeValidation";

/**
Validates the parsed FileForge tree.
The validator does not access the filesystem.
It only validates the ForgeNode[] structure.
*/
export class Validator {
  public validate(nodes: ForgeNode[]): ForgeValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    /*
     * ============================================================
     * Duplicate physical paths
     * ============================================================
     */

    const pathCounts = new Map<string, number>();

    for (const node of nodes) {
      const existingCount = pathCounts.get(node.fullPath) ?? 0;

      pathCounts.set(node.fullPath, existingCount + 1);
    }

    const duplicatePaths: string[] = [];

    for (const [path, count] of pathCounts) {
      if (count > 1) {
        duplicatePaths.push(path);

        warnings.push(`Duplicate path detected: ${path}`);
      }
    }

    /*
     * ============================================================
     * Missing names
     * ============================================================
     */

    for (const node of nodes) {
      if (!node.name.trim()) {
        errors.push("Empty node name detected");
      }
    }

    /*
     * ============================================================
     * Invalid filesystem characters
     * ============================================================
     *
     * Windows-invalid filename characters: < > : " / \ | ? *
     *
     * Path separators are already handled by TreeParser,
     * so we check the individual node name here.
     *
     * We intentionally do not reject "/" or "\" here because
     * TreeParser has already split those into path components.
     */

    const invalidCharacters = /[<>:"|?*]/;

    for (const node of nodes) {
      if (invalidCharacters.test(node.name)) {
        errors.push(`Invalid filesystem characters: ${node.fullPath}`);
      }
    }

    /*
     * ============================================================
     * Result
     * ============================================================
     */

    return {
      errors,
      warnings,
      duplicateCount: duplicatePaths.length,
      valid: errors.length === 0,
    };
  }
}
