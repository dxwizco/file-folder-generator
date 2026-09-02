// src/core/models/ForgeNode.ts

export type ForgeAction = "none" | "folder" | "create" | "update" | "skip";

export interface ForgeNode {
  name: string;
  relativePath: string;
  fullPath: string;
  isFolder: boolean;
  depth: number;
  action: ForgeAction;
}
