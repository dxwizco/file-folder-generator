# Security Policy

## Supported Versions

FileForge is currently under active development.

Security fixes will generally be applied to the latest available version.

| Version                         | Supported      |
| ------------------------------- | -------------- |
| Latest release                  | ✅             |
| Older releases                  | ⚠️ Best effort |
| Unreleased development versions | ⚠️ Best effort |

---

# Reporting a Security Issue

If you discover a potential security vulnerability in FileForge, please report it responsibly.

Please do **not** create a public GitHub issue for security-related problems.

Instead, contact the project maintainers privately through the available GitHub contact options.

---

# What to Include

When reporting a security issue, please provide:

- A description of the vulnerability
- Steps to reproduce the issue
- Affected version or commit
- Expected behavior
- Actual behavior
- Any possible impact
- Suggested mitigation, if available

Example:

```text
FileForge Version:
1.0.0

Issue:
Unexpected file creation outside the target directory.

Steps:
1. Create definition file.
2. Provide crafted path.
3. Run FileForge.

Impact:
Potential unintended file modification.
```

---

# Response Process

After receiving a report, maintainers will:

1. Review the reported issue.
2. Confirm whether it is a security concern.
3. Investigate possible fixes.
4. Provide updates when appropriate.
5. Release a fix if required.

---

# Security Considerations

FileForge creates folders and files based on user-provided definitions.

Users should:

- Review definition files before running them.
- Use trusted project definitions.
- Run FileForge with appropriate permissions.
- Avoid running unknown scripts or templates.

---

# Thank You

Responsible security reporting helps keep FileForge safe and reliable for everyone.
