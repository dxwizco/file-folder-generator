// tests/TreeParser.test.ts

import { describe, expect, it } from "vitest";

import { TreeParser } from "../src/core/engine/TreeParser";

describe("TreeParser", () => {
  const parser = new TreeParser();

  const target = "D:\\Projects\\TestProject";

  it("parses a root-level folder", () => {
    const nodes = parser.parse(["src/"], target);

    expect(nodes).toHaveLength(1);

    expect(nodes[0]).toEqual({
      name: "src",
      relativePath: "src",
      fullPath: `${target}/src`,
      isFolder: true,
      depth: 0,
      action: "none",
    });
  });

  it("parses a root-level file", () => {
    const nodes = parser.parse(["README.md"], target);

    expect(nodes).toHaveLength(1);

    expect(nodes[0]).toEqual({
      name: "README.md",
      relativePath: "README.md",
      fullPath: `${target}/README.md`,
      isFolder: false,
      depth: 0,
      action: "none",
    });
  });

  it("parses nested folders using four-space indentation", () => {
    const nodes = parser.parse(
      ["src/", "    components/", "        forms/"],
      target,
    );

    expect(nodes).toHaveLength(3);

    expect(nodes[0].relativePath).toBe("src");
    expect(nodes[0].isFolder).toBe(true);
    expect(nodes[0].depth).toBe(0);

    expect(nodes[1].relativePath).toBe("src/components");
    expect(nodes[1].isFolder).toBe(true);
    expect(nodes[1].depth).toBe(1);

    expect(nodes[2].relativePath).toBe("src/components/forms");
    expect(nodes[2].isFolder).toBe(true);
    expect(nodes[2].depth).toBe(2);
  });

  it("parses nested files", () => {
    const nodes = parser.parse(["src/", "    app/", "        main.ts"], target);

    expect(nodes).toHaveLength(3);

    expect(nodes[2]).toEqual({
      name: "main.ts",
      relativePath: "src/app/main.ts",
      fullPath: `${target}/src/app/main.ts`,
      isFolder: false,
      depth: 2,
      action: "none",
    });
  });

  it("treats tabs as four spaces", () => {
    const nodes = parser.parse(["src/", "\tapp.ts"], target);

    expect(nodes).toHaveLength(2);

    expect(nodes[1].name).toBe("app.ts");
    expect(nodes[1].relativePath).toBe("src/app.ts");
    expect(nodes[1].fullPath).toBe(`${target}/src/app.ts`);
    expect(nodes[1].depth).toBe(1);
  });

  it("supports nested paths on a single line", () => {
    const nodes = parser.parse(["public/index.html"], target);

    expect(nodes).toHaveLength(2);

    expect(nodes[0]).toEqual({
      name: "public",
      relativePath: "public",
      fullPath: `${target}/public`,
      isFolder: true,
      depth: 0,
      action: "none",
    });

    expect(nodes[1]).toEqual({
      name: "index.html",
      relativePath: "public/index.html",
      fullPath: `${target}/public/index.html`,
      isFolder: false,
      depth: 1,
      action: "none",
    });
  });

  it("supports Windows-style nested paths", () => {
    const nodes = parser.parse(["public\\index.html"], target);

    expect(nodes).toHaveLength(2);

    expect(nodes[0].relativePath).toBe("public");
    expect(nodes[0].fullPath).toBe(`${target}/public`);
    expect(nodes[0].isFolder).toBe(true);

    expect(nodes[1].relativePath).toBe("public/index.html");
    expect(nodes[1].fullPath).toBe(`${target}/public/index.html`);
    expect(nodes[1].isFolder).toBe(false);
  });

  it("supports special folder names", () => {
    const nodes = parser.parse(
      [
        "app/",
        "    [dynamic-route]/",
        "        page.tsx",
        "    (group)/",
        "        page.tsx",
      ],
      target,
    );

    expect(nodes).toHaveLength(5);

    expect(nodes[1].name).toBe("[dynamic-route]");
    expect(nodes[1].isFolder).toBe(true);

    expect(nodes[2].relativePath).toBe("app/[dynamic-route]/page.tsx");

    expect(nodes[3].name).toBe("(group)");
    expect(nodes[3].isFolder).toBe(true);

    expect(nodes[4].relativePath).toBe("app/(group)/page.tsx");
  });

  it("supports empty folders", () => {
    const nodes = parser.parse(["app/", "    empty-folder/"], target);

    expect(nodes).toHaveLength(2);

    expect(nodes[1]).toEqual({
      name: "empty-folder",
      relativePath: "app/empty-folder",
      fullPath: `${target}/app/empty-folder`,
      isFolder: true,
      depth: 1,
      action: "none",
    });
  });

  it("removes comments from scaffold lines", () => {
    const nodes = parser.parse(
      [
        "# Root comment",
        "src/ # Source folder",
        "    app.ts # Application entry point",
      ],
      target,
    );

    expect(nodes).toHaveLength(2);

    expect(nodes[0].name).toBe("src");
    expect(nodes[1].name).toBe("app.ts");
  });

  it("ignores blank lines", () => {
    const nodes = parser.parse(
      ["", "src/", "", "    app.ts", "   ", "", "README.md"],
      target,
    );

    expect(nodes).toHaveLength(3);

    expect(nodes[0].relativePath).toBe("src");
    expect(nodes[1].relativePath).toBe("src/app.ts");
    expect(nodes[2].relativePath).toBe("README.md");
  });

  it("parses multiple root-level structures", () => {
    const nodes = parser.parse(
      ["src/", "    app.ts", "tests/", "    app.test.ts", "README.md"],
      target,
    );

    expect(nodes).toHaveLength(5);

    expect(nodes[0].relativePath).toBe("src");
    expect(nodes[1].relativePath).toBe("src/app.ts");

    expect(nodes[2].relativePath).toBe("tests");
    expect(nodes[3].relativePath).toBe("tests/app.test.ts");

    expect(nodes[4].relativePath).toBe("README.md");
  });

  it("sets all initial actions to none", () => {
    const nodes = parser.parse(["src/", "    app.ts", "README.md"], target);

    expect(nodes.every((node) => node.action === "none")).toBe(true);
  });

  it("creates the correct full paths", () => {
    const nodes = parser.parse(
      ["src/", "    components/", "        Button.tsx"],
      target,
    );

    expect(nodes[0].fullPath).toBe(`${target}/src`);

    expect(nodes[1].fullPath).toBe(`${target}/src/components`);

    expect(nodes[2].fullPath).toBe(`${target}/src/components/Button.tsx`);
  });

  it("does not include the target itself as a ForgeNode", () => {
    const nodes = parser.parse(["src/", "    app.ts"], target);

    expect(nodes.some((node) => node.fullPath === target)).toBe(false);
  });
});
