// src/adapters/templates/DefaultTemplateProvider.ts

import type { TemplateProvider } from "../../core/ports/TemplateProvider";

import { createComposeDevYamlTemplate } from "./definitions/compose.dev.yaml";
import { createComposeYamlTemplate } from "./definitions/compose.yaml";
import { createCsTemplate } from "./definitions/cs";
import { createCssTemplate } from "./definitions/css";
import { createDockerfileBackendTemplate } from "./definitions/dockerfile.backend";
import { createDockerfileFrontendTemplate } from "./definitions/dockerfile.frontend";
import { createDockerfileTemplate } from "./definitions/dockerfile";
import { createDockerignoreTemplate } from "./definitions/dockerignore";
import { createEnvTemplate } from "./definitions/env";
import { createGitignoreTemplate } from "./definitions/gitignore";
import { createGoTemplate } from "./definitions/go";
import { createHtmlTemplate } from "./definitions/html";
import { createJsTemplate } from "./definitions/js";
import { createJsonTemplate } from "./definitions/json";
import { createJsxTemplate } from "./definitions/jsx";
import { createMdTemplate } from "./definitions/md";
import { createPs1Template } from "./definitions/ps1";
import { createPyTemplate } from "./definitions/py";
import { createRsTemplate } from "./definitions/rs";
import { createScssTemplate } from "./definitions/scss";
import { createShTemplate } from "./definitions/sh";
import { createSqlTemplate } from "./definitions/sql";
import { createTsTemplate } from "./definitions/ts";
import { createTsxTemplate } from "./definitions/tsx";
import { createVueTemplate } from "./definitions/vue";
import { createYamlTemplate } from "./definitions/yaml";
import { createYmlTemplate } from "./definitions/yml";

type TemplateFunction = (fileName: string) => string;

export class DefaultTemplateProvider implements TemplateProvider {
  private readonly exactTemplates: Record<string, TemplateFunction>;

  private readonly extensionTemplates: Record<string, TemplateFunction>;

  constructor() {
    this.exactTemplates = {
      "compose.dev.yaml": createComposeDevYamlTemplate,
      "compose.yaml": createComposeYamlTemplate,
      dockerfile: createDockerfileTemplate,
      "dockerfile.backend": createDockerfileBackendTemplate,
      "dockerfile.frontend": createDockerfileFrontendTemplate,
      ".dockerignore": createDockerignoreTemplate,
      ".gitignore": createGitignoreTemplate,
      ".env": createEnvTemplate,
    };

    this.extensionTemplates = {
      ".cs": createCsTemplate,
      ".css": createCssTemplate,
      ".go": createGoTemplate,
      ".html": createHtmlTemplate,
      ".js": createJsTemplate,
      ".json": createJsonTemplate,
      ".jsx": createJsxTemplate,
      ".md": createMdTemplate,
      ".ps1": createPs1Template,
      ".py": createPyTemplate,
      ".rs": createRsTemplate,
      ".scss": createScssTemplate,
      ".sh": createShTemplate,
      ".sql": createSqlTemplate,
      ".ts": createTsTemplate,
      ".tsx": createTsxTemplate,
      ".vue": createVueTemplate,
      ".yaml": createYamlTemplate,
      ".yml": createYmlTemplate,
    };
  }

  getTemplate(path: string): string {
    const normalizedPath = path.replace(/\\/g, "/");

    const fileName = this.getFileName(normalizedPath);
    const lowerFileName = fileName.toLowerCase();

    const extension = this.getExtension(fileName);

    const templateFunction =
      this.exactTemplates[lowerFileName] ?? this.extensionTemplates[extension];

    const fileNameWithoutExtension = this.getFileNameWithoutExtension(fileName);

    const content = templateFunction
      ? templateFunction(fileNameWithoutExtension)
      : "";

    const header = this.getCommentHeader(extension, fileName, normalizedPath);

    if (!header) {
      return content;
    }

    if (!content) {
      return header;
    }

    return `${header}\n\n${content}`;
  }

  private getFileName(path: string): string {
    const normalized = path.replace(/\\/g, "/");

    const lastSlash = normalized.lastIndexOf("/");

    if (lastSlash === -1) {
      return normalized;
    }

    return normalized.substring(lastSlash + 1);
  }

  private getExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot <= 0) {
      return "";
    }

    return fileName.substring(lastDot).toLowerCase();
  }

  private getFileNameWithoutExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot <= 0) {
      return fileName;
    }

    return fileName.substring(0, lastDot);
  }

  private getCommentHeader(
    extension: string,
    fileName: string,
    path: string,
  ): string {
    switch (extension) {
      case ".ts":
      case ".tsx":
      case ".js":
      case ".jsx":
      case ".cs":
      case ".go":
      case ".rs":
        return `// ${path}`;

      case ".css":
      case ".scss":
        return `/* ${path} */`;

      case ".html":
      case ".md":
      case ".vue":
        return `<!-- ${path} -->`;

      case ".py":
      case ".ps1":
      case ".yml":
      case ".yaml":
      case ".env":
        return `# ${path}`;

      case ".sql":
        return `-- ${path}`;

      case ".sh":
        return `#!/bin/bash\n# ${path}`;

      case ".json":
        return "";

      default:
        break;
    }

    const lowerFileName = fileName.toLowerCase();

    if (
      lowerFileName.startsWith("dockerfile") ||
      lowerFileName.endsWith(".example") ||
      lowerFileName === ".env" ||
      lowerFileName === ".gitignore" ||
      lowerFileName === ".dockerignore" ||
      extension === ""
    ) {
      if (lowerFileName === "license") {
        return "";
      }

      return `# ${path}`;
    }

    return "";
  }
}
