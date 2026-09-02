# FileForge

> A lightweight, cross-platform PowerShell scaffolding engine that generates project structures, files, and starter templates from reusable Markdown definitions.

![PowerShell](https://img.shields.io/badge/PowerShell-7%2B-blue)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

FileForge helps developers create consistent project structures without manually creating folders, files, and starter templates every time.

Define your project structure once, store it as a reusable Markdown definition, and generate it whenever you start a new project.

---

# ✨ Features

- ⚡ No installation required
- 🐚 Runs with PowerShell 7+
- 🌎 Windows, Linux, macOS, and WSL support
- 📁 Generate folders and files from Markdown definitions
- 📝 Keep human-readable documentation and the FileForge definition in the same `.md` file
- 🧩 Use a dedicated `fileforge` fenced code block for the project definition
- 🎯 Only the first `fileforge` block is processed
- 💬 Support full-line and inline comments
- 🌳 Support indentation-based project trees
- 📂 Support nested folders and files
- 🔗 Support single-line folder/file paths
- 🧱 Support special folder names such as `[dynamic-route]` and `(group)`
- 🎨 Automatically select templates based on file extension or file name
- 🏷 Automatically add generated file-path headers where supported
- 👀 Preview changes before execution
- 📊 Show detailed create/update/skip actions
- 🛡 Protect existing files by default
- ♻️ Force replacement of existing files when required
- ⚠️ Detect duplicate physical paths
- 📚 Support multiple reusable project definitions

---

# 🚀 Quick Start

## Requirements

FileForge requires:

- PowerShell 7+

Check your PowerShell version:

```powershell
$PSVersionTable.PSVersion
```

PowerShell is available as `pwsh` on Linux and macOS.

Supported platforms:

- Windows
- Linux
- macOS
- WSL

---

# 📥 Get FileForge

Clone the repository:

```bash
git clone https://github.com/dxwizco/FileForge.git
```

Enter the FileForge directory:

```bash
cd FileForge
```

FileForge does not require a traditional installation.

---

# 🧠 How FileForge Works

FileForge follows a simple process:

```text
Markdown Definition
        │
        ▼
   Parse Definition
        │
        ▼
   Build File Tree
        │
        ▼
     Validate
        │
        ▼
      Plan
        │
        ▼
 Preview or Execute
```

A definition describes the folders and files you want to create.

FileForge then:

1. Reads the Markdown definition.
2. Finds the first `fileforge` code block.
3. Parses the folder/file structure.
4. Validates the resulting tree.
5. Determines what actions are required.
6. Displays the planned structure.
7. Creates or updates files only when execution is requested.

---

# 📄 FileForge Definitions

FileForge definitions are Markdown files containing a `fileforge` fenced code block.

Built-in definitions are stored inside:

```text
files/
```

For example:

```text
files/test.md
files/todo.md
```

Unlike the older `.txt` format, FileForge definitions are now Markdown files.

This allows you to keep:

- Documentation
- Explanations
- Commands
- Examples
- The actual FileForge definition

all inside one file.

# 📍 Definition Selection & Path Scenarios

FileForge supports definitions located either inside the FileForge repository or anywhere else on the filesystem.

The location from which `FileForge.ps1` is launched does not determine where the definition or target must be located.

The following three paths are handled independently:

```text
Current working directory
          │
          ├── FileForge script location
          │
          ├── Definition path (-File)
          │
          └── Target path (-Target)
```

This allows FileForge to be launched from any directory while using either built-in or external definitions and generating into either an internal or external target.

---

## Case 1 — No `-File`

When `-File` is omitted, FileForge uses the default definition:

```text
files/test.md
```

Run from the FileForge directory:

### Windows PowerShell

```powershell
.\FileForge.ps1 -Target ".\Project"
```

### Linux / macOS / WSL

```bash
pwsh ./FileForge.ps1 -Target "./Project"
```

The definition resolves to:

```text
D:\WIP-DOC\FileForge\files\test.md
```

on the example Windows installation.

Expected output includes:

```text
Definition:
 D:\WIP-DOC\FileForge\files\test.md

Target:
 D:\WIP-DOC\FileForge\Project
```

The exact paths depend on where FileForge is installed.

---

## Case 2 — Built-in Definition by Name

A definition can be selected by its name.

For example:

### Windows PowerShell

```powershell
.\FileForge.ps1 -File "test" -Target ".\Project"
```

### Linux / macOS / WSL

```bash
pwsh ./FileForge.ps1 -File "test" -Target "./Project"
```

FileForge resolves:

```text
test
```

to:

```text
files/test.md
```

For example:

```text
D:\WIP-DOC\FileForge\files\test.md
```

Expected output:

```text
Definition:
 D:\WIP-DOC\FileForge\files\test.md

Target:
 D:\WIP-DOC\FileForge\Project
```

---

## Case 3 — Built-in Definition With `.md` Extension

The built-in definition can also be specified with its extension.

### Windows PowerShell

```powershell
.\FileForge.ps1 -File "test.md" -Target ".\Project"
```

### Linux / macOS / WSL

```bash
pwsh ./FileForge.ps1 -File "test.md" -Target "./Project"
```

This resolves to the same definition:

```text
files/test.md
```

For example:

```text
D:\WIP-DOC\FileForge\files\test.md
```

Therefore these two commands select the same definition:

```powershell
.\FileForge.ps1 -File "test" -Target ".\Project"

.\FileForge.ps1 -File "test.md" -Target ".\Project"
```

---

## Case 4 — External Absolute Definition

A definition can be stored completely outside the FileForge repository.

Example:

```text
D:\ProjectDefinitions\backend.md
```

### Windows PowerShell

```powershell
.\FileForge.ps1 `
    -File "D:\ProjectDefinitions\backend.md" `
    -Target "D:\Projects\ProjectX"
```

Or on one line:

```powershell
.\FileForge.ps1 -File "D:\ProjectDefinitions\backend.md" -Target "D:\Projects\ProjectX"
```

### Linux / macOS / WSL

```bash
pwsh ./FileForge.ps1 \
    -File "/home/user/ProjectDefinitions/backend.md" \
    -Target "/home/user/Projects/ProjectX"
```

FileForge uses the specified external definition directly.

It does **not** search:

```text
files/backend.md
```

when an explicit external path was provided.

Expected output:

```text
Definition:
 D:\ProjectDefinitions\backend.md

Target:
 D:\Projects\ProjectX
```

---

## Case 5 — External Relative Definition

A definition can also be specified using a relative path.

For example, suppose the current directory is:

```text
D:\Projects\ProjectX
```

and the definition is:

```text
D:\Projects\ProjectX\definitions\backend.md
```

### Windows PowerShell

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" `
    -File ".\definitions\backend.md" `
    -Target "."
```

Or:

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" -File ".\definitions\backend.md" -Target "."
```

### Linux / macOS / WSL

```bash
pwsh "/home/user/FileForge/FileForge.ps1" \
    -File "./definitions/backend.md" \
    -Target "."
```

The relative definition path is resolved from the **current working directory**, not from the FileForge installation directory.

For the Windows example:

```text
Current directory:
D:\Projects\ProjectX

Specified:
.\definitions\backend.md

Resolved:
D:\Projects\ProjectX\definitions\backend.md
```

---

## Case 6 — FileForge Launched From Outside Its Directory

FileForge can be launched from any working directory.

For example, suppose:

```text
FileForge:
D:\WIP-DOC\FileForge\FileForge.ps1

Current directory:
D:\WIP-DOC\TestFolder
```

Run:

### Windows PowerShell

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" `
    -File "test" `
    -Target "D:\WIP-DOC\FileForge\Project"
```

The current directory does not change how the built-in definition is located.

FileForge still uses:

```text
D:\WIP-DOC\FileForge\files\test.md
```

and generates into:

```text
D:\WIP-DOC\FileForge\Project
```

Expected:

```text
Definition:
 D:\WIP-DOC\FileForge\files\test.md

Target:
 D:\WIP-DOC\FileForge\Project
```

---

## Case 7 — External Definition + External Target

FileForge can be launched from one directory while both the definition and target are somewhere else.

Example:

```text
FileForge:
D:\WIP-DOC\FileForge\FileForge.ps1

Definition:
D:\WIP-DOC\TestFolder\remote.md

Target:
D:\Projects\ProjectX

Current directory:
D:\WIP-DOC\TestFolder
```

Run:

### Windows PowerShell

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" `
    -File "D:\WIP-DOC\TestFolder\remote.md" `
    -Target "D:\Projects\ProjectX"
```

Or one line:

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" -File "D:\WIP-DOC\TestFolder\remote.md" -Target "D:\Projects\ProjectX"
```

### Linux / macOS / WSL

```bash
pwsh "/home/user/FileForge/FileForge.ps1" \
    -File "/home/user/TestFolder/remote.md" \
    -Target "/home/user/Projects/ProjectX"
```

Expected:

```text
Definition:
 D:\WIP-DOC\TestFolder\remote.md

Target:
 D:\Projects\ProjectX
```

This is the fully external scenario:

```text
FileForge installation   → one location
Definition               → another location
Target                   → another location
Current directory        → can be another location again
```

---

## Case 8 — External Definition + Target Inside FileForge

The definition and target do not have to be on the same side of the FileForge installation.

For example:

```text
FileForge:
D:\WIP-DOC\FileForge\FileForge.ps1

Definition:
D:\WIP-DOC\TestFolder\remote.md

Target:
D:\WIP-DOC\FileForge\Project
```

Run:

### Windows PowerShell

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" `
    -File "D:\WIP-DOC\TestFolder\remote.md" `
    -Target "D:\WIP-DOC\FileForge\Project"
```

### Linux / macOS / WSL

```bash
pwsh "/home/user/FileForge/FileForge.ps1" \
    -File "/home/user/TestFolder/remote.md" \
    -Target "/home/user/FileForge/Project"
```

The important point is that `-File` and `-Target` are resolved independently.

---

# 📊 Complete Path Scenario Matrix

The following scenarios cover the supported combinations of FileForge location, definition location, target location, and current working directory.

| Case | FileForge launched from | Definition | Target            | Result |
| ---- | ----------------------- | ---------- | ----------------- | ------ |
| 1    | Inside FileForge        | Built-in   | Inside FileForge  | ✅     |
| 2    | Inside FileForge        | Built-in   | Outside FileForge | ✅     |
| 3    | Inside FileForge        | External   | Outside FileForge | ✅     |
| 4    | Outside FileForge       | Built-in   | Inside FileForge  | ✅     |
| 5    | Outside FileForge       | Built-in   | Outside FileForge | ✅     |
| 6    | Outside FileForge       | External   | Outside FileForge | ✅     |
| 7    | Outside FileForge       | External   | Inside FileForge  | ✅     |

The important behavior is:

```text
Built-in definition
        │
        └── resolved relative to FileForge

Explicit absolute definition
        │
        └── used directly

Explicit relative definition
        │
        └── resolved relative to the current working directory

Target
        │
        └── resolved independently from the definition
```

---

# ❌ Missing Definition Behavior

FileForge must not silently fall back to another definition when the requested definition cannot be found.

For example:

### Windows PowerShell

```powershell
.\FileForge.ps1 -File "doesnotexist" -Target ".\Project"
```

### Linux / macOS / WSL

```bash
pwsh ./FileForge.ps1 -File "doesnotexist" -Target "./Project"
```

Expected behavior:

```text
❌ Definition error

FileForge definition was not found.

Specified definition:
doesnotexist

Expected location:
D:\WIP-DOC\FileForge\files\doesnotexist.md

Please verify that the definition name is correct or provide an explicit path.
```

FileForge must **not** silently fall back to:

```text
files/test.md
```

when:

```text
doesnotexist
```

was explicitly requested.

---

# ❌ Missing External Definition

The same rule applies to explicit paths.

For example:

```powershell
.\FileForge.ps1 `
    -File "D:\ProjectDefinitions\backend.md" `
    -Target "D:\Projects\ProjectX"
```

If the file does not exist, FileForge reports a definition error.

It must not attempt to replace the requested file with another definition from:

```text
files/
```

Example:

```text
❌ Definition error

Specified definition file was not found.

Specified:
D:\ProjectDefinitions\backend.md

Resolved path:
D:\ProjectDefinitions\backend.md

Please verify that the file exists and that the path is correct.
```

---

# 🧪 Recommended Path Testing

When testing changes to FileForge's definition resolution, test these commands independently.

### 1. Default definition

```powershell
.\FileForge.ps1 -Target ".\Project"
```

### 2. Built-in definition by name

```powershell
.\FileForge.ps1 -File "test" -Target ".\Project"
```

### 3. Built-in definition with extension

```powershell
.\FileForge.ps1 -File "test.md" -Target ".\Project"
```

### 4. Missing built-in definition

```powershell
.\FileForge.ps1 -File "doesnotexist" -Target ".\Project"
```

### 5. External absolute definition

```powershell
.\FileForge.ps1 `
    -File "D:\ProjectDefinitions\backend.md" `
    -Target "D:\Projects\ProjectX"
```

### 6. External relative definition

From the directory containing the definition:

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" `
    -File ".\definitions\backend.md" `
    -Target "."
```

### 7. FileForge launched from outside its directory

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" `
    -File "test" `
    -Target "D:\Projects\ProjectX"
```

### 8. External definition + target inside FileForge

```powershell
& "D:\WIP-DOC\FileForge\FileForge.ps1" `
    -File "D:\WIP-DOC\TestFolder\remote.md" `
    -Target "D:\WIP-DOC\FileForge\Project"
```

For Linux / macOS / WSL, use the equivalent `pwsh` commands with POSIX paths:

```bash
pwsh "/path/to/FileForge/FileForge.ps1" \
    -File "/path/to/definitions/backend.md" \
    -Target "/path/to/Projects/ProjectX"
```

These tests verify that **definition selection and target selection remain independent of the current working directory and the FileForge installation directory**.

# 🧩 The `fileforge` Definition Block

FileForge identifies the project definition using a fenced Markdown code block named:

```text
fileforge
```

Example:

````markdown
```fileforge
TestProject/
    src/
        app.ts
    README.md
```
````

The `fileforge` block is the machine-readable part of the Markdown file.

Everything else can be normal Markdown documentation.

---

## Only the First `fileforge` Block Is Processed

A definition file can contain multiple code blocks.

For example:

````markdown
# My Project

Run FileForge with:

```bash
pwsh ./FileForge.ps1 -File test -Target ./App
```

The actual definition:

```fileforge
TestProject/
    src/
        app.ts
```

Another example:

```fileforge
AnotherProject/
    README.md
```
````

FileForge processes **only the first `fileforge` block**.

The second `fileforge` block is ignored.

This allows the Markdown file to contain examples and additional documentation without accidentally generating multiple project trees.

---

# 🌳 Definition Format

The definition block uses indentation to represent folders and files.

Example:

```fileforge
TestProject/
    src/
        components/
            Button.tsx
        styles/
            main.css

    public/
        index.html

    README.md
```

This produces:

```text
TestProject
├── src
│   ├── components
│   │   └── Button.tsx
│   └── styles
│       └── main.css
├── public
│   └── index.html
└── README.md
```

---

# 📐 Indentation

Indentation defines the relationship between folders and files.

Spaces are recommended.

Tabs are also supported.

Example:

```fileforge
src/
    components/
        Button.tsx
```

means:

```text
src
└── components
    └── Button.tsx
```

Do not mix indentation styles unnecessarily within the same definition.

---

# 📂 Nested Folders

Folders can contain other folders and files.

```fileforge
src/
    components/
        buttons/
            PrimaryButton.tsx
            SecondaryButton.tsx

        forms/
            LoginForm.tsx

    styles/
        main.css
```

---

# 🔗 Single-Line Paths

Folders and files can also be represented on a single line.

```fileforge
public/index.html
```

This creates:

```text
public
└── index.html
```

You can therefore use either:

```fileforge
public/
    index.html
```

or:

```fileforge
public/index.html
```

---

# 📄 Files at the Root

Files do not have to be inside a folder.

Example:

```fileforge
README.md
LICENSE
.gitignore
package.json
```

These are created directly inside the target directory.

---

# 📁 Multiple Root Folders

A definition can contain multiple root folders.

```fileforge
Frontend/
    src/
        app.ts

Backend/
    src/
        server.ts

Documentation/
    README.md
```

---

# 🧱 Special Folder Names

FileForge supports folder names commonly used by modern frameworks.

For example:

```fileforge
app/
    [dynamic-route]/
        page.tsx

    (group)/
        page.tsx
```

This creates:

```text
app
├── [dynamic-route]
│   └── page.tsx
└── (group)
    └── page.tsx
```

These names are treated as normal filesystem paths.

---

# 💬 Comments

Comments can be used inside a `fileforge` definition.

## Full-Line Comments

```fileforge
# Application files

src/
    app.ts
```

Lines beginning with `#` are ignored.

---

## Inline Comments

Comments can also appear after a path.

```fileforge
src/app.ts # Application entry point
```

The comment is ignored when FileForge builds the path.

---

# 📏 Definition Rules

Use filesystem paths inside the `fileforge` block.

Correct:

```fileforge
src/components/Button.tsx
```

Avoid wrapping paths in quotes:

```fileforge
"src/components/Button.tsx"
```

Avoid trailing commas:

```fileforge
src/components/Button.tsx,
```

The definition is a filesystem tree, not a JSON, CSV, or PowerShell command.

---

# ⚙️ Command Usage

FileForge supports preview and execution modes.

## Preview Mode

Preview is the default mode.

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx
```

Preview does not create or modify files.

It displays the planned project structure.

The `-File` value can be:

- a built-in definition name such as `test`
- a built-in definition name with `.md`, such as `test.md`
- an explicit relative path such as `.\definitions\backend.md`
- an explicit absolute path such as `D:\Definitions\backend.md`

If `-File` is omitted entirely, FileForge uses the built-in:

```text
files/test.md
```

Explicit paths must exist and are never replaced by a fallback definition.

---

## Preview With Actions

Use `-ShowActions` to see what FileForge plans to do.

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx -ShowActions
```

Example:

```text
Preview Actions
================
⏭️ Skipped: TestProject/README.md
✨ Create: TestProject/app/page.tsx
```

---

## Execution Mode

Use `-Run` to actually create files.

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx -Run
```

Existing files are skipped by default.

---

## Using an External Definition

FileForge can use a Markdown definition outside the built-in `files/` directory.

### Absolute Path

Windows:

```powershell
& "D:\Tools\FileForge\FileForge.ps1" `
    -File "D:\ProjectDefinitions\backend.md" `
    -Target "D:\Projects\ProjectX"
```

Linux / macOS / WSL:

```bash
pwsh "/home/user/Tools/FileForge/FileForge.ps1" \
    -File "/home/user/ProjectDefinitions/backend.md" \
    -Target "/home/user/Projects/ProjectX"
```

### Relative Path

```powershell
.\FileForge.ps1 `
    -File ".\definitions\backend.md" `
    -Target ".\Project"
```

Relative definition paths are resolved from the current working directory.

If the specified external definition does not exist, FileForge stops with a definition error.

It does not fall back to `files/test.md`.

---

## Execution With Actions

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx -Run -ShowActions
```

This displays the actions that were actually executed.

---

## Force Execution

Use `-Force` together with `-Run` to replace existing files.

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx -Run -Force
```

Example:

```text
♻️ Updated: TestProject/README.md
```

`-Force` should be used carefully because existing file contents may be replaced.

---

## Force Execution With Actions

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx -Run -Force -ShowActions
```

---

# 🖥 Running FileForge on Different Platforms

The FileForge engine is the same on all supported platforms, but the PowerShell invocation can differ.

---

## Run From the FileForge Folder (Output Inside FileForge Folder)

When your terminal is already inside the FileForge directory.

### Linux / macOS / WSL

```bash
pwsh ./FileForge.ps1 -File test -Target ./Project
```

### Windows PowerShell

```powershell
.\FileForge.ps1 -File test -Target ".\Project"
```

---

## Run From the FileForge Folder and Generate Elsewhere

FileForge can generate into another directory.

### Linux / macOS / WSL

```bash
pwsh ./FileForge.ps1 -File test -Target ./Projects/App
```

If the path contains spaces:

```bash
pwsh ./FileForge.ps1 -File test -Target "./Projects Folder/App"
```

### Windows PowerShell

```powershell
.\FileForge.ps1 -File test -Target "D:\Projects\App"
```

---

## Run From Any Location

FileForge can also be executed using its full script path.

### Linux / macOS / WSL

```bash
pwsh "/home/user/Tools/FileForge/FileForge.ps1" -File test -Target "/home/user/Projects/App"
```

### Windows PowerShell

```powershell
& "D:\Tools\FileForge\FileForge.ps1" -File test -Target "D:\Projects\App"
```

---

# ⚙️ Parameters and Options

## Main Parameters

| Parameter | Description                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| `-File`   | Selects a built-in definition by name or an explicit Markdown definition file by path. |
| `-Target` | Defines where the generated project will be created.                                   |

Example:

```bash
-File test
```

uses the built-in definition:

```text
files/test.md
```

The `.md` extension can also be specified:

```bash
-File test.md
```

Both forms resolve to:

```text
files/test.md
```

An external definition can be supplied using an absolute path:

```powershell
-File "D:\ProjectDefinitions\backend.md"
```

or a relative path:

```powershell
-File ".\definitions\backend.md"
```

Explicit paths must exist. FileForge does not fall back to a built-in definition when an explicitly supplied path is missing.

Example:

```bash
-Target ./Projects/App
```

generates inside:

```text
./Projects/App
```

---

## Available Options

| Option         | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `-Run`         | Execute file creation/update operations. Existing files are skipped by default. |
| `-ShowActions` | Show detailed create/update/skip actions.                                       |
| `-Force`       | Replace existing files during execution. Requires `-Run`.                       |
| `-List`        | List available FileForge definitions.                                           |
| `-Help`        | Display command help.                                                           |
| `-Version`     | Display the FileForge version.                                                  |

---

# 📋 Built-In Commands

## List Definitions

```bash
pwsh ./FileForge.ps1 -List
```

Example:

```text
Available FileForge Definitions
===============================

  test
  todo
```

The names shown by `-List` are the names used with `-File`.

For example:

```bash
pwsh ./FileForge.ps1 -File test -Target ./App
```

loads:

```text
files/test.md
```

---

## Help

```bash
pwsh ./FileForge.ps1 -Help
```

The help command displays the available modes, options, and examples.

---

## Version

```bash
pwsh ./FileForge.ps1 -Version
```

Example:

```text
FileForge v2.0.0
```

---

# 🛡 Safety Behavior

FileForge is designed to avoid accidentally destroying existing work.

## Preview

Without `-Run`:

```text
MODE: PREVIEW
```

No files are created or modified.

---

## Execution Without Force

With:

```bash
-Run
```

FileForge creates missing files.

Existing files are skipped.

Example:

```text
⏭️ Skipped: README.md
```

---

## Execution With Force

With:

```bash
-Run -Force
```

existing files can be replaced.

Example:

```text
♻️ Updated: README.md
```

Use `-Force` deliberately when existing file contents should be replaced.

---

# ⚠️ Duplicate Paths

FileForge validates the planned tree before execution.

If the same physical path is defined more than once, FileForge reports it.

Example:

```fileforge
TestProject/
    README.md
    README.md
```

FileForge reports:

```text
⚠️ Duplicate path detected:
.../TestProject/README.md
```

The duplicate is included in the plan, but FileForge tracks the duplicate separately in its validation and execution summary.

This is useful for detecting accidental duplicate definitions.

---

# 🎨 Templates

FileForge can automatically select a starter template based on the generated file's extension or name.

## Supported File Extensions

| Extension | Template / Purpose         |
| --------- | -------------------------- |
| `.cs`     | C# starter                 |
| `.css`    | CSS starter                |
| `.env`    | Environment variables      |
| `.go`     | Go starter                 |
| `.html`   | HTML starter               |
| `.js`     | JavaScript starter         |
| `.json`   | JSON starter               |
| `.jsx`    | React JavaScript component |
| `.md`     | Markdown document          |
| `.ps1`    | PowerShell script          |
| `.py`     | Python starter             |
| `.rs`     | Rust starter               |
| `.scss`   | SCSS starter               |
| `.sh`     | Shell script               |
| `.sql`    | SQL script                 |
| `.ts`     | TypeScript starter         |
| `.tsx`    | React TypeScript component |
| `.vue`    | Vue component starter      |
| `.yaml`   | YAML configuration         |
| `.yml`    | YAML configuration         |

## Supported File Names

FileForge also supports templates for common special files:

| File Name             | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `Dockerfile`          | Docker container definition              |
| `Dockerfile.backend`  | Backend Docker definition                |
| `Dockerfile.frontend` | Frontend Docker definition               |
| `compose.yaml`        | Docker Compose configuration             |
| `compose.dev.yaml`    | Docker Compose development configuration |
| `.dockerignore`       | Docker ignore rules                      |
| `.gitignore`          | Git ignore rules                         |

---

# 🏷 Generated File Headers

Where supported by the selected template, FileForge can add the generated file path as a header.

For example, generating:

```text
TestProject/components/Button.tsx
```

may produce a file containing a header such as:

```text
// TestProject/components/Button.tsx
```

This makes it easier to identify where a generated file belongs.

---

# 📊 Execution Summary

FileForge displays a summary after planning or execution.

Example preview:

```text
=========================
 FileForge Summary
=========================

Mode: PREVIEW

Folders planned: 12
Files planned:   35
Duplicates found: 1

=========================
```

Example execution:

```text
=========================
 FileForge Summary
=========================

MODE: EXECUTION

Folders created: 12
Files created:   34
Files updated:   0
Files skipped:   1
Duplicates found: 1

=========================
```

The exact numbers depend on the selected definition and the state of the target directory.

---

# 🎯 Target Directory

The `-Target` parameter determines where FileForge generates the requested structure.

For example:

```powershell
.\FileForge.ps1 -File test -Target "D:\Projects\App"
```

FileForge generates the project under:

```text
D:\Projects\App
```

When generating into the FileForge repository itself, use a dedicated test directory such as:

```text
xxx/
```

It is recommended to generate real projects into a separate target directory rather than directly into the FileForge source directory.

---

# 🧪 Example Definition

The repository includes:

```text
files/test.md
```

This definition is intentionally designed to exercise common FileForge functionality, including:

- root-level folders
- root-level files
- nested folders
- single-line paths
- comments
- inline comments
- special folder names
- multiple file types
- duplicate paths
- template selection

You can preview it with:

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx
```

Then execute it with:

```bash
pwsh ./FileForge.ps1 -File test -Target ./xxx -Run
```

The `xxx/` directory is intended as a local test output directory and is ignored by Git.

---

# 📂 Repository Structure

The main repository structure is:

```text
FileForge/
│
├── assets/
│   └── images/
│
├── files/
│   ├── test.md
│   └── todo.md
│
├── src/
│   ├── Engine/
│   │   ├── Executor.ps1
│   │   ├── MarkdownParser.ps1
│   │   ├── Models.ps1
│   │   ├── Planner.ps1
│   │   ├── Renderer.ps1
│   │   ├── TreeParser.ps1
│   │   └── Validator.ps1
│   │
│   ├── templates/
│   │   └── *.ps1
│   │
│   └── Templates.ps1
│
├── FileForge.ps1
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE
```

Generated test output such as:

```text
xxx/
```

is not part of the source project and is ignored by Git.

---

# 📸 Examples

### ✅ New Project

If the target does not contain the generated files, FileForge creates the required folders and files.

![Full Generation](assets/images/full-generation.png)

### ✅ Existing Project

If some files already exist, FileForge skips them by default while creating missing files.

![Partial Generation](assets/images/partial-generation.png)

### ✅ No Changes Required

If all files already exist and contain content, FileForge can complete without modifying them.

![No Changes Required](assets/images/no-changes.png)

### Generated Project Structure

FileForge preserves the directory structure described by the definition.

![Generated Project Structure](assets/images/generated-folder-tree.png)

### Generated File Header

Templates can automatically add the generated file path to created files.

![Generated File Header](assets/images/file-header-example.png)

---

# 🔍 Common Mistakes

## Using the wrong definition extension

FileForge definitions use:

```text
files/test.md
```

not:

```text
files/test.txt
```

---

## Assuming `-File` always searches `files/`

A plain definition name searches FileForge's built-in definitions:

```powershell
-File "test"
```

This resolves to:

```text
<FileForge>/files/test.md
```

However, an explicit path is treated as an actual file path:

```powershell
-File ".\definitions\backend.md"
```

or:

```powershell
-File "D:\Definitions\backend.md"
```

If the explicit path does not exist, FileForge reports an error.

It does not automatically search:

```text
files/
```

as a fallback.

This prevents accidental execution of the wrong definition because of a misspelled path.

For example:

```powershell
-File "D:\Definitions\backed.md"
```

does not fall back to:

```text
files/test.md
```

Instead, FileForge reports that the specified definition file was not found.

---

## Using the wrong code block identifier

The project definition must use:

````markdown
```fileforge
...
```
````

Do not use:

````markdown
```text
...
```
````

or:

````markdown
```bash
...
```
````

for the actual definition.

---

## Expecting multiple definitions in one file

Only the first `fileforge` block is processed.

Additional `fileforge` blocks are ignored.

---

## Forgetting `-Run`

This:

```bash
pwsh ./FileForge.ps1 -File test -Target ./App
```

is preview mode.

It does not create files.

To execute:

```bash
pwsh ./FileForge.ps1 -File test -Target ./App -Run
```

---

## Using `-Force` without understanding its effect

`-Force` allows existing files to be replaced.

Use:

```bash
-Run -Force
```

only when you intentionally want existing generated files updated.

---

## Generating directly inside the FileForge repository

For testing, use a separate ignored directory such as:

```text
xxx/
```

For real projects, use a separate project directory.

---

# 🧭 Recommended Workflow

A safe workflow is:

### 1. Choose a definition

```bash
pwsh ./FileForge.ps1 -List
```

### 2. Preview it

```bash
pwsh ./FileForge.ps1 -File test -Target ./Projects/App
```

### 3. Review the planned structure

Check the folders, files, and duplicate warnings.

### 4. Preview with actions if needed

```bash
pwsh ./FileForge.ps1 -File test -Target ./Projects/App -ShowActions
```

### 5. Execute

```bash
pwsh ./FileForge.ps1 -File test -Target ./Projects/App -Run
```

### 6. Use force only when necessary

```bash
pwsh ./FileForge.ps1 -File test -Target ./Projects/App -Run -Force
```

This preview-first workflow makes FileForge safer for existing projects.

---

# 🗺 Roadmap

Possible future improvements include:

- Interactive definition selection
- Template variables
- Additional template engines
- Remote definition repositories
- More built-in project profiles
- Project metadata support
- Interactive project creation wizard

---

# 🤝 Contributing

Contributions are welcome.

If you improve FileForge, add templates, fix bugs, improve documentation, or suggest features, please consider opening an issue or pull request.

See [CONTRIBUTING](CONTRIBUTING.md) for contribution guidelines.

---

# 🏢 About

FileForge is an open-source project created and maintained by **DXWIZ**.

Learn more about DXWIZ at **[dxwiz.com](https://dxwiz.com)**.

For questions or support, visit the **[Contact page](https://dxwiz.com/contact)**.

---

# 📜 License

FileForge is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

# ⭐ Why FileForge?

Many projects begin with the same repetitive setup tasks:

- Creating folders
- Adding standard files
- Preparing starter templates
- Maintaining consistent structures
- Repeating the same setup for every new project

FileForge turns those repeated steps into reusable definitions.

**Define once.**

**Preview safely.**

**Generate anytime.**
