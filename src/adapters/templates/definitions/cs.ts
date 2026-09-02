// cs.ts

export function createCsTemplate(fileName: string): string {
  return `using System;

namespace Project
{
    public class ${fileName}
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Hello from ${fileName}!");
        }
    }
}
`;
}
