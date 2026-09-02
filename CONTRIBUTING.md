# Contributing to FileForge

Thank you for your interest in improving FileForge.

FileForge is built to help developers create consistent project structures quickly and safely. Contributions such as bug fixes, new templates, documentation improvements, and feature ideas are welcome.

---

# Ways to Contribute

There are several ways you can help:

- Report bugs
- Suggest new features
- Improve documentation
- Add new project definitions
- Add new templates
- Improve existing scripts
- Submit pull requests

---

# Before You Start

Before making changes:

1. Check existing issues to avoid duplicate work.
2. Create an issue for major changes or new features.
3. Keep changes focused and easy to review.
4. Update documentation when behavior changes.

---

# Repository Structure

The main project structure:

```text
FileForge
│
├── files
│   └── Project structure definitions
│
├── templates
│   └── File creation templates
│
├── FileForge.ps1
│   └── Main generation engine
│
├── Templates.ps1
│   └── Template management
│
└── Documentation files
```

---

# Adding a New File Definition

File definitions are stored inside:

```text
files/
```

Example:

```text
files/vue-app.txt
```

A definition should contain one path per line:

```text
src/components/App.vue
src/assets/style.css
package.json
README.md
```

Guidelines:

- Use clear profile names.
- Keep structures realistic.
- Avoid unnecessary files.
- Add comments when needed.

Example:

```text
# Vue application structure

src/App.vue
src/main.js
```

---

# Adding a New Template

Templates are stored inside:

```text
templates/
```

Example:

```text
templates/vue.ps1
```

When adding a template:

- Follow existing naming conventions.
- Keep generated output clean.
- Include appropriate headers if required.
- Test with a sample project.

---

# Reporting Bugs

When reporting a bug, include:

- Operating system
- PowerShell version
- FileForge version or commit
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages or logs

Example:

```text
PowerShell:
7.4.x

OS:
Windows 11

Issue:
Template is not selected for .xyz files.
```

---

# Suggesting Features

Feature requests should explain:

- What problem the feature solves
- Why it would be useful
- Possible implementation approach
- Example usage

Good example:

> Add support for custom variables inside templates so project names can automatically replace placeholders.

---

# Development Guidelines

## PowerShell Style

Please follow these practices:

- Use clear variable names.
- Keep functions focused.
- Add comments for complex logic.
- Avoid unnecessary complexity.
- Maintain compatibility with PowerShell 7+.

---

## Testing Changes

Before submitting a pull request:

1. Test existing profiles.
2. Test new functionality.
3. Confirm existing files are not overwritten.
4. Verify summary output is correct.

Example:

```powershell
.\FileForge.ps1 `
-File react-app `
-Target "./TestProject"
```

---

# Pull Request Guidelines

Before submitting:

- Keep commits focused.
- Explain what changed.
- Include testing details.
- Update documentation if needed.

A good pull request description includes:

```text
## Changes

Added Vue project definition.

## Testing

Generated sample Vue structure successfully.

## Notes

No existing behavior changed.
```

---

# Code Review

All contributions are reviewed before merging.

Review focuses on:

- Correctness
- Simplicity
- Maintainability
- Documentation quality
- Compatibility

---

# Contribution License

By submitting a contribution to FileForge, you agree that your contribution may be distributed under the same MIT License as the project.

---

# Thank You

Every improvement helps make FileForge more useful for developers.

Whether you fix a typo, add a template, or improve the engine, your contribution is appreciated.
