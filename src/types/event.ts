import type { DayPlan } from "./schedule";

export interface Event {
  id: string;
  name: string;
  description?: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  dayPlans: DayPlan[];
}
