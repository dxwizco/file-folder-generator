// tests/Validator.test.ts

import { describe, expect, it } from "vitest";

import { Validator } from "../src/core/engine/Validator";
import type { ForgeNode } from "../src/core/models/ForgeNode";

function createNode(overrides: Partial<ForgeNode> = {}): ForgeNode {
  return {
    name: "app.ts",
    relativePath: "src/app.ts",
    fullPath: "D:\\Projects\\src\\app.ts",
    isFolder: false,
    depth: 1,
    action: "none",
    ...overrides,
  };
}

describe("Validator", () => {
  describe("valid nodes", () => {
    it("accepts a valid file", () => {
      const validator = new Validator();

      const result = validator.validate([createNode()]);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.duplicateCount).toBe(0);
    });

    it("accepts a valid folder", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "src",
          relativePath: "src",
          fullPath: "D:\\Projects\\src",
          isFolder: true,
          depth: 0,
          action: "folder",
        }),
      ]);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.duplicateCount).toBe(0);
    });

    it("accepts multiple unique nodes", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "src",
          relativePath: "src",
          fullPath: "D:\\Projects\\src",
          isFolder: true,
          depth: 0,
          action: "folder",
        }),
        createNode({
          name: "app.ts",
          relativePath: "src/app.ts",
          fullPath: "D:\\Projects\\src\\app.ts",
          depth: 1,
        }),
        createNode({
          name: "README.md",
          relativePath: "README.md",
          fullPath: "D:\\Projects\\README.md",
          depth: 0,
        }),
      ]);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.duplicateCount).toBe(0);
    });
  });

  describe("missing names", () => {
    it("rejects an empty node name", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "",
        }),
      ]);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Empty node name detected");
    });

    it("rejects a whitespace-only node name", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "   ",
        }),
      ]);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Empty node name detected");
    });

    it("reports multiple empty node names", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "",
          fullPath: "D:\\Projects\\one",
        }),
        createNode({
          name: "   ",
          fullPath: "D:\\Projects\\two",
        }),
      ]);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toEqual([
        "Empty node name detected",
        "Empty node name detected",
      ]);
    });
  });

  describe("invalid filesystem characters", () => {
    it.each(["<", ">", ":", '"', "|", "?", "*"])(
      "rejects the invalid character %s",
      (character) => {
        const validator = new Validator();

        const result = validator.validate([
          createNode({
            name: `file${character}.txt`,
            fullPath: `D:\\Projects\\file${character}.txt`,
          }),
        ]);

        expect(result.valid).toBe(false);

        expect(result.errors).toContain(
          `Invalid filesystem characters: D:\\Projects\\file${character}.txt`,
        );
      },
    );

    it("reports multiple nodes with invalid characters", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "bad?.txt",
          fullPath: "D:\\Projects\\bad?.txt",
        }),
        createNode({
          name: "bad*.txt",
          fullPath: "D:\\Projects\\bad*.txt",
        }),
      ]);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it("allows normal filesystem names", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "[dynamic-route]",
          fullPath: "D:\\Projects\\[dynamic-route]",
          isFolder: true,
          action: "folder",
        }),
        createNode({
          name: "(group)",
          relativePath: "(group)",
          fullPath: "D:\\Projects\\(group)",
          isFolder: true,
          action: "folder",
        }),
        createNode({
          name: "test-folder",
          relativePath: "test-folder",
          fullPath: "D:\\Projects\\test-folder",
          isFolder: true,
          action: "folder",
        }),
        createNode({
          name: "file_name.ts",
          relativePath: "file_name.ts",
          fullPath: "D:\\Projects\\file_name.ts",
        }),
      ]);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("allows path separators because TreeParser handles them", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "app.ts",
          relativePath: "src/app.ts",
          fullPath: "D:\\Projects\\src\\app.ts",
        }),
      ]);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("duplicate paths", () => {
    it("detects duplicate physical paths", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "README.md",
          relativePath: "README.md",
          fullPath: "D:\\Projects\\README.md",
        }),
        createNode({
          name: "README.md",
          relativePath: "README.md",
          fullPath: "D:\\Projects\\README.md",
        }),
      ]);

      expect(result.valid).toBe(true);
      expect(result.duplicateCount).toBe(1);

      expect(result.warnings).toContain(
        "Duplicate path detected: D:\\Projects\\README.md",
      );
    });

    it("detects more than two occurrences of the same path", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          fullPath: "D:\\Projects\\README.md",
        }),
        createNode({
          fullPath: "D:\\Projects\\README.md",
        }),
        createNode({
          fullPath: "D:\\Projects\\README.md",
        }),
      ]);

      expect(result.duplicateCount).toBe(1);
      expect(result.warnings).toEqual([
        "Duplicate path detected: D:\\Projects\\README.md",
      ]);
    });

    it("detects multiple different duplicate paths", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          fullPath: "D:\\Projects\\README.md",
        }),
        createNode({
          fullPath: "D:\\Projects\\README.md",
        }),
        createNode({
          fullPath: "D:\\Projects\\app.ts",
          name: "app.ts",
        }),
        createNode({
          fullPath: "D:\\Projects\\app.ts",
          name: "app.ts",
        }),
      ]);

      expect(result.duplicateCount).toBe(2);

      expect(result.warnings).toContain(
        "Duplicate path detected: D:\\Projects\\README.md",
      );

      expect(result.warnings).toContain(
        "Duplicate path detected: D:\\Projects\\app.ts",
      );
    });

    it("does not warn for unique physical paths", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          fullPath: "D:\\Projects\\one.ts",
          name: "one.ts",
        }),
        createNode({
          fullPath: "D:\\Projects\\two.ts",
          name: "two.ts",
        }),
      ]);

      expect(result.duplicateCount).toBe(0);
      expect(result.warnings).toEqual([]);
    });
  });

  describe("combined validation", () => {
    it("can report errors and duplicate warnings together", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          name: "",
          fullPath: "D:\\Projects\\README.md",
        }),
        createNode({
          name: "README.md",
          fullPath: "D:\\Projects\\README.md",
        }),
      ]);

      expect(result.valid).toBe(false);

      expect(result.errors).toContain("Empty node name detected");

      expect(result.warnings).toContain(
        "Duplicate path detected: D:\\Projects\\README.md",
      );

      expect(result.duplicateCount).toBe(1);
    });

    it("returns valid true when there are warnings but no errors", () => {
      const validator = new Validator();

      const result = validator.validate([
        createNode({
          fullPath: "D:\\Projects\\README.md",
        }),
        createNode({
          fullPath: "D:\\Projects\\README.md",
        }),
      ]);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toHaveLength(1);
    });
  });

  describe("empty input", () => {
    it("accepts an empty node list", () => {
      const validator = new Validator();

      const result = validator.validate([]);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.duplicateCount).toBe(0);
    });
  });
});
