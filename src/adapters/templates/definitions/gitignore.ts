// gitignore.ts

export function createGitignoreTemplate(_fileName: string): string {
  return `# Logs
*.log
npm-debug.log*

# Dependency directories
node_modules/
__pycache__/

# IDEs and editors
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
`;
}
