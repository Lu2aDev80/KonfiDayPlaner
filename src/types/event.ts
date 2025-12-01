import type { ScheduleItem } from './schedule';

export interface Event {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  dayPlans: DayPlan[];
}

export interface DayPlan {
  id: string;
  eventId: string;
  name: string;
  date: string;
  schedule: ScheduleItem[];
  createdAt: Date;
  updatedAt: Date;
}