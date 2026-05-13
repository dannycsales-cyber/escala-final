export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'reminder' | 'confirmation' | 'alert' | 'open-slot';
  eventId?: string;
  assignmentId?: string;
}

export type Ministry = 'ESTACIONAMENTO' | 'RECEPÇÃO' | 'COZINHA' | 'KIDS' | 'MÍDIA' | 'CAPITÃO' | 'APOIO TEMPLO';

export interface Task {
  id: string;
  label: string;
  completed: boolean;
}

export interface MinistryGuide {
  ministry: Ministry;
  description: string;
  responsibilities: string[];
  checklist: {
    before: string[];
    during: string[];
    after: string[];
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'coordinator';
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  timestamp: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  ministries: Ministry[];
  primaryRole: string;
  availableDates: string[]; // ISO dates
  lastServedAt?: string; // ISO date
  observations?: string;
  photoUrl?: string;
}

export type EventType = 'recurrent' | 'special' | 'conference' | 'vigil';

export interface ChurchEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  arrivalTime: string;
  type: EventType;
  teamsNeeded: Ministry[];
  status: 'draft' | 'published';
  description?: string;
  isSantaCeia?: boolean;
  colorOverride?: string;
}

export interface Assignment {
  id: string;
  eventId: string;
  volunteerId: string;
  ministry: Ministry;
  role: string;
  status: 'assigned' | 'confirmed' | 'declined' | 'completed' | 'open';
  checklist?: {
    before: string[];
    during: string[];
    after: string[];
  };
}

export interface TeamRequirement {
  ministry: Ministry;
  count: number;
}

export const MINISTRY_REQUIREMENTS: Record<Ministry, number> = {
  'ESTACIONAMENTO': 2,
  'RECEPÇÃO': 3,
  'COZINHA': 2,
  'KIDS': 3,
  'MÍDIA': 3,
  'CAPITÃO': 1,
  'APOIO TEMPLO': 3,
};
