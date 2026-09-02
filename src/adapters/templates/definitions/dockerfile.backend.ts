// dockerfile.backend.ts

export function createDockerfileBackendTemplate(_fileName: string): string {
  return `# === BACKEND ENVIRONMENT ===
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
`;
}
