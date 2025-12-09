import type { DayPlan } from "./schedule";

export type { DayPlan };

export interface Event {
  id: string;
  name: string;
  description?: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  dayPlans: DayPlan[];
  tags?: import("./tag").Tag[];
}
