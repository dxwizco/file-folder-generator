// src/core/models/DXWIZResult.ts

import type { DXWIZDefinition } from "./DXWIZDefinition";
import type { DXWIZNode } from "./DXWIZNode";
import type { DXWIZExecutionStats, DXWIZPlanStats } from "./DXWIZStatistics";
import type { DXWIZValidation } from "./DXWIZValidation";

export interface DXWIZResult {
  definition: DXWIZDefinition;
  nodes: DXWIZNode[];
  validation: DXWIZValidation;
  plan: DXWIZPlanStats;
  execution?: DXWIZExecutionStats;
}
