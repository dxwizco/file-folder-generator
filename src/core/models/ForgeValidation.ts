// src/core/models/ForgeValidation.ts

export interface ForgeValidation {
  errors: string[];
  warnings: string[];
  duplicateCount: number;
  valid: boolean;
}
