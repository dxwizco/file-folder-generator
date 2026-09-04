# File & Folder Generator

> A lightweight VS Code project scaffolding tool that generates folders, files, and starter templates from reusable Markdown definitions.

Define your project structure once. Reuse it whenever you start a new project.

[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/DXWIZ.file-folder-generator?label=Visual%20Studio%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=DXWIZ.file-folder-generator)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- 📁 Generate complete folder and file structures
- 📝 Define project structures using readable Markdown files
- 🧩 Use dedicated `dxwiz` fenced code blocks
- 🌳 Build hierarchical structures using indentation
- 🔗 Create files and folders using nested paths such as `src/components/Button.tsx`
- 💬 Support full-line and inline comments
- 🧱 Support special folder names such as `[id]` and `(group)`
- 🎨 Automatically provide basic starter content for supported file types
- 🏷 Add generated file-path headers to files that support them
- 👀 Preview planned changes before modifying the target
- 🛡 Protect existing files during normal generation
- ♻️ Optionally overwrite existing files
- ⚠️ Detect and report duplicate physical paths
- 📊 Generate execution reports with validation, planning, execution statistics, warnings, and the resulting file structure
- 📚 Maintain multiple reusable project definitions

---

## 🚀 Commands

File & Folder Generator provides three independent commands.

Each command operates on the **selected Markdown definition** containing a dxwiz block. The commands can be used independently; Preview is not required before Generate.

### File & Folder Generator: Preview

Analyzes the selected definition and generates an execution report without modifying the target project.

The report includes information such as:

- Validation status
- Planned folders and files
- Duplicate paths
- Warnings
- Planned file structure

Use Preview when you want to inspect the planned result before making changes.

### File & Folder Generator: Generate

Generates the folders and files described by the selected definition.

Existing files are protected according to the normal generation behavior, while newly required files and folders are created.

The execution report shows what was planned and what actually happened.

### File & Folder Generator: Generate and Overwrite

Generates the defined structure and overwrites existing files when necessary.

> ⚠️ **Caution**: This command can replace existing file contents. Make sure you have reviewed the definition and have appropriate backups or version control before using it on important files.

The execution report identifies files that were updated as part of the operation.

### Commands are independent

Preview is **not required** before Generate or Generate and Overwrite.

You can choose whichever command matches what you want to do:

```text
File & Folder Generator: Preview
File & Folder Generator: Generate
File & Folder Generator: Generate and Overwrite
```

---

## 📄 Getting Started

Create or choose a Markdown definition describing the project structure you want to generate.

A definition contains a `dxwiz` fenced code block:

````markdown
# Example Application

This definition creates a basic React application.

```dxwiz
target: "D:/projects/project-folder"

my-app/
    src/
        components/
            Button.tsx
        App.tsx
        main.tsx

    public/
        index.html

    package.json
    README.md
```
````

The Markdown outside the `dxwiz` block is documentation.

The `dxwiz` block contains the project definition that File & Folder Generator processes.

---

## 🧩 Definition Format

A definition is a normal Markdown (`.md`) file containing a `dxwiz` fenced code block.

The definition specifies:

1. **The `dxwiz` block** — identifies the project definition.
2. **The `target` path** — specifies where the structure will be created.
3. **The project tree** — describes the folders and files to create.
4. **Indentation** — defines parent-child relationships.
5. **Trailing `/`** — identifies folders.

### Basic Example

````markdown
```dxwiz
target: "D:/projects/project-folder"

src/
    components/
        Button.tsx
    styles/
        main.css

README.md
package.json
```
````

This represents:

```text
project-folder/
├── src/
│   ├── components/
│   │   └── Button.tsx
│   ├── styles/
│   │   └── main.css
├── README.md
└── package.json
```

---

## `dxwiz`

The opening fence must use the `dxwiz` language identifier:

````markdown
```dxwiz
...
```
````

This tells File & Folder Generator that the fenced block contains a project definition.

Only the **first `dxwiz` block** in a Markdown definition is processed.

This allows the same Markdown file to contain documentation, examples, or other code blocks without processing every block as a project definition.

For example:

````markdown
# My Project

Example command:

```bash
some-command
```

Actual project definition:

```dxwiz
target: "D:/projects/project-folder"

my-project/
    src/
        app.ts
    README.md
```
````

The `bash` block is ignored, and the first `dxwiz` block is processed.

Additional `dxwiz` blocks are ignored.

---

## `target`

The `target` property specifies the destination directory where the defined project structure will be created.

```text
target: "D:/projects/project-folder"
```

The target path is part of the definition, so the definition contains both:

- **What to create**
- **Where to create it**

For example:

```dxwiz
target: "D:/projects/project-folder"

src/
    app.ts

README.md
```

The resulting files are created relative to:

```text
D:/projects/project-folder
```

---

## 🌳 Project Structure

Everything after the `target` declaration describes the folders and files to create.

A folder is identified by a trailing `/`:

```dxwiz
src/
    components/
        Button.tsx
```

