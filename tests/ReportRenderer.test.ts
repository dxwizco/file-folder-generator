// tests/ReportRenderer.test.ts

import { describe, expect, it } from "vitest";

import { ReportRenderer } from "../src/core/reporting/ReportRenderer";

import type { ForgeResult } from "../src/core/models/ForgeResult";
import type { ForgeNode } from "../src/core/models/ForgeNode";

describe("ReportRenderer", () => {
  const nodes: ForgeNode[] = [
    {
      name: "TestProject",
      relativePath: "TestProject",
      fullPath: "D:/WIP-Learn/file-forge-test/TestProject",
      isFolder: true,
      depth: 0,
      action: "folder",
    },
    {
      name: "app",
      relativePath: "TestProject/app",
      fullPath: "D:/WIP-Learn/file-forge-test/TestProject/app",
      isFolder: true,
      depth: 1,
      action: "folder",
    },
    {
      name: "page.tsx",
      relativePath: "TestProject/app/page.tsx",
      fullPath: "D:/WIP-Learn/file-forge-test/TestProject/app/page.tsx",
      isFolder: false,
      depth: 2,
      action: "create",
    },
    {
      name: "README.md",
      relativePath: "TestProject/README.md",
      fullPath: "D:/WIP-Learn/file-forge-test/TestProject/README.md",
      isFolder: false,
      depth: 1,
      action: "skip",
    },
  ];

  const baseResult: ForgeResult = {
    definition: {
      target: "D:/WIP-Learn/file-forge-test",
      lines: [],
    },
    nodes,
    validation: {
      valid: true,
      errors: [],
      warnings: [],
      duplicateCount: 0,
    },
    plan: {
      folders: 2,
      files: 2,
    },
  };

  describe("preview reports", () => {
    it("renders the FileForge execution header", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).toContain("FileForge Execution");
      expect(report).toContain("Target: D:/WIP-Learn/file-forge-test");
    });

    it("renders preview mode", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).toContain("Mode: PREVIEW");
    });

    it("renders plan statistics", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).toContain("PLAN SUMMARY:");
      expect(report).toContain("Folders planned: 2");
      expect(report).toContain("Files planned:   2");
      expect(report).toContain("Duplicates found:  0");

      expect(report).toContain("EXECUTION SUMMARY:");
      expect(report).toContain("No filesystem changes were made.");
      expect(report).toContain("FILE STRUCTURE");
    });

    it("renders validation status", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).toContain("Validation Status: Valid");
    });
  });

  describe("file structure", () => {
    it("renders folders", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).toContain("📁 TestProject  [FOLDER]");

      expect(report).toContain("📁 TestProject/app  [FOLDER]");
    });

    it("renders files", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).toContain("📄 TestProject/app/page.tsx  [CREATE]");

      expect(report).toContain("📄 TestProject/README.md  [SKIP]");
    });
  });

  describe("warnings", () => {
    it("renders validation warnings", () => {
      const renderer = new ReportRenderer();

      const result: ForgeResult = {
        ...baseResult,
        validation: {
          valid: true,
          errors: [],
          warnings: [
            "Duplicate path detected: D:/WIP-Learn/file-forge-test/TestProject/README.md",
          ],
          duplicateCount: 1,
        },
      };

      const report = renderer.render(result, "PREVIEW");

      expect(report).toContain("WARNINGS:");
      expect(report).toContain("Duplicate path detected");
    });
  });

  describe("errors", () => {
    it("renders validation errors", () => {
      const renderer = new ReportRenderer();

      const result: ForgeResult = {
        ...baseResult,
        validation: {
          valid: false,
          errors: ["Duplicate file path detected: TestProject/README.md"],
          warnings: [],
          duplicateCount: 1,
        },
      };

      const report = renderer.render(result, "PREVIEW");

      expect(report).toContain("Validation Status: Invalid");
      expect(report).toContain("ERRORS:");
      expect(report).toContain("Duplicate file path detected");
    });
  });

  describe("execution statistics", () => {
    it("renders execution statistics when execution exists", () => {
      const renderer = new ReportRenderer();

      const result: ForgeResult = {
        ...baseResult,
        execution: {
          folders: 2,
          created: 1,
          updated: 0,
          skipped: 1,
        },
      };

      const report = renderer.render(result, "GENERATE");

      expect(report).toContain("Mode: GENERATE");
      expect(report).toContain("Folders created: 2");
      expect(report).toContain("Files created:   1");
      expect(report).toContain("Files updated:   0");
      expect(report).toContain("Files skipped:   1");
    });

    it("does not invent execution statistics for preview mode", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).not.toContain("Folders created:");
      expect(report).not.toContain("Files created:");
    });
  });

  describe("all execution modes", () => {
    it("supports PREVIEW mode", () => {
      const renderer = new ReportRenderer();

      const report = renderer.render(baseResult, "PREVIEW");

      expect(report).toContain("Mode: PREVIEW");
    });

    it("supports GENERATE mode", () => {
      const renderer = new ReportRenderer();

      const result: ForgeResult = {
        ...baseResult,
        execution: {
          folders: 2,
          created: 1,
          updated: 0,
          skipped: 1,
        },
      };

      const report = renderer.render(result, "GENERATE");

      expect(report).toContain("Mode: GENERATE");
    });

    it("supports GENERATE_AND_OVERWRITE mode", () => {
      const renderer = new ReportRenderer();

      const result: ForgeResult = {
        ...baseResult,
        execution: {
          folders: 2,
          created: 1,
          updated: 1,
          skipped: 0,
        },
      };

      const report = renderer.render(result, "GENERATE_AND_OVERWRITE");

      expect(report).toContain("Mode: GENERATE_AND_OVERWRITE");

      expect(report).toContain("Files updated:   1");
    });
  });
});
