// src/core/models/ForgeStatistics.ts

export interface ForgePlanStats {
  folders: number;
  files: number;
}

export interface ForgeExecutionStats {
  folders: number;
  created: number;
  updated: number;
  skipped: number;
}
