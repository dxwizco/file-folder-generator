// tests/DefaultTemplateProvider.test.ts

import { describe, expect, it } from "vitest";

import { DefaultTemplateProvider } from "../src/adapters/templates/DefaultTemplateProvider";

describe("DefaultTemplateProvider", () => {
  const provider = new DefaultTemplateProvider();

  describe("exact filename templates", () => {
    it("provides a Dockerfile template", () => {
      const content = provider.getTemplate("Dockerfile");

      expect(content).toContain("#");
      expect(content).toContain("This is docker file");
    });

    it("provides a backend Dockerfile template", () => {
      const content = provider.getTemplate("Dockerfile.backend");

      expect(content).toContain("BACKEND ENVIRONMENT");
      expect(content).toContain("FROM node:20-alpine");
    });

    it("provides a frontend Dockerfile template", () => {
      const content = provider.getTemplate("Dockerfile.frontend");

      expect(content).toContain("FRONTEND ENVIRONMENT");
      expect(content).toContain("FROM node:20-alpine AS build");
      expect(content).toContain("FROM nginx:alpine");
    });

    it("provides a dockerignore template", () => {
      const content = provider.getTemplate(".dockerignore");

      expect(content).toContain("node_modules");
      expect(content).toContain(".env");
    });

    it("provides a gitignore template", () => {
      const content = provider.getTemplate(".gitignore");

      expect(content).toContain("node_modules/");
      expect(content).toContain(".vscode/");
    });

    it("provides an env template", () => {
      const content = provider.getTemplate(".env");

      expect(content).toContain("PORT=3000");
      expect(content).toContain("NODE_ENV=development");
    });

    it("provides compose.yaml template", () => {
      const content = provider.getTemplate("compose.yaml");

      expect(content).toContain("This is for dev template");
    });

    it("provides compose.dev.yaml template", () => {
      const content = provider.getTemplate("compose.dev.yaml");

      expect(content).toContain("This is for dev template");
    });
  });

  describe("extension templates", () => {
    it("provides a TypeScript template", () => {
      const content = provider.getTemplate("app.ts");

      expect(content).toContain("export {};");
    });

    it("provides a TSX template using the filename", () => {
      const content = provider.getTemplate("Button.tsx");

      expect(content).toContain("ButtonProps");
      expect(content).toContain("Button");
    });

    it("provides a JavaScript template", () => {
      const content = provider.getTemplate("app.js");

      expect(content).toContain("export {};");
    });

    it("provides a JSON template", () => {
      const content = provider.getTemplate("config.json");

      expect(content).toContain("{");
      expect(content).toContain("}");
    });

    it("provides a CSS template", () => {
      const content = provider.getTemplate("styles.css");

      expect(content).toContain(":root");
    });

    it("provides an HTML template using the filename", () => {
      const content = provider.getTemplate("index.html");

      expect(content).toContain("<!DOCTYPE html>");
      expect(content).toContain("<title>index</title>");
    });

    it("provides a Python template", () => {
      const content = provider.getTemplate("main.py");

      expect(content).toContain("def main():");
      expect(content).toContain('if __name__ == "__main__":');
    });

    it("provides a Go template", () => {
      const content = provider.getTemplate("main.go");

      expect(content).toContain("package main");
      expect(content).toContain("Hello from main!");
    });

    it("provides a C# template", () => {
      const content = provider.getTemplate("Program.cs");

      expect(content).toContain("using System;");
      expect(content).toContain("class Program");
      expect(content).toContain("Hello from Program!");
    });

    it("provides a Rust template", () => {
      const content = provider.getTemplate("main.rs");

      expect(content).toContain("fn main()");
      expect(content).toContain("Hello from main!");
    });

    it("provides a Markdown template", () => {
      const content = provider.getTemplate("README.md");

      expect(content).toContain("# README");
      expect(content).toContain("Project setup document.");
    });

    it("provides a Vue template", () => {
      const content = provider.getTemplate("App.vue");

      expect(content).toContain("<template>");
      expect(content).toContain("App Component");
    });

    it("provides a YAML template", () => {
      const content = provider.getTemplate("config.yaml");

      expect(content).toContain("version: '3.8'");
      expect(content).toContain("name: config");
    });

    it("provides a YML template", () => {
      const content = provider.getTemplate("config.yml");

      expect(content).toContain("version: '3.8'");
      expect(content).toContain("name: config");
    });

    it("provides a shell template", () => {
      const content = provider.getTemplate("build.sh");

      expect(content).toContain("set -e");
      expect(content).toContain("Running build...");
    });

    it("provides a PowerShell template", () => {
      const content = provider.getTemplate("build.ps1");

      expect(content).toContain("[CmdletBinding()]");
      expect(content).toContain("Running build");
    });

    it("provides an SQL template", () => {
      const content = provider.getTemplate("schema.sql");

      expect(content).toContain("-- SQL goes here");
    });

    it("provides an SCSS template", () => {
      const content = provider.getTemplate("styles.scss");

      expect(content).toContain("$primary-color");
      expect(content).toContain("font-family");
    });

    it("provides a JSX template", () => {
      const content = provider.getTemplate("Button.jsx");

      expect(content).toContain("import React from 'react'");
      expect(content).toContain("Button");
    });
  });

  describe("filename handling", () => {
    it("handles Windows-style paths", () => {
      const content = provider.getTemplate("src\\components\\Button.tsx");

      expect(content).toContain("ButtonProps");
      expect(content).toContain("Button");
    });

    it("handles Unix-style paths", () => {
      const content = provider.getTemplate("src/components/Button.tsx");

      expect(content).toContain("ButtonProps");
      expect(content).toContain("Button");
    });

    it("matches extensions case-insensitively", () => {
      const content = provider.getTemplate("APP.TS");

      expect(content).toContain("export {};");
    });

    it("matches exact filenames case-insensitively", () => {
      const content = provider.getTemplate("DOCKERFILE");

      expect(content).toContain("This is docker file");
    });

    it("uses the filename without extension for templates", () => {
      const content = provider.getTemplate("MyComponent.tsx");

      expect(content).toContain("MyComponentProps");
      expect(content).toContain("MyComponent");
    });
  });

  describe("comment headers", () => {
    it("adds a TypeScript comment header", () => {
      const content = provider.getTemplate("src/app.ts");

      expect(content.startsWith("// src/app.ts")).toBe(true);
    });

    it("adds a CSS comment header", () => {
      const content = provider.getTemplate("styles.css");

      expect(content.startsWith("/* styles.css */")).toBe(true);
    });

    it("adds a Markdown comment header", () => {
      const content = provider.getTemplate("README.md");

      expect(content.startsWith("<!-- README.md -->")).toBe(true);
    });

    it("adds a Python comment header", () => {
      const content = provider.getTemplate("main.py");

      expect(content.startsWith("# main.py")).toBe(true);
    });

    it("adds an SQL comment header", () => {
      const content = provider.getTemplate("schema.sql");

      expect(content.startsWith("-- schema.sql")).toBe(true);
    });

    it("does not add a JSON comment header", () => {
      const content = provider.getTemplate("config.json");

      expect(content.startsWith("//")).toBe(false);
      expect(content.startsWith("/*")).toBe(false);
      expect(content.startsWith("#")).toBe(false);
      expect(content.startsWith("--")).toBe(false);
    });
  });

  describe("unsupported files", () => {
    it("returns an empty string for an unsupported extension", () => {
      const content = provider.getTemplate("unknown.xyz");

      expect(content).toBe("");
    });

    it("returns an empty string for an unsupported filename without extension", () => {
      const content = provider.getTemplate("LICENSE");

      expect(content).toBe("");
    });
  });
});
