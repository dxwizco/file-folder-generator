// sh.ts

export function createShTemplate(fileName: string): string {
  return `set -e
echo "Running ${fileName}..."
`;
}
