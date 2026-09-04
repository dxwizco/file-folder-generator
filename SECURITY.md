# Security Policy

## Supported Versions

Security fixes are generally provided for the latest released version of File & Folder Generator.

| Version        | Supported |
| -------------- | --------- |
| Latest release | Yes       |
| Older releases | No        |

Users should update to the latest version before reporting a security issue whenever possible.

---

## Reporting a Security Issue

If you discover a potential security vulnerability in File & Folder Generator, please report it privately rather than opening a public GitHub issue.

Use the private contact method provided by the project maintainers.

When reporting a security issue, please include:

- A description of the vulnerability.
- Steps to reproduce the issue.
- A minimal example or proof of concept, when applicable.
- The affected File & Folder Generator version.
- Your VS Code version and operating system, when relevant.
- The expected behavior.
- The actual behavior.
- The potential security impact.
- A suggested mitigation, if available.

Please do not include passwords, access tokens, private documents, personal information, or other unnecessary sensitive data in your report.

### Example Report

```text
File & Folder Generator Version: 0.1.0

Issue: Unexpected file creation outside the target directory.

Steps:
1. Create a Markdown definition.
2. Provide a crafted target or file path.
3. Run File & Folder Generator.

Impact:
Potential unintended file modification outside the intended target location.

Environment:
VS Code: <version>
Operating System: <OS>
```

---

## What to Expect

Security reports will be reviewed as soon as reasonably possible.

If a vulnerability is confirmed, the maintainers will assess its severity and work toward an appropriate fix.

Depending on the nature of the issue, details about the vulnerability and its resolution may be documented in the project's changelog or release notes after the issue has been addressed.

---

## Scope

File & Folder Generator is a local VS Code extension that creates folders and files based on Markdown project definitions.

Its core functionality includes:

- Reading Markdown definitions containing `dxwiz` project definition blocks.
- Parsing and validating project structures.
- Validating target paths.
- Planning file and folder operations.
- Creating folders and files in the specified target location.
- Optionally replacing existing files when the Generate and Overwrite command is used.
- Generating execution reports.

The extension does not require external services for its core file-generation functionality.

Security reports should focus on vulnerabilities that could cause unintended file access, file creation, file modification, path traversal, execution of unintended operations, exposure of sensitive information, or other security-impacting behavior.

---

## Responsible Disclosure

Please allow the maintainers reasonable time to investigate and address a reported security issue before publicly disclosing technical details.

We appreciate responsible disclosure and will make reasonable efforts to handle security reports appropriately.

---

## Thank You

Responsible security reporting helps keep File & Folder Generator safe and reliable for everyone.
