// src/core/models/DXWIZValidation.ts

export interface DXWIZValidation {
  errors: string[];
  warnings: string[];
  duplicateCount: number;
  valid: boolean;
}
