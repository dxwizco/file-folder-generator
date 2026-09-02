// py.ts

export function createPyTemplate(_fileName: string): string {
  return `def main():
    pass

if __name__ == "__main__":
    main()
`;
}
