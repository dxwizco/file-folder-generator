// yaml.ts

export function createYamlTemplate(fileName: string): string {
  return `version: '3.8'
metadata:
  name: ${fileName}
`;
}
