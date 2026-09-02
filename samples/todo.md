Good. The documentation is in a good place now. The next logical step is to move from **working prototype → maintainable tool**.

I would suggest this order:

## 1. Add a proper version/help command (`-Help` / `-Version`)

Right now users need the README to know commands. A CLI tool should explain itself.

Example:

```powershell
pwsh ./FileForge.ps1 -Help
```

Output:

```
FileForge v2
============

Create project structures from fileforge definitions.

Usage:
  FileForge.ps1 -File <name> -Target <path> [options]

Required:
  -File        Definition file from files folder
  -Target      Output location

Modes:
  (default)    PREVIEW only
  -Run         EXECUTE creation/update

Options:
  -ShowActions Show detailed file actions
  -Force       Replace existing files

Examples:

  Preview:
    pwsh ./FileForge.ps1 -File test -Target ./App

  Execute:
    pwsh ./FileForge.ps1 -File test -Target ./App -Run

  Execute with force:
    pwsh ./FileForge.ps1 -File test -Target ./App -Run -Force
```

This is a big usability improvement.

---

## 2. Add definition file listing

Currently:

```powershell
-File test
```

assumes the user knows the file exists.

Add:

```powershell
pwsh ./FileForge.ps1 -List
```

Output:

```
Available FileForge definitions
================================

test.md
nextjs-app.md
dotnet-api.md
python-cli.md
```

This makes FileForge discoverable.

---

## 3. Improve duplicate handling

Currently you correctly detect:

```
⚠️ Duplicate path detected:
xxx/TestProject/README.md
```

Next improvement:

Instead of only warning, show the source lines.

Example:

```
⚠️ Duplicate definition

Target:
 TestProject/README.md

Defined twice:

Line 18:
    README.md

Line 27:
    README.md
```

This will make debugging large templates much easier.

---

## 4. Add output summary for PREVIEW

Currently:

```
Mode: PREVIEW

Folders planned: 12
Files planned:   35
Duplicates found: 1
```

Good.

I would extend:

```
Mode: PREVIEW

Folders:
  Create: 12

Files:
  Create: 35
  Update: 0
  Skip:   0

Warnings:
  Duplicate paths: 1
```

Same summary works for both PREVIEW and EXECUTION.

---

## 5. Add tests folder

Before adding more features, lock current behavior.

Something like:

```
FileForge
│
├── src
│
├── files
│
├── tests
│   ├── parser.tests.ps1
│   ├── renderer.tests.ps1
│   ├── validator.tests.ps1
│   └── executor.tests.ps1
│
└── FileForge.ps1
```

Because now FileForge has important behavior:

- parsing indentation
- handling `(group)`
- handling `[dynamic-route]`
- duplicate detection
- action planning
- rendering tree
- execution

You don't want future improvements breaking these.

---

## 6. Add a small GitHub-ready polish

Things like:

```
README.md
LICENSE
CHANGELOG.md
CONTRIBUTING.md
.gitignore
```

and maybe:

```
docs/
   commands.md
   definition-format.md
   examples.md
```

---

My recommendation for the immediate next step:

**Do #1 first: add `-Help` and `-Version`.**

It is small, but it changes FileForge from "a script I run" into "a CLI tool people can use without opening documentation." After that, do `-List`, then tests.

---

---

Great. At this point FileForge has moved from a basic generator into a more complete CLI tool.

Current feature set looks solid:

✅ Definition discovery

- `-List` shows available `.md` definitions

✅ Documentation/help

- `-Help` explains usage
- `-Version` reports current version

✅ Execution workflow

- Default → `PREVIEW`
- `-Run` → `EXECUTION`

✅ Safety and control

- `-Force` handles existing files
- Duplicate detection remains visible

✅ Output experience

- VS Code style tree rendering
- Folder/file sorting
- Action icons:
  - ✨ create
  - ♻️ update
  - ⏭️ skip
  - 📁 folders

✅ Optional details

- `-ShowActions` gives path-level reports only when requested

The next logical areas after this would be more "product hardening" rather than core functionality:

1. **Better error handling**
   - friendly messages for invalid definition names
   - missing folders/files
   - malformed `fileforge` blocks

2. **Definition validation**
   - check unsupported syntax
   - warn about duplicate entries before execution

3. **Configuration support**
   - optional `fileforge.config.json`
   - default target folders
   - custom templates folder

4. **Packaging**
   - versioned releases
   - install as a PowerShell command:

     ```powershell
     fileforge -File test -Target ./App
     ```

5. **Testing**
   - automated test definitions
   - verify preview output
   - verify execution results

But the foundation is already in place. The important architectural pieces are separated correctly now:

```
FileForge.ps1
    CLI / command handling

Engine/
    Models.ps1
    TreeParser.ps1
    Renderer.ps1
    Executor.ps1
    Validator.ps1

files/
    *.md definitions
```

That separation will make the next improvements much easier.
