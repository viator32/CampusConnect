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

export interface Preferences {
  theme: 'light' | 'dark';
  language: string;
  timeFormat: string;
}

export interface Settings {
  notifications: Notifications;
  privacy: Privacy;
  preferences: Preferences;
}

export interface JoinedEvent {
  id: number;
  clubId: number;
  clubName: string;
  clubImage: string;   // emoji or icon
  title: string;
  date: string;        // ISO date "2025-07-20"
  time: string;        // "14:00"
}

export interface User {
  id: number;
  role: string;
  name: string;
  email: string;
  avatar: string;
  year: string;
  major: string;
  bio: string;
  joinedDate: string;
  clubsJoined: number;
  eventsAttended: number;
  postsCreated: number;
  badges: string[];
  interests: string[];
  joinedClubIds: string[];
  settings: Settings;

  // ← newly added
  joinedEvents: JoinedEvent[];
}
