import type { Role } from '../clubs/types';

export enum Subject {
  COMPUTER_SCIENCE = 'COMPUTER_SCIENCE',
  MATHEMATICS = 'MATHEMATICS',
  PHYSICS = 'PHYSICS',
  ENGINEERING = 'ENGINEERING',
  BUSINESS = 'BUSINESS',
  LAW = 'LAW',
  MEDICINE = 'MEDICINE',
  ARCHITECTURE = 'ARCHITECTURE',
  CIVIL_ENGINEERING = 'CIVIL_ENGINEERING',
  ELECTRICAL_ENGINEERING = 'ELECTRICAL_ENGINEERING',
  MECHANICAL_ENGINEERING = 'MECHANICAL_ENGINEERING',
  MEDIA_DESIGN = 'MEDIA_DESIGN',
  SOCIAL_WORK = 'SOCIAL_WORK',
  BUSINESS_ADMINISTRATION = 'BUSINESS_ADMINISTRATION',
  INDUSTRIAL_ENGINEERING = 'INDUSTRIAL_ENGINEERING',
}

export enum Preference {
  PROGRAMMING = 'PROGRAMMING',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  DEBATE = 'DEBATE',
  VOLUNTEERING = 'VOLUNTEERING',
  MUSIC = 'MUSIC',
  ART = 'ART',
  SPORTS = 'SPORTS',
  GAMING = 'GAMING',
  COOKING = 'COOKING',
  READING = 'READING',
  TRAVEL = 'TRAVEL',
  DANCE = 'DANCE',
}

export interface Notifications {
  email: boolean;
  push: boolean;
  clubUpdates: boolean;
  eventReminders: boolean;
  forumReplies: boolean;
}

export interface Privacy {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  showClubs: boolean;
  allowMessages: boolean;
}

export interface PreferencesSettings {
  theme: 'light' | 'dark';
  language: string;
  timeFormat: string;
}

export interface Settings {
  notifications: Notifications;
  privacy: Privacy;
  preferences: PreferencesSettings;
}

export interface Membership {
  id: string;
  clubId: string;
  name: string;
  role: Role;
  avatar: string;
  joinedAt: string;
}

export interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  avatar: string;
  description: string;
  subject: Subject | '';
  preferences: Preference[];
  clubsJoined: number;
  eventsAttended: number;
  memberships: Membership[];
  settings: Settings;
}
