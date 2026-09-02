// src/adapters/templates/definitions/dockerignore.ts

export function createDockerignoreTemplate(_fileName: string): string {
  return `**/.git
**/node_modules
**/__pycache__
*Dockerfile*
*docker-compose*
.env
`;
}
