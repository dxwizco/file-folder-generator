// ps1.ts

export function createPs1Template(fileName: string): string {
  return `[CmdletBinding()]
param()

Write-Host "Running ${fileName}..."
`;
}
