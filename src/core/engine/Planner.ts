// src/ core/engine/Planner.ts

import type { FileSystem } from "../ports/FileSystem";
import type { ForgeAction, ForgeNode } from "../models/ForgeNode";

/**
Determines what action should be performed for each ForgeNode.
The Planner does not create or modify anything.
It only decides what should happen.
*/
export class Planner {
  constructor(private readonly fileSystem: FileSystem) {}

  /**
Plan actions for all nodes.
Folders always receive the "folder" action.
Files receive:
    "create" when they do not exist
    "update" when they exist and force is enabled
    "skip" when they exist and force is disabled
*/
  public async plan(
    nodes: ForgeNode[],
    force: boolean = false,
  ): Promise<ForgeNode[]> {
    for (const node of nodes) {
      node.action = await this.getAction(node, force);
    }

    return nodes;
  }

  /**
    Determine the action for one node.
    */
  private async getAction(
    node: ForgeNode,
    force: boolean,
  ): Promise<ForgeAction> {
    /*
    Folders don't need create/update/skip
    planning in the same way files do.
    */
    if (node.isFolder) {
      return "folder";
    }

    /*
    File does not exist.
    */
    const exists = await this.fileSystem.exists(node.fullPath);

    if (!exists) {
      return "create";
    }

    /*
    File exists and Force was requested.
    */
    if (force) {
      return "update";
    }

    /*
    File exists and Force was not requested.
    */
    return "skip";
  }
}
