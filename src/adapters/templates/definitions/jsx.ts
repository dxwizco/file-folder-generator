// jsx.ts

export function createJsxTemplate(fileName: string): string {
  return `import React from 'react';

export default function ${fileName}() {
  return (
    <div>
      <h1>${fileName} Component</h1>
    </div>
  );
}
`;
}
