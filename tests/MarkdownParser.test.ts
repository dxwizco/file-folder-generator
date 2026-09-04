// tests/MarkdownParser.test.ts

import { describe, expect, it } from "vitest";

import { MarkdownParser } from "../src/core/engine/MarkdownParser";

describe("MarkdownParser", () => {
  const parser = new MarkdownParser();

  it("parses a valid DXWIZ block", () => {
    const content = `
# My Project

Some documentation.

\`\`\`dxwiz
target: "D:\\Projects\\MyProject"

src/
    app.ts
README.md
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");

    expect(result.lines).toEqual(["", "src/", "    app.ts", "README.md"]);
  });

  it("parses a single quoted target", () => {
    const content = `
\`\`\`dxwiz
target: 'D:\\Projects\\MyProject'

src/
    app.ts
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");

    expect(result.lines).toEqual(["", "src/", "    app.ts"]);
  });

  it("parses an unquoted target", () => {
    const content = `
\`\`\`dxwiz
target: D:\\Projects\\MyProject

src/
    app.ts
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");

    expect(result.lines).toEqual(["", "src/", "    app.ts"]);
  });

  it("accepts spaces around the target declaration", () => {
    const content = `
\`\`\`dxwiz
   target   :   "D:\\Projects\\MyProject"

src/
    app.ts
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");

    expect(result.lines).toEqual(["", "src/", "    app.ts"]);
  });

  it("recognizes TARGET case-insensitively", () => {
    const content = `
\`\`\`dxwiz
TARGET: "D:\\Projects\\MyProject"

README.md
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");

    expect(result.lines).toEqual(["", "README.md"]);
  });

  it("rejects a missing DXWIZ block", () => {
    const content = `
# My Project

There is no DXWIZ definition here.
`;

    expect(() => parser.parse(content)).toThrow(
      "No dxwiz block found in the document.",
    );
  });

  it("rejects an empty DXWIZ block", () => {
    const content = `
\`\`\`dxwiz
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow(
      "No dxwiz block found in the document.",
    );
  });

  it("rejects a DXWIZ block without a target", () => {
    const content = `
\`\`\`dxwiz
src/
    app.ts
README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path is required");
  });

  it("rejects an empty target", () => {
    const content = `
\`\`\`dxwiz
target:

README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path cannot be empty");
  });

  it("rejects an empty double-quoted target", () => {
    const content = `
\`\`\`dxwiz
target: ""

README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path cannot be empty");
  });

  it("rejects an empty single-quoted target", () => {
    const content = `
\`\`\`dxwiz
target: ''

README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path cannot be empty");
  });

  it("trims whitespace inside surrounding quotes", () => {
    const content = `
\`\`\`dxwiz
target: "  D:\\Projects\\MyProject  "

README.md
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");
  });

  it("removes only the target line from scaffold lines", () => {
    const content = `
\`\`\`dxwiz
# Project definition

target: "D:\\Projects\\MyProject"

src/
    app.ts

# Documentation
README.md
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");

    expect(result.lines).toEqual([
      "# Project definition",
      "",
      "",
      "src/",
      "    app.ts",
      "",
      "# Documentation",
      "README.md",
    ]);
  });

  it("preserves comments for TreeParser to process later", () => {
    const content = `
\`\`\`dxwiz
target: "D:\\Projects\\MyProject"

# Root source folder
src/
    app.ts # application entry point
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.lines).toEqual([
      "",
      "# Root source folder",
      "src/",
      "    app.ts # application entry point",
    ]);
  });

  it("parses a Unix-style target path", () => {
    const content = `
\`\`\`dxwiz
target: "/home/user/projects/myproject"

src/
    app.ts
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("/home/user/projects/myproject");
  });

  it("uses the first DXWIZ block", () => {
    const content = `
Some documentation.

\`\`\`dxwiz
target: "D:\\Projects\\First"

README.md
\`\`\`

Another block:

\`\`\`dxwiz
target: "D:\\Projects\\Second"

app.ts
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\First");

    expect(result.lines).toEqual(["", "README.md"]);
  });
});