This produces:

```text
src/
└── components/
    └── Button.tsx
```

File names do not require a special marker:

```dxwiz
README.md
package.json
```

---

## ↔️ Indentation

Indentation defines the hierarchy of folders and files.

For example:

```dxwiz
src/
    components/
        Button.tsx
```

means:

```text
src/
└── components/
    └── Button.tsx
```

The indentation level determines the parent-child relationship.

Use consistent indentation throughout a definition.

---

## 🔗 Single-Line Paths

You can create nested files or folders directly using a path:

```dxwiz
target: "D:/projects/project-folder"

src/components/Button.tsx
src/utils/helpers.ts
public/index.html
```

This creates:

```text
src/
├── components/
│   └── Button.tsx
├── utils/
│   └── helpers.ts
└── ...

public/
└── index.html
```

Single-line paths are useful when you do not need to explicitly describe every intermediate directory.

---

## 📂 Multiple Root Folders

A definition can contain multiple root-level folders and files.

```dxwiz
target: "D:/projects/project-folder"

Frontend/
    src/
        app.ts

Backend/
    src/
        server.ts

Documentation/
    README.md
```

This creates:

```text
project-folder/
├── Frontend/
│   └── src/
│       └── app.ts
├── Backend/
│   └── src/
│       └── server.ts
└── Documentation/
    └── README.md
```

---

## 🧱 Special Folder Names

Special folder names used by frameworks are treated as normal filesystem paths.

For example:

```dxwiz
target: "D:/projects/project-folder"

app/
    [id]/
        page.tsx

    (group)/
        dashboard/
            page.tsx
```

This allows structures containing names such as:

- `[id]`
- `[dynamic-route]`
- `(group)`
- `(admin)`

without requiring special syntax in the definition.

---

## 💬 Comments

Comments can be placed on their own line:

```dxwiz
target: "D:/projects/project-folder"

# Application source    ← This is separate Comment line

src/
    app.ts
```

Inline comments are also supported:

```dxwiz
target: "D:/projects/project-folder"

src/app.ts # Application entry point    ← This is inline comment
```

Comments are ignored when the project structure is built and generated.

---

## 🎨 Templates

File & Folder Generator can provide basic starter content automatically for supported file types.

When a generated file matches a supported template, the corresponding basic template content is added to the file.

### Supported File Extensions

| Extension | Language / Format     |
| --------- | --------------------- |
| `.cs`     | C#                    |
| `.css`    | CSS                   |
| `.env`    | Environment variables |
| `.go`     | Go                    |
| `.html`   | HTML                  |
| `.js`     | JavaScript            |
| `.json`   | JSON                  |
| `.jsx`    | React JavaScript      |
| `.md`     | Markdown              |
| `.ps1`    | PowerShell            |
| `.py`     | Python                |
| `.rs`     | Rust                  |
| `.scss`   | SCSS                  |
| `.sh`     | Shell                 |
| `.sql`    | SQL                   |
| `.ts`     | TypeScript            |
| `.tsx`    | React TypeScript      |
| `.vue`    | Vue                   |
| `.yaml`   | YAML                  |
| `.yml`    | YAML                  |

### Supported File Names

Templates can also be selected based on specific file names.

| File name             | Purpose                    |
| --------------------- | -------------------------- |
| `Dockerfile`          | Docker definition          |
| `Dockerfile.backend`  | Backend Docker definition  |
| `Dockerfile.frontend` | Frontend Docker definition |
| `compose.yaml`        | Docker Compose             |
| `compose.dev.yaml`    | Development Docker Compose |
| `.dockerignore`       | Docker ignore rules        |
| `.gitignore`          | Git ignore rules           |

The exact starter content is provided by the templates included with the extension.

---

## 🏷 Generated File Headers

For every generated file whose file type supports generated headers, File & Folder Generator adds a header identifying the generated file path.

For example:

```text
src/components/Button.tsx
```

can receive:

```text
// src/components/Button.tsx
```

The header format depends on the file type.

When a supported template is available, the generated file can contain both:

- The generated file-path header
- Basic starter template content

This makes generated files easier to identify and gives supported file types useful initial content immediately.

---

## 👀 Preview

Preview mode lets you inspect the planned operation without modifying the target project.

The generated report can include:

```text
PLAN SUMMARY:
--------------------------
Folders planned: 12
Files planned:   35
Duplicates found: 1
```

It also displays the planned file structure and warnings.

Preview is optional. It is provided as a convenient way to inspect changes before generation.

---

## 🛡 Generation and Existing Files

The extension distinguishes between different outcomes during execution, including:

- ✨ Newly created files
- 📁 Newly created folders
- 🔄 Updated or overwritten files
- ⏭️ Skipped existing files
- ⚠️ Duplicate paths
- ❌ Invalid definitions

Normal **Generate** operations protect existing files according to the extension's standard generation behavior.

**Generate and Overwrite** is available when you intentionally want existing files to be replaced.

---

## ⚠️ Validation and Duplicate Detection

