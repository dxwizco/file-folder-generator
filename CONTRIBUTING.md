# Contributing to File & Folder Generator

Thank you for your interest in contributing to File & Folder Generator.

Contributions are welcome, including bug fixes, feature improvements, documentation updates, templates, tests, and other improvements.

## Ways to Contribute

You can contribute by:

- Reporting bugs.
- Suggesting features or improvements.
- Improving documentation.
- Adding or improving templates.
- Improving parsing, validation, generation, or reporting.
- Adding or improving tests.
- Submitting pull requests.

## Before You Start

Before making a change:

1. Check existing GitHub issues to avoid duplicate work.
2. For significant changes or new features, open an issue first to discuss the proposed approach.
3. Keep changes focused and easy to review.
4. Update relevant documentation when behavior changes.
5. Add or update tests when appropriate.

## Development

File & Folder Generator is a TypeScript-based VS Code extension.

Install dependencies:

```bash
pnpm install
```

Compile the project:

```bash
pnpm run compile
```

Run the test suite:

```bash
pnpm test
```

For continuous compilation during development:

```bash
pnpm run watch
```

## Project Structure

The project is organized into core functionality, adapters, VS Code interfaces, templates, and tests.

```text
src/
├── adapters/
├── core/
└── interfaces/

tests/
```

See the existing source code and tests for the current architecture and implementation patterns.

## Testing

Before submitting a pull request:

- Run the existing test suite.
- Test any new or changed functionality.
- Add tests for new behavior where appropriate.
- Verify that existing behavior has not been unintentionally affected.

## Pull Requests

When submitting a pull request:

- Keep the changes focused.
- Clearly describe what was changed and why.
- Include relevant testing information.
- Update documentation when necessary.
- Avoid unrelated changes in the same pull request.

A useful pull request description should explain:

```text
## Changes

Describe what was changed.

## Testing

Describe the tests that were run.

## Notes

Include any relevant implementation details or limitations.
```

## Bug Reports

When reporting a bug, include enough information to reproduce it.

Where applicable, provide:

- File & Folder Generator version.
- VS Code version.
- Operating system.
- A minimal Markdown definition that reproduces the problem.
- Expected behavior.
- Actual behavior.
- Relevant error messages or output.

Please do not include passwords, access tokens, private documents, or other sensitive information.

## Feature Requests

Feature requests are welcome.

Please describe:

- The problem you want to solve.
- Why the current behavior is insufficient.
- The proposed behavior.
- Examples or use cases.

## Code of Conduct

Please read and follow the project's [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing to File & Folder Generator, you agree that your contributions may be distributed under the project's [MIT License](LICENSE).

Thank you for helping improve File & Folder Generator.
