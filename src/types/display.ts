import { DeviceStatus } from "@prisma/client";

export interface Display {
  id: string;
  organisationId: string | null;
  name: string;
  registrationCode: string | null;
  codeExpiresAt: Date | null;
  pairingCode: string | null;
  socketId: string | null;
  status: DeviceStatus;
  isActive: boolean;
  currentDayPlanId: string | null;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