Definitions are validated before execution.

Duplicate physical paths are detected and reported.

For example:

```dxwiz
target: "D:/projects/project-folder"

my-project/
    README.md
    README.md
```

The definition contains the same physical path twice.

The execution report identifies the duplicate:

```text
Duplicates found: 1

WARNINGS:
--------------------------
  ⚠ Duplicate path detected:
  D:/projects/project-folder/my-project/README.md
```

Duplicate detection helps identify accidental repetition in project definitions.

A duplicate warning does not by itself mean that every operation is blocked; the selected command and execution mode determine how the operation proceeds.

---

## 📊 Execution Reports

File & Folder Generator produces an execution report for operations.

The report is:

- Opened as a Markdown output file beside the source definition
- Given the `.output.md` suffix
- Opened in VS Code
- Also displayed in the VS Code Output panel

For example:

```text
testfile.md
testfile.output.md
```

A report can contain:

```text
File & Folder Generator Execution Report
==========================

Mode: GENERATE_AND_OVERWRITE
Status: SUCCESS
Target: D:/projects/project-folder
Validation Status: Valid
Action: Files and folders generated with existing files overwritten

PLAN SUMMARY:
--------------------------
Folders planned: 12
Files planned:   35
Duplicates found: 1

EXECUTION SUMMARY:
--------------------------
Folders created: 0
Files created:   0
Files updated:   35
Files skipped:   0
```

The report also includes warnings and the resulting file structure.

This provides a clear record of what the extension planned and what actually happened.

---

## 📚 Reusable Definitions

Definitions can be stored and reused across projects.

For example:

```text
definitions/
├── react-app.md
├── node-api.md
├── python-api.md
└── cli-tool.md
```

Each definition can contain documentation together with its corresponding `dxwiz` project structure.

Reusable definitions make project scaffolding:

- Easy to read
- Easy to review
- Easy to version control
- Easy to share
- Easy to customize
- Consistent across projects

---

## 🧪 Complete Example

The following definition demonstrates nested folders, single-line paths, comments, special folder names, infrastructure files, templates, and duplicate detection:

````markdown
# Example Project

```dxwiz
target: "D:/projects/project-folder"

# Root project folder
my-project/
    # Application source
    app/
        components/
            Button.tsx

        [id]/
            page.tsx

        (admin)/
            dashboard/
                page.tsx

        styles/
            main.css

    # Single-line path
    public/index.html

    # Infrastructure files
    infra/
        Dockerfile
        compose.yaml

    # Project configuration
    .gitignore
    package.json
    README.md
```
````

The resulting structure is:

```text
project-folder/
└── my-project/
    ├── app/
    │   ├── components/
    │   │   └── Button.tsx
    │   ├── [id]/
    │   │   └── page.tsx
    │   ├── (admin)/
    │   │   └── dashboard/
    │   │       └── page.tsx
    │   └── styles/
    │       └── main.css
    ├── public/
    │   └── index.html
    ├── infra/
    │   ├── Dockerfile
    │   └── compose.yaml
    ├── .gitignore
    ├── package.json
    └── README.md
```

Supported files can receive their corresponding starter template content and generated file-path headers.

---

## 🧭 Recommended Usage

Choose the command that matches your intended operation:

1. **Create or choose a definition.**
2. **Use Preview** if you want to inspect the planned changes.
3. **Use Generate** to create the project while protecting existing files.
4. **Use Generate and Overwrite** when existing files should intentionally be replaced.
5. **Review the execution report** for validation results, warnings, duplicates, and execution statistics.

Preview is optional; the three commands can be used independently.

---

## 🗺 Roadmap

Possible future improvements include:

- Additional language and framework templates
- Additional validation rules
- Template variables
- Custom template packs
- Remote or shared definitions

The roadmap may evolve based on user feedback and project needs.

---

## 🤝 Contributing

Contributions are welcome.

You can help by:

- Adding templates
- Adding project definitions
- Improving parsing and validation
- Improving documentation
- Fixing bugs
- Suggesting new features

Please see [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines.

---

## 🆘 Support

For questions, issues, feature requests, or other support:

- See [`SUPPORT.md`](SUPPORT.md)
- Report bugs through the project's issue tracker
- Review the project documentation and examples

---

## 🏢 About

File & Folder Generator is an open-source project created and maintained by **DXWIZ**.

Learn more about DXWIZ at [dxwiz.com](https://dxwiz.com).

For additional information, visit the [DXWIZ Contact page](https://dxwiz.com/contact).

---

## 📜 License

File & Folder Generator is licensed under the MIT License.

See [`LICENSE`](LICENSE) for the complete license text.

---

## ⭐ Why File & Folder Generator?

Starting a project often means repeating the same setup:

- Creating directories
- Creating standard files
- Adding starter code
- Setting up configuration files
- Recreating familiar project structures

File & Folder Generator turns that repetitive work into reusable Markdown definitions.

**Define once.**

**Preview when you want to inspect.**

**Generate consistently.**
