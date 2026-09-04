// src/core/engine/TreeParser.ts

import type { DXWIZNode } from "../models/DXWIZNode";

export class TreeParser {
  /**
   * Convert File & Folder Generator scaffold lines into DXWIZNode objects.
   *
   * Indentation uses 4 spaces per level.
   * Tabs are treated as 4 spaces.
   *
   * Examples:
   *
   * Project/
   *     src/
   *         app.ts
   *     README.md
   *
   * Also supports nested paths:
   *
   * public/index.html
   * components/Button.tsx
   */
  parse(lines: string[], target: string): DXWIZNode[] {
    const nodes: DXWIZNode[] = [];

    const stack: StackEntry[] = [
      {
        depth: -1,
        path: target,
      },
    ];

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      /*
       * Remove comments.
       *
       * Example:
       *
       * src/
       *     app.ts # application entry point
       */
      const cleanLine = line.replace(/#.*$/, "").trim();

      if (!cleanLine) {
        continue;
      }

      /*
       * Calculate indentation depth.
       *
       * Every 4 spaces represents one level.
       * Tabs are treated as 4 spaces.
       */
      const prefix = line.substring(0, line.length - line.trimStart().length);

      const spaces = prefix.replace(/\t/g, "    ").length;

      const depth = Math.floor(spaces / 4);

      /*
       * Support paths such as:
       *
       * public/index.html
       * components/Button.tsx
       *
       * and Windows-style paths:
       *
       * public\index.html
       */
      let parts = cleanLine.split(/[\\/]/);

      /*
       * Remove an empty first component.
       *
       * This protects against paths beginning with "/".
       */
      if (parts.length > 0 && parts[0] === "") {
        parts = parts.slice(1);
      }

      /*
       * Find the correct parent based on indentation.
       */
      while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
        stack.pop();
      }

      let parent = stack[stack.length - 1].path;

      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];

        if (!part.trim()) {
          continue;
        }

        const isLast = index === parts.length - 1;

        /*
         * A node is a folder when:
         *
         * 1. It is not the final component of a path, OR
         * 2. The original line explicitly ends with "/" or "\".
         */
        const isFolder =
          !isLast || cleanLine.endsWith("/") || cleanLine.endsWith("\\");

        const fullPath = joinPath(parent, part);

        const relativePath = getRelativePath(target, fullPath);

        const node: DXWIZNode = {
          name: part,
          relativePath,
          fullPath,
          isFolder,
          depth: depth + index,
          action: "none",
        };

        nodes.push(node);

        if (isFolder) {
          parent = fullPath;

          stack.push({
            depth: depth + index,
            path: fullPath,
          });
        }
      }
    }

    return nodes;
  }
}

interface StackEntry {
  depth: number;
  path: string;
}

/**
 * Join paths without depending on Node's path module.
 *
 * This keeps TreeParser usable in:
 *
 * - VS Code
 * - Node
 * - browser environments
 * - future adapters
 */
function joinPath(parent: string, child: string): string {
  const normalizedParent = parent.replace(/[\\/]+$/, "");

  return `${normalizedParent}/${child}`;
}

/**
 * Calculate the path relative to the File & Folder Generator target.
 */
function getRelativePath(target: string, fullPath: string): string {
  const normalizedTarget = target.replace(/\\/g, "/").replace(/\/+$/, "");

  const normalizedFullPath = fullPath.replace(/\\/g, "/");

  if (normalizedFullPath === normalizedTarget) {
    return "";
  }

  const prefix = `${normalizedTarget}/`;

  if (normalizedFullPath.startsWith(prefix)) {
    return normalizedFullPath.substring(prefix.length);
  }

  return normalizedFullPath;
}
