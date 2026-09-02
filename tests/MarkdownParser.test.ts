// tests/MarkdownParser.test.ts

import { describe, expect, it } from "vitest";

import { MarkdownParser } from "../src/core/engine/MarkdownParser";

describe("MarkdownParser", () => {
  const parser = new MarkdownParser();

  it("parses a valid FileForge block", () => {
    const content = `
# My Project

Some documentation.

\`\`\`fileforge
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
\`\`\`fileforge
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
\`\`\`fileforge
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
\`\`\`fileforge
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
\`\`\`fileforge
TARGET: "D:\\Projects\\MyProject"

README.md
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");

    expect(result.lines).toEqual(["", "README.md"]);
  });

  it("rejects a missing FileForge block", () => {
    const content = `
# My Project

There is no FileForge definition here.
`;

    expect(() => parser.parse(content)).toThrow(
      "No fileforge block found in the document.",
    );
  });

  it("rejects an empty FileForge block", () => {
    const content = `
\`\`\`fileforge
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow(
      "No fileforge block found in the document.",
    );
  });

  it("rejects a FileForge block without a target", () => {
    const content = `
\`\`\`fileforge
src/
    app.ts
README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path is required");
  });

  it("rejects an empty target", () => {
    const content = `
\`\`\`fileforge
target:

README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path cannot be empty");
  });

  it("rejects an empty double-quoted target", () => {
    const content = `
\`\`\`fileforge
target: ""

README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path cannot be empty");
  });

  it("rejects an empty single-quoted target", () => {
    const content = `
\`\`\`fileforge
target: ''

README.md
\`\`\`
`;

    expect(() => parser.parse(content)).toThrow("Target path cannot be empty");
  });

  it("trims whitespace inside surrounding quotes", () => {
    const content = `
\`\`\`fileforge
target: "  D:\\Projects\\MyProject  "

README.md
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\MyProject");
  });

  it("removes only the target line from scaffold lines", () => {
    const content = `
\`\`\`fileforge
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
\`\`\`fileforge
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
\`\`\`fileforge
target: "/home/user/projects/myproject"

src/
    app.ts
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("/home/user/projects/myproject");
  });

  it("uses the first FileForge block", () => {
    const content = `
Some documentation.

\`\`\`fileforge
target: "D:\\Projects\\First"

README.md
\`\`\`

Another block:

\`\`\`fileforge
target: "D:\\Projects\\Second"

app.ts
\`\`\`
`;

    const result = parser.parse(content);

    expect(result.target).toBe("D:\\Projects\\First");

    expect(result.lines).toEqual(["", "README.md"]);
  });
});
