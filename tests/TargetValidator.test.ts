// tests/TargetValidator.test.ts

import { describe, expect, it } from "vitest";

import { TargetValidator } from "../src/core/engine/TargetValidator";
import type { FileSystem } from "../src/core/ports/FileSystem";

function createFileSystem(overrides: Partial<FileSystem> = {}): FileSystem {
  return {
    exists: async () => true,
    isDirectory: async () => true,
    canAccess: async () => true,
    readFile: async () => "",
    writeFile: async () => {},
    createDirectory: async () => {},
    ...overrides,
  };
}

describe("TargetValidator", () => {
  it("rejects an empty target", async () => {
    const validator = new TargetValidator(createFileSystem());

    await expect(validator.validate("")).rejects.toThrow(
      "Target path cannot be empty",
    );
  });

  it("rejects a missing target", async () => {
    const validator = new TargetValidator(
      createFileSystem({
        exists: async () => false,
      }),
    );

    await expect(validator.validate("D:\\Missing")).rejects.toThrow(
      "Target directory does not exist",
    );
  });

  it("rejects an inaccessible target", async () => {
    const validator = new TargetValidator(
      createFileSystem({
        canAccess: async () => false,
      }),
    );

    await expect(validator.validate("D:\\Restricted")).rejects.toThrow(
      "Target directory cannot be accessed",
    );
  });

  it("rejects a file used as the target", async () => {
    const validator = new TargetValidator(
      createFileSystem({
        isDirectory: async () => false,
      }),
    );

    await expect(validator.validate("D:\\file.txt")).rejects.toThrow(
      "Target path is not a directory",
    );
  });

  it("accepts a valid accessible directory", async () => {
    const validator = new TargetValidator(createFileSystem());

    await expect(validator.validate("D:\\Projects")).resolves.toBeUndefined();
  });
});
