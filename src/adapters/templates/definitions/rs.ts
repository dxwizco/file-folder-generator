// rs.ts

export function createRsTemplate(fileName: string): string {
  return `fn main() {
    println!("Hello from ${fileName}!");
}
`;
}
