// tests/Executor.test.ts

import { describe, expect, it, vi } from "vitest";

import { Executor } from "../src/core/engine/Executor";
import type { FileSystem } from "../src/core/ports/FileSystem";
import type { TemplateProvider } from "../src/core/ports/TemplateProvider";
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

function createTemplateProvider(
  overrides: Partial<TemplateProvider> = {},
): TemplateProvider {
  return {
    getTemplate: () => "// default template",
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
    action: "folder",
    ...overrides,
  };
}

describe("Executor", () => {
  it("creates a missing folder", async () => {
    const createDirectory = vi.fn(async () => {});

    const fileSystem = createFileSystem({
      exists: async () => false,
      createDirectory,
    });

    const executor = new Executor(fileSystem, createTemplateProvider());

    const result = await executor.execute([createFolderNode()]);

    expect(createDirectory).toHaveBeenCalledWith(
      "D:\\Projects\\TestProject\\src",
    );

    expect(result).toEqual({
      folders: 1,
      created: 0,
      updated: 0,
      skipped: 0,
    });
  });

  it("does not recreate an existing folder", async () => {
    const createDirectory = vi.fn(async () => {});

    const fileSystem = createFileSystem({
      exists: async () => true,
      createDirectory,
    });

    const executor = new Executor(fileSystem, createTemplateProvider());

    const result = await executor.execute([createFolderNode()]);

    expect(createDirectory).not.toHaveBeenCalled();

    expect(result).toEqual({
      folders: 0,
      created: 0,
      updated: 0,
      skipped: 0,
    });
  });

  it("creates a missing file", async () => {
    const writeFile = vi.fn(async () => {});

    const fileSystem = createFileSystem({
      exists: async () => false,
      writeFile,
    });

    const templateProvider = createTemplateProvider({
      getTemplate: vi.fn(() => "console.log('hello');"),
    });

    const executor = new Executor(fileSystem, templateProvider);

    const result = await executor.execute([createFileNode()]);

    expect(writeFile).toHaveBeenCalledWith(
      "D:\\Projects\\TestProject\\src\\app.ts",
      "console.log('hello');",
    );

    expect(result).toEqual({
      folders: 0,
      created: 1,
      updated: 0,
      skipped: 0,
    });
  });

  it("updates an existing file when force is enabled", async () => {
    const writeFile = vi.fn(async () => {});

    const fileSystem = createFileSystem({
      exists: async () => true,
      writeFile,
    });

    const templateProvider = createTemplateProvider({
      getTemplate: vi.fn(() => "updated content"),
    });

    const executor = new Executor(fileSystem, templateProvider);

    const result = await executor.execute([createFileNode()], true);

    expect(writeFile).toHaveBeenCalledWith(
      "D:\\Projects\\TestProject\\src\\app.ts",
      "updated content",
    );

    expect(result).toEqual({
      folders: 0,
      created: 0,
      updated: 1,
      skipped: 0,
    });
  });

  it("skips an existing file when force is disabled", async () => {
    const writeFile = vi.fn(async () => {});

    const fileSystem = createFileSystem({
      exists: async () => true,
      writeFile,
    });

    const templateProvider = createTemplateProvider({
      getTemplate: vi.fn(() => "should not be used"),
    });

    const executor = new Executor(fileSystem, templateProvider);

    const result = await executor.execute([createFileNode()], false);

    expect(writeFile).not.toHaveBeenCalled();

    expect(templateProvider.getTemplate).not.toHaveBeenCalled();

    expect(result).toEqual({
      folders: 0,
      created: 0,
      updated: 0,
      skipped: 1,
    });
  });

  it("creates the parent directory before creating a file", async () => {
    const calls: string[] = [];

    const fileSystem = createFileSystem({
      exists: async (path: string) => {
        calls.push(`exists:${path}`);
        return false;
      },

      createDirectory: async (path: string) => {
        calls.push(`mkdir:${path}`);
      },

      writeFile: async (path: string) => {
        calls.push(`write:${path}`);
      },
    });

    const executor = new Executor(fileSystem, createTemplateProvider());

    await executor.execute([createFileNode()]);

    expect(calls).toEqual([
      "mkdir:D:\\Projects\\TestProject\\src",
      "exists:D:\\Projects\\TestProject\\src\\app.ts",
      "write:D:\\Projects\\TestProject\\src\\app.ts",
    ]);
  });

  it("uses the node relative path when requesting a template", async () => {
    const getTemplate = vi.fn(() => "template content");

    const executor = new Executor(
      createFileSystem(),
      createTemplateProvider({
        getTemplate,
      }),
    );

    await executor.execute([
      createFileNode({
        relativePath: "components/Button.tsx",
        fullPath: "D:\\Projects\\TestProject\\components\\Button.tsx",
        name: "Button.tsx",
      }),
    ]);

    expect(getTemplate).toHaveBeenCalledWith("components/Button.tsx");
  });

  it("returns combined statistics for multiple nodes", async () => {
    const existingPaths = new Set([
      "D:\\Projects\\TestProject\\existing.ts",
      "D:\\Projects\\TestProject\\skip.ts",
      "D:\\Projects\\TestProject\\src",
    ]);

    const fileSystem = createFileSystem({
      exists: async (path: string) => existingPaths.has(path),
    });

    const nodes: DXWIZNode[] = [
      createFolderNode(),
      createFileNode({
        name: "created.ts",
        relativePath: "created.ts",
        fullPath: "D:\\Projects\\TestProject\\created.ts",
      }),
      createFileNode({
        name: "existing.ts",
        relativePath: "existing.ts",
        fullPath: "D:\\Projects\\TestProject\\existing.ts",
      }),
      createFileNode({
        name: "skip.ts",
        relativePath: "skip.ts",
        fullPath: "D:\\Projects\\TestProject\\skip.ts",
      }),
    ];

    const executor = new Executor(fileSystem, createTemplateProvider());

    /*
     * force=true means existing.ts is updated.
     * skip.ts is also updated because force applies
     * to all existing files.
     */
    const result = await executor.execute(nodes, true);

    expect(result).toEqual({
      folders: 0,
      created: 1,
      updated: 2,
      skipped: 0,
    });
  });

  it("handles a mixed execution with skip mode", async () => {
    const existingPaths = new Set([
      "D:\\Projects\\TestProject\\src",
      "D:\\Projects\\TestProject\\existing.ts",
    ]);

    const fileSystem = createFileSystem({
      exists: async (path: string) => existingPaths.has(path),
    });

    const nodes: DXWIZNode[] = [
      createFolderNode(),
      createFileNode({
        name: "new.ts",
        relativePath: "new.ts",
        fullPath: "D:\\Projects\\TestProject\\new.ts",
      }),
      createFileNode({
        name: "existing.ts",
        relativePath: "existing.ts",
        fullPath: "D:\\Projects\\TestProject\\existing.ts",
      }),
    ];

    const executor = new Executor(fileSystem, createTemplateProvider());

    const result = await executor.execute(nodes, false);

    expect(result).toEqual({
      folders: 0,
      created: 1,
      updated: 0,
      skipped: 1,
    });
  });
});
