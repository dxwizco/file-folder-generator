// src/core/models/DXWIZDefinition.ts

export interface DXWIZDefinition {
  /**
   * Target directory where the generated structure will be created.
   * This is taken from:  target: "path" inside the dxwiz block.
   */
  target: string;

  /**
   * Raw scaffold lines after the target declaration.
   */
  lines: string[];
}
