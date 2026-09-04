// src/core/models/DXWIZNode.ts

export type DXWIZAction = "none" | "folder" | "create" | "update" | "skip";

export interface DXWIZNode {
  name: string;
  relativePath: string;
  fullPath: string;
  isFolder: boolean;
  depth: number;
  action: DXWIZAction;
}
