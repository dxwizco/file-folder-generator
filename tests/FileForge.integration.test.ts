// tests/FileForge.integration.test.ts

import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ForgeEngine } from "../src/core/engine/ForgeEngine";
import { NodeFileSystem } from "../src/adapters/filesystem/NodeFileSystem";
import { DefaultTemplateProvider } from "../src/adapters/templates/DefaultTemplateProvider";

describe("FileForge integration", () => {
  let targetDirectory: string;
  let engine: ForgeEngine;

  beforeEach(async () => {
    targetDirectory = await mkdtemp(join(tmpdir(), "fileforge-test-"));

    const fileSystem = new NodeFileSystem();
    const templateProvider = new DefaultTemplateProvider();

    engine = new ForgeEngine(fileSystem, templateProvider);
  });

  afterEach(async () => {
    await rm(targetDirectory, {
      recursive: true,
      force: true,
    });
  });

  function definition(scaffold: string): string {
    return `
\`\`\`fileforge
target: "${targetDirectory}"

${scaffold}
\`\`\`
`;
  }

  it("parses and previews a complete project definition", async () => {
    const content = definition(`
Project/
    src/
        app.ts
    components/
        Button.tsx
    README.md
`);

    const result = await engine.run(content);

    expect(result.definition.target).toBe(targetDirectory);

    expect(result.validation.valid).toBe(true);

    expect(result.plan.folders).toBe(3);
    expect(result.plan.files).toBe(3);

    expect(result.execution).toBeUndefined();

    expect(result.nodes.length).toBe(6);

    for (const node of result.nodes) {
      expect(node.action).toMatch(/folder|create|skip|update/);
    }

    expect(await exists(join(targetDirectory, "Project"))).toBe(false);
  });

  it("creates folders and files during execution", async () => {
    const content = definition(`
Project/
    src/
        app.ts
    README.md
`);

    const result = await engine.run(content, {
      execute: true,
    });

    expect(result.execution).toBeDefined();

    expect(result.execution?.folders).toBe(2);
    expect(result.execution?.created).toBe(2);
    expect(result.execution?.updated).toBe(0);
    expect(result.execution?.skipped).toBe(0);

    expect(await exists(join(targetDirectory, "Project"))).toBe(true);

    expect(await exists(join(targetDirectory, "Project", "src"))).toBe(true);

    expect(
      await exists(join(targetDirectory, "Project", "src", "app.ts")),
    ).toBe(true);

    expect(await exists(join(targetDirectory, "Project", "README.md"))).toBe(
      true,
    );
  });

  it("uses templates based on file extensions", async () => {
    const content = definition(`
Project/
    app.ts
    styles.css
    index.html
    script.js
    main.py
`);

    await engine.run(content, {
      execute: true,
    });

    const tsContent = await readFile(
      join(targetDirectory, "Project", "app.ts"),
      "utf8",
    );

    const cssContent = await readFile(
      join(targetDirectory, "Project", "styles.css"),
      "utf8",
    );

    const htmlContent = await readFile(
      join(targetDirectory, "Project", "index.html"),
      "utf8",
    );

    const jsContent = await readFile(
      join(targetDirectory, "Project", "script.js"),
      "utf8",
    );

    const pyContent = await readFile(
      join(targetDirectory, "Project", "main.py"),
      "utf8",
    );

    expect(tsContent).toContain("app");

    expect(cssContent).toContain("styles");

    expect(htmlContent).toContain("index");

    expect(jsContent).toContain("script");

    expect(pyContent).toContain("main");
  });

  it("skips existing files when force is false", async () => {
    const projectDirectory = join(targetDirectory, "Project");

    const existingFile = join(projectDirectory, "README.md");

    const fileSystem = new NodeFileSystem();

    await fileSystem.createDirectory(projectDirectory);

    await writeFile(existingFile, "ORIGINAL CONTENT", "utf8");

    const content = definition(`
Project/
    README.md
`);

    const result = await engine.run(content, {
      execute: true,
      force: false,
    });

    expect(result.execution).toBeDefined();

    expect(result.execution?.skipped).toBe(1);

    expect(result.execution?.created).toBe(0);

    const finalContent = await readFile(existingFile, "utf8");

    expect(finalContent).toBe("ORIGINAL CONTENT");
  });

  it("updates existing files when force is true", async () => {
    const projectDirectory = join(targetDirectory, "Project");

    const existingFile = join(projectDirectory, "app.ts");

    const fileSystem = new NodeFileSystem();

    await fileSystem.createDirectory(projectDirectory);

    await writeFile(existingFile, "OLD CONTENT", "utf8");

    const content = definition(`
Project/
    app.ts
`);

    const result = await engine.run(content, {
      execute: true,
      force: true,
    });

    expect(result.execution).toBeDefined();

    expect(result.execution?.updated).toBe(1);

    const finalContent = await readFile(existingFile, "utf8");

    expect(finalContent).not.toBe("OLD CONTENT");

    expect(finalContent).toContain("app");
  });

  it("does not modify the filesystem in preview mode", async () => {
    const content = definition(`
Project/
    src/
        app.ts
    README.md
`);

    const result = await engine.run(content, {
      execute: false,
    });

    expect(result.execution).toBeUndefined();

    expect(await exists(join(targetDirectory, "Project"))).toBe(false);

    expect(await exists(join(targetDirectory, "Project", "src"))).toBe(false);

    expect(await exists(join(targetDirectory, "Project", "README.md"))).toBe(
      false,
    );
  });

  it("stops before execution when validation fails", async () => {
    const content = definition(`
Project/
    invalid:name.ts
`);

    const result = await engine.run(content, {
      execute: true,
    });

    expect(result.validation.valid).toBe(false);

    expect(result.validation.errors.length).toBeGreaterThan(0);

    expect(result.execution).toBeUndefined();

    expect(await exists(join(targetDirectory, "Project"))).toBe(false);
  });

  it("handles nested paths and special folder names", async () => {
    const content = definition(`
Project/
    app/
        [dynamic-route]/
            page.tsx
        (group)/
            page.tsx
        styles/
            main.css
    public/index.html
`);

    const result = await engine.run(content, {
      execute: true,
    });

    expect(result.validation.valid).toBe(true);

    expect(
      await exists(
        join(targetDirectory, "Project", "app", "[dynamic-route]", "page.tsx"),
      ),
    ).toBe(true);

    expect(
      await exists(
        join(targetDirectory, "Project", "app", "(group)", "page.tsx"),
      ),
    ).toBe(true);

    expect(
      await exists(
        join(targetDirectory, "Project", "app", "styles", "main.css"),
      ),
    ).toBe(true);

    expect(
      await exists(join(targetDirectory, "Project", "public", "index.html")),
    ).toBe(true);
  });

  it("reports duplicate paths as warnings", async () => {
    const content = definition(`
Project/
    README.md
    README.md
`);

    const result = await engine.run(content);

    expect(result.validation.valid).toBe(true);

    expect(result.validation.duplicateCount).toBe(1);

    expect(
      result.validation.warnings.some((warning) =>
        warning.includes("Duplicate path detected"),
      ),
    ).toBe(true);

    expect(result.execution).toBeUndefined();
  });
});

async function exists(path: string): Promise<boolean> {
  const fileSystem = new NodeFileSystem();

  return fileSystem.exists(path);
}
