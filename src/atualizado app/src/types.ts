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

export type Ministry = 'CAPITÃO' | 'APOIO TEMPLO' | 'RECEPÇÃO' | 'ESTACIONAMENTO' | 'COZINHA' | 'KIDS' | 'MÍDIA' | 'DANÇA';

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

export const MINISTRY_REQUIREMENTS: Record<Ministry, { quarta: number; domingo: number }> = {
  'CAPITÃO': { quarta: 1, domingo: 1 },
  'APOIO TEMPLO': { quarta: 3, domingo: 3 },
  'RECEPÇÃO': { quarta: 2, domingo: 2 },
  'ESTACIONAMENTO': { quarta: 2, domingo: 2 },
  'COZINHA': { quarta: 2, domingo: 2 },
  'KIDS': { quarta: 3, domingo: 3 },
  'MÍDIA': { quarta: 2, domingo: 3 },
  'DANÇA': { quarta: 4, domingo: 4 },
};

export const getMinistryRequirement = (ministry: Ministry, date: string): number => {
  const day = new Date(date).getUTCDay();
  const req = MINISTRY_REQUIREMENTS[ministry];
  if (!req) return 0;
  
  // 0 is Sunday, 3 is Wednesday
  if (day === 0) return req.domingo;
  if (day === 3) return req.quarta;
  
  // For other days, default to Wednesday count or Sunday if it's weekend
  return (day === 6 || day === 0) ? req.domingo : req.quarta;
};
