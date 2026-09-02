// tests/VSCodeFileSystem.test.ts

import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockStat, mockReadFile, mockWriteFile, mockCreateDirectory } =
  vi.hoisted(() => ({
    mockStat: vi.fn(),
    mockReadFile: vi.fn(),
    mockWriteFile: vi.fn(),
    mockCreateDirectory: vi.fn(),
  }));

vi.mock("vscode", () => ({
  workspace: {
    fs: {
      stat: mockStat,
      readFile: mockReadFile,
      writeFile: mockWriteFile,
      createDirectory: mockCreateDirectory,
    },
  },

  Uri: {
    file: vi.fn((path: string) => ({
      fsPath: path,
      path,
    })),
  },

  FileType: {
    Unknown: 0,
    File: 1,
    Directory: 2,
    SymbolicLink: 64,
  },
}));

import { VSCodeFileSystem } from "../src/adapters/filesystem/VSCodeFileSystem";

describe("VSCodeFileSystem", () => {
  let fileSystem: VSCodeFileSystem;

  beforeEach(() => {
    vi.clearAllMocks();

    fileSystem = new VSCodeFileSystem();
  });

  describe("exists", () => {
    it("returns true when the path exists", async () => {
      mockStat.mockResolvedValue({
        type: 1,
      });

      await expect(fileSystem.exists("D:\\Projects\\test.txt")).resolves.toBe(
        true,
      );

      expect(mockStat).toHaveBeenCalledTimes(1);
    });

    it("returns false when the path does not exist", async () => {
      mockStat.mockRejectedValue(new Error("File not found"));

      await expect(
        fileSystem.exists("D:\\Projects\\missing.txt"),
      ).resolves.toBe(false);
    });
  });

  describe("isDirectory", () => {
    it("returns true when the path is a directory", async () => {
      mockStat.mockResolvedValue({
        type: 2,
      });

      await expect(fileSystem.isDirectory("D:\\Projects")).resolves.toBe(true);
    });

    it("returns false when the path is a file", async () => {
      mockStat.mockResolvedValue({
        type: 1,
      });

      await expect(
        fileSystem.isDirectory("D:\\Projects\\file.txt"),
      ).resolves.toBe(false);
    });

    it("returns false when the path cannot be accessed", async () => {
      mockStat.mockRejectedValue(new Error("Access denied"));

      await expect(fileSystem.isDirectory("D:\\Restricted")).resolves.toBe(
        false,
      );
    });
  });

  describe("canAccess", () => {
    it("returns true when the path can be accessed", async () => {
      mockStat.mockResolvedValue({
        type: 2,
      });

      await expect(fileSystem.canAccess("D:\\Projects")).resolves.toBe(true);
    });

    it("returns false when the path cannot be accessed", async () => {
      mockStat.mockRejectedValue(new Error("Access denied"));

      await expect(fileSystem.canAccess("D:\\Restricted")).resolves.toBe(false);
    });
  });

  describe("readFile", () => {
    it("reads UTF-8 file content", async () => {
      mockReadFile.mockResolvedValue(
        new TextEncoder().encode("Hello FileForge"),
      );

      await expect(fileSystem.readFile("D:\\Projects\\test.txt")).resolves.toBe(
        "Hello FileForge",
      );

      expect(mockReadFile).toHaveBeenCalledTimes(1);
    });

    it("propagates read errors", async () => {
      mockReadFile.mockRejectedValue(new Error("Read failed"));

      await expect(
        fileSystem.readFile("D:\\Projects\\test.txt"),
      ).rejects.toThrow("Read failed");
    });
  });

  describe("writeFile", () => {
    it("writes UTF-8 file content", async () => {
      mockWriteFile.mockResolvedValue(undefined);

      await expect(
        fileSystem.writeFile("D:\\Projects\\test.txt", "Hello FileForge"),
      ).resolves.toBeUndefined();

      expect(mockWriteFile).toHaveBeenCalledTimes(1);
    });

    it("propagates write errors", async () => {
      mockWriteFile.mockRejectedValue(new Error("Write failed"));

      await expect(
        fileSystem.writeFile("D:\\Projects\\test.txt", "Hello FileForge"),
      ).rejects.toThrow("Write failed");
    });
  });

  describe("createDirectory", () => {
    it("creates a directory", async () => {
      mockCreateDirectory.mockResolvedValue(undefined);

      await expect(
        fileSystem.createDirectory("D:\\Projects\\src\\components"),
      ).resolves.toBeUndefined();

      expect(mockCreateDirectory).toHaveBeenCalledTimes(1);
    });

    it("propagates directory creation errors", async () => {
      mockCreateDirectory.mockRejectedValue(
        new Error("Create directory failed"),
      );

      await expect(
        fileSystem.createDirectory("D:\\Projects\\src"),
      ).rejects.toThrow("Create directory failed");
    });
  });
});
