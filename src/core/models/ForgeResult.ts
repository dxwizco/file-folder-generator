// src/core/models/ForgeResult.ts

import type { ForgeDefinition } from "./ForgeDefinition";
import type { ForgeNode } from "./ForgeNode";
import type { ForgeExecutionStats, ForgePlanStats } from "./ForgeStatistics";
import type { ForgeValidation } from "./ForgeValidation";

export interface ForgeResult {
  definition: ForgeDefinition;
  nodes: ForgeNode[];
  validation: ForgeValidation;
  plan: ForgePlanStats;
  execution?: ForgeExecutionStats;
}
