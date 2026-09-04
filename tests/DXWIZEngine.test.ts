// tests/DXWIZEngine.test.ts

import { describe, expect, it } from "vitest";

import { DXWIZEngine } from "../src/core/engine/DXWIZEngine";
import type { FileSystem } from "../src/core/ports/FileSystem";
import type { TemplateProvider } from "../src/core/ports/TemplateProvider";

/**
 * Creates a simple in-memory filesystem for testing.
 *
 * This avoids touching the real filesystem during unit tests.
 */
function createFileSystem(
  initialFiles: Record<string, string> = {},
  initialDirectories: string[] = [],
): FileSystem {
  const files = new Map<string, string>(Object.entries(initialFiles));
  const directories = new Set<string>(initialDirectories);

  return {
    exists: async (path: string): Promise<boolean> => {
      return files.has(path) || directories.has(path);
    },

    isDirectory: async (path: string): Promise<boolean> => {
      return directories.has(path);
    },

    canAccess: async (path: string): Promise<boolean> => {
      return files.has(path) || directories.has(path);
    },

    readFile: async (path: string): Promise<string> => {
      const content = files.get(path);

      if (content === undefined) {
        throw new Error(`File does not exist: ${path}`);
      }

      return content;
    },

    writeFile: async (path: string, content: string): Promise<void> => {
      files.set(path, content);
    },

    createDirectory: async (path: string): Promise<void> => {
      directories.add(path);
    },
  };
}

/**
 * Creates a simple template provider for testing.
 */
function createTemplateProvider(): TemplateProvider {
  return {
    getTemplate: (path: string): string => {
      return `// Generated: ${path}`;
    },
  };
}

describe("DXWIZEngine", () => {
  it("parses, validates and plans a valid definition", async () => {
    const target = "D:\\Projects\\TestProject";

    const fileSystem = createFileSystem({}, [target]);
    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: "${target}"

TestProject/
    src/
        app.ts
    README.md
\`\`\`
`;

    const result = await engine.run(content);

    expect(result.definition.target).toBe(target);

    expect(result.validation.valid).toBe(true);

    expect(result.plan.folders).toBe(2);
    expect(result.plan.files).toBe(2);

    expect(result.execution).toBeUndefined();

    expect(
      result.nodes.some(
        (node) =>
          node.relativePath === "TestProject/src/app.ts" &&
          node.action === "create",
      ),
    ).toBe(true);

    expect(
      result.nodes.some(
        (node) =>
          node.relativePath === "TestProject/README.md" &&
          node.action === "create",
      ),
    ).toBe(true);
  });

  it("does not modify the filesystem in preview mode", async () => {
    const target = "D:\\Projects\\PreviewProject";

    const fileSystem = createFileSystem({}, [target]);
    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: "${target}"

src/
    app.ts
\`\`\`
`;

    const result = await engine.run(content);

    expect(result.execution).toBeUndefined();

    expect(await fileSystem.exists(`${target}/src`)).toBe(false);

    expect(await fileSystem.exists(`${target}/src/app.ts`)).toBe(false);
  });

  it("executes the planned structure when execute is true", async () => {
    const target = "D:\\Projects\\ExecutionProject";

    const fileSystem = createFileSystem({}, [target]);
    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: "${target}"

src/
    app.ts
README.md
\`\`\`
`;

    const result = await engine.run(content, {
      execute: true,
    });

    expect(result.execution).toBeDefined();

    expect(result.execution?.folders).toBe(1);
    expect(result.execution?.created).toBe(2);
    expect(result.execution?.updated).toBe(0);
    expect(result.execution?.skipped).toBe(0);

    expect(await fileSystem.exists(`${target}/src`)).toBe(true);

    expect(await fileSystem.exists(`${target}/src/app.ts`)).toBe(true);

    expect(await fileSystem.exists(`${target}/README.md`)).toBe(true);
  });

  it("skips existing files when force is false", async () => {
    const target = "D:\\Projects\\SkipProject";

    const existingFile = `${target}/README.md`;

    const fileSystem = createFileSystem(
      {
        [existingFile]: "Original content",
      },
      [target],
    );

    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: "${target}"

README.md
\`\`\`
`;

    const result = await engine.run(content, {
      execute: true,
      force: false,
    });

    expect(result.execution).toBeDefined();

    expect(result.execution?.created).toBe(0);
    expect(result.execution?.updated).toBe(0);
    expect(result.execution?.skipped).toBe(1);

    expect(await fileSystem.readFile(existingFile)).toBe("Original content");
  });

  it("updates existing files when force is true", async () => {
    const target = "D:\\Projects\\ForceProject";

    const existingFile = `${target}/README.md`;

    const fileSystem = createFileSystem(
      {
        [existingFile]: "Original content",
      },
      [target],
    );

    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: "${target}"

README.md
\`\`\`
`;

    const result = await engine.run(content, {
      execute: true,
      force: true,
    });

    expect(result.execution).toBeDefined();

    expect(result.execution?.created).toBe(0);
    expect(result.execution?.updated).toBe(1);
    expect(result.execution?.skipped).toBe(0);

    expect(await fileSystem.readFile(existingFile)).toBe(
      "// Generated: README.md",
    );
  });

  it("returns validation errors and does not execute invalid definitions", async () => {
    const target = "D:\\Projects\\InvalidProject";

    const fileSystem = createFileSystem({}, [target]);
    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: "${target}"

README.md
README.md
\`\`\`
`;

    const result = await engine.run(content, {
      execute: true,
    });

    expect(result.validation.valid).toBe(true);

    expect(result.validation.duplicateCount).toBe(1);

    expect(result.validation.warnings.length).toBeGreaterThan(0);

    expect(result.execution).toBeDefined();
  });

  it("rejects an empty target", async () => {
    const fileSystem = createFileSystem();
    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: ""

README.md
\`\`\`
`;

    await expect(engine.run(content)).rejects.toThrow(
      "Target path cannot be empty",
    );
  });

  it("rejects a target directory that does not exist", async () => {
    const target = "D:\\Missing\\Project";

    const fileSystem = createFileSystem();
    const templateProvider = createTemplateProvider();

    const engine = new DXWIZEngine(fileSystem, templateProvider);

    const content = `
\`\`\`dxwiz
target: "${target}"

README.md
\`\`\`
`;

    await expect(engine.run(content)).rejects.toThrow(
      "Target directory does not exist",
    );
  });
});
