# Changelog

All notable changes to FileForge will be documented in this file.

The format is based on:

- [Keep a Changelog](https://keepachangelog.com/)
- Semantic Versioning

---

# [Unreleased]

## Planned

- Custom template variables
- Additional template engines
- More built-in project profiles
- Interactive project creation wizard

---

# [2.0.0] - 2026-08-15

## Added

### Markdown Definitions

- Added Markdown-based FileForge definition files using `.md`.
- Added support for fenced `fileforge` definition blocks.
- Only the first `fileforge` block is processed.
- Markdown files can contain normal documentation alongside the definition block.
- Added support for comments inside definition blocks.
- Added support for nested folder structures using indentation.
- Added support for single-line folder/file paths.
- Added support for special folder names such as `[dynamic-route]` and `(group)`.
- Added support for duplicate path detection.

### Preview and Execution

- Added preview mode as the default behavior.
- Added `-Run` execution mode.
- Added `-ShowActions` for detailed operation reporting.
- Added `-Force` for replacing existing files.
- Added detailed create/update/skip reporting.

### Project Tree Rendering

- Added explorer-style project tree output.
- Added sorted folder and file rendering.
- Added visual indicators for planned and executed actions.

### Templates

- Expanded extension-based template support.
- Added templates for additional file types including:
  - C#
  - Go
  - Rust
  - Vue
  - SCSS
  - YAML
  - YML
  - ENV
  - Shell
  - Docker
  - Docker Compose
  - Git ignore files

### Documentation

- Updated README with complete Markdown definition documentation.
- Added command usage examples for Windows, Linux, macOS and WSL.
- Added examples for preview, execution, force and action-reporting modes.
- Added documentation for running FileForge from any location.
- Added `test.md` as a simple example definition.

## Changed

- Definition files changed from `.txt` to `.md`.
- FileForge now reads project definitions from Markdown files.
- Updated command documentation and examples.
- Improved output rendering and execution summaries.

## Fixed

- Fixed dynamic route handling.
- Fixed nested folder rendering.
- Fixed path handling for special folder names.
- Improved duplicate path detection.

---

# [1.0.0] - 2026-07-18

## Added

### Core Features

- Initial release of FileForge.
- Generate folders and files from reusable definition files.
- Support multiple project structure profiles.
- Automatically select templates based on file extensions.
- Create starter files using reusable PowerShell templates.
- Add automatic file path headers.

### Safety Features

- Skip existing files containing content.
- Protect existing project files from accidental overwrite.
- Ask for confirmation when no target directory is provided.

### Reporting

- Added generation summary:
  - Total files
  - Created files
  - Skipped files
  - Failed files

### Included Profiles

- React application structure
- Node.js API structure
- .NET API structure
- Python service structure
- Company standard structure

### Included Templates

- TypeScript
- React TSX
- JavaScript
- CSS
- HTML
- JSON
- Python
- SQL

---

# Release Notes

## Versioning Strategy

FileForge follows:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.2.3
│ │ │
│ │ └── Bug fixes
│ └──── New features
└────── Breaking changes
```

---

# How to Add Changes

When adding a new change, place it under:

```text
[Unreleased]
```

before the next release.

Example:

```markdown
## Added

- Added Angular project profile.
- Added YAML template support.
```

When releasing:

1. Rename `[Unreleased]` to the version number.
2. Add the release date.
3. Create a new empty `[Unreleased]` section.

---

# Future Releases

Future versions will be documented here as FileForge evolves.
