// src/core/models/DXWIZStatistics.ts

export interface DXWIZPlanStats {
  folders: number;
  files: number;
}

export interface DXWIZExecutionStats {
  folders: number;
  created: number;
  updated: number;
  skipped: number;
}
