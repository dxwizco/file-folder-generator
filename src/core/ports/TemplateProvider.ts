// src/core/ports/TemplateProvider.ts

export interface TemplateProvider {
  /**
   * Generate the initial content for a file.
   *
   * The path is relative to the FileForge target.
   */
  getTemplate(path: string): string;
}
