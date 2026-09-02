// src/core/models/ForgeDefinition.ts

export interface ForgeDefinition {
  /**
   * Target directory where the generated structure will be created.
   * This is taken from:  target: "path" inside the fileforge block.
   */
  target: string;

  /**
   * Raw scaffold lines after the target declaration.
   */
  lines: string[];
}
