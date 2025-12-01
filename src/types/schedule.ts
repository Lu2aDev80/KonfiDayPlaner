export type SessionItem = {
  id: number;
  time: string;
  type: 'session';
  title: string;
  speaker?: string;
  location?: string;
  details?: string;
  // Change tracking
  timeChanged?: boolean;
  positionChanged?: boolean;
  originalTime?: string;
  originalPosition?: number;
};
export type WorkshopItem = {
  id: number;
  time: string;
  type: 'workshop';
  title: string;
  speaker?: string;
  location?: string;
  materials?: string;
  details?: string;
  // Change tracking
  timeChanged?: boolean;
  positionChanged?: boolean;
  originalTime?: string;
  originalPosition?: number;
};
export type BreakItem = {
  id: number;
  time: string;
  type: 'break';
  title: string;
  duration?: string;
  snacks?: string;
  // Change tracking
  timeChanged?: boolean;
  positionChanged?: boolean;
  originalTime?: string;
  originalPosition?: number;
};
export type AnnouncementItem = {
  id: number;
  time: string;
  type: 'announcement';
  title: string;
  details?: string;
  // Change tracking
  timeChanged?: boolean;
  positionChanged?: boolean;
  originalTime?: string;
  originalPosition?: number;
};
export type GameItem = {
  id: number;
  time: string;
  type: 'game';
  title: string;
  facilitator?: string;
  location?: string;
  materials?: string;
  details?: string;
  // Change tracking
  timeChanged?: boolean;
  positionChanged?: boolean;
  originalTime?: string;
  originalPosition?: number;
};
export type TransitionItem = {
  id: number;
  time: string;
  type: 'transition';
  title: string;
  // Change tracking
  timeChanged?: boolean;
  positionChanged?: boolean;
  originalTime?: string;
  originalPosition?: number;
};
export type ScheduleItem =
  | SessionItem
  | WorkshopItem
  | BreakItem
  | AnnouncementItem
  | GameItem
  | TransitionItem;
