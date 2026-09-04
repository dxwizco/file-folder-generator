// tests/Planner.test.ts

import { describe, expect, it } from "vitest";

import { Planner } from "../src/core/engine/Planner";
import type { FileSystem } from "../src/core/ports/FileSystem";
import type { DXWIZNode } from "../src/core/models/DXWIZNode";

function createFileSystem(overrides: Partial<FileSystem> = {}): FileSystem {
  return {
    exists: async () => false,
    isDirectory: async () => true,
    canAccess: async () => true,
    readFile: async () => "",
    writeFile: async () => {},
    createDirectory: async () => {},
    ...overrides,
  };
}

function createFileNode(overrides: Partial<DXWIZNode> = {}): DXWIZNode {
  return {
    name: "app.ts",
    relativePath: "src/app.ts",
    fullPath: "D:\\Projects\\TestProject\\src\\app.ts",
    isFolder: false,
    depth: 1,
    action: "none",
    ...overrides,
  };
}

function createFolderNode(overrides: Partial<DXWIZNode> = {}): DXWIZNode {
  return {
    name: "src",
    relativePath: "src",
    fullPath: "D:\\Projects\\TestProject\\src",
    isFolder: true,
    depth: 0,
    action: "none",
    ...overrides,
  };
}

describe("Planner", () => {
  it("plans a folder as folder", async () => {
    const planner = new Planner(createFileSystem());

    const nodes = [createFolderNode()];

    const result = await planner.plan(nodes);

    expect(result[0].action).toBe("folder");
  });

  it("plans a missing file as create", async () => {
    const planner = new Planner(
      createFileSystem({
        exists: async () => false,
      }),
    );

    const nodes = [createFileNode()];

    const result = await planner.plan(nodes);

    expect(result[0].action).toBe("create");
  });

  it("plans an existing file as skip when force is false", async () => {
    const planner = new Planner(
      createFileSystem({
        exists: async () => true,
      }),
    );

    const nodes = [createFileNode()];

    const result = await planner.plan(nodes, false);

    expect(result[0].action).toBe("skip");
  });

  it("plans an existing file as update when force is true", async () => {
    const planner = new Planner(
      createFileSystem({
        exists: async () => true,
      }),
    );

    const nodes = [createFileNode()];

    const result = await planner.plan(nodes, true);

    expect(result[0].action).toBe("update");
  });

  it("plans multiple nodes independently", async () => {
    const existingPaths = new Set([
      "D:\\Projects\\TestProject\\src\\existing.ts",
    ]);

    const planner = new Planner(
      createFileSystem({
        exists: async (path: string) => existingPaths.has(path),
      }),
    );

    const nodes: DXWIZNode[] = [
      createFolderNode(),
      createFileNode({
        name: "new.ts",
        relativePath: "src/new.ts",
        fullPath: "D:\\Projects\\TestProject\\src\\new.ts",
      }),
      createFileNode({
        name: "existing.ts",
        relativePath: "src/existing.ts",
        fullPath: "D:\\Projects\\TestProject\\src\\existing.ts",
      }),
    ];

    const result = await planner.plan(nodes, false);

    expect(result).toHaveLength(3);

    expect(result[0].action).toBe("folder");
    expect(result[1].action).toBe("create");
    expect(result[2].action).toBe("skip");
  });

  it("updates existing files when force is enabled", async () => {
    const planner = new Planner(
      createFileSystem({
        exists: async () => true,
      }),
    );

    const nodes: DXWIZNode[] = [
      createFileNode({
        name: "one.ts",
        relativePath: "one.ts",
        fullPath: "D:\\Projects\\TestProject\\one.ts",
      }),
      createFileNode({
        name: "two.ts",
        relativePath: "two.ts",
        fullPath: "D:\\Projects\\TestProject\\two.ts",
      }),
    ];

    const result = await planner.plan(nodes, true);

    expect(result[0].action).toBe("update");
    expect(result[1].action).toBe("update");
  });

  it("does not replace the node objects", async () => {
    const planner = new Planner(createFileSystem());

    const node = createFileNode();

    const result = await planner.plan([node]);

    expect(result[0]).toBe(node);
    expect(node.action).toBe("create");
  });
});
