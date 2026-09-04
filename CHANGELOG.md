# Changelog

All notable changes to File & Folder Generator will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

Changes for the next release will be listed here.

---

## [0.1.1] - 2026-09-04

### Changed

Renamed the extension display name from File & Folder Generator to File and Folder Generator to improve Marketplace searchability.
Added search keywords for file and folder generator queries.

## [0.1.0] - 2026-09-04

### Added

- Initial release of File & Folder Generator as a VS Code extension.
- Markdown-based project definitions using `dxwiz` fenced code blocks.
- Support for specifying a target directory with `target`.
- Indentation-based project structures.
- Single-line file and folder paths.
- Multiple root-level folders and files.
- Support for special folder names such as `[id]` and `(group)`.
- Full-line and inline comments in definitions.
- Processing of the first `dxwiz` block in a Markdown definition.
- Duplicate physical path detection.
- Validation of project definitions and target paths.
- Preview command for inspecting planned changes without modifying the target.
- Generate command for creating project structures while protecting existing files.
- Generate and Overwrite command for replacing existing files.
- Execution reports with validation status, planned actions, execution statistics, warnings, and generated file structures.
- Report files generated beside the source definition using the `.output.md` suffix.
- VS Code Output panel reporting.
- Basic starter templates for supported file extensions and file names.
- Generated file-path headers for supported file types.
- Reusable Markdown project definitions.

### Supported Templates

- C#
- CSS
- Environment files
- Go
- HTML
- JavaScript
- JSON
- React JavaScript
- Markdown
- PowerShell
- Python
- Rust
- SCSS
- Shell
- SQL
- TypeScript
- React TypeScript
- Vue
- YAML
- Docker
- Docker Compose
- Git ignore files

---

## Future Releases

New features, improvements, and fixes will be added to the appropriate release section as the project evolves.
