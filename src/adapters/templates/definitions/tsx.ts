// tsx.ts

export function createTsxTemplate(fileName: string): string {
  return `type ${fileName}Props = {};

export default function ${fileName}({}: ${fileName}Props) {

    return (
        <div>
            ${fileName}
        </div>
    );
}
`;
}
