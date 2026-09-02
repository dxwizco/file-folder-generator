// yml.ts

export function createYmlTemplate(fileName: string): string {
  return `version: '3.8'
metadata:
  name: ${fileName}
`;
}
