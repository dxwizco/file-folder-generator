// env.ts

export function createEnvTemplate(_fileName: string): string {
  return `# Environment Configurations
PORT=3000
NODE_ENV=development
`;
}
