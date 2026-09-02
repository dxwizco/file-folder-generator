// go.ts

export function createGoTemplate(fileName: string): string {
  return `package main

import "fmt"

func main() {
\tfmt.Println("Hello from ${fileName}!")
}
`;
}
