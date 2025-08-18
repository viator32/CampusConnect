// src/features/clubs/types.ts

export type EventStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Participant {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;             // ISO date string, e.g. "2025-07-20"
  time: string;             // HH:mm format, e.g. "14:00"
  location?: string;        // e.g. "Student Union, Room 101"
  status?: EventStatus;
  joined?: number;
  participants?: Participant[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  time: string;
  likes?: number;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  commentsList?: Comment[];
  photo?: string;
  poll?: Poll;
}

export type Role = 'ADMIN' | 'MODERATOR' | 'MEMBER';

export interface Member {
  id: number | string;
  name: string;
  role: Role;
  avatar: string;
}

export interface Thread {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  content?: string;
  posts?: Comment[];
}

// new type for club projects
export interface Project {
  id: number;
  title: string;
  description?: string;
  link?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  image: string;
  isJoined: boolean;

  events: Event[];
  posts: Post[];
  members_list: Member[];
  forum_threads: Thread[];

  // ← newly added optional fields
  founded?: string;       // e.g. "2005"
  location?: string;      // e.g. "Engineering Building, Room 101"
  tags?: string[];        // e.g. ["robotics","ai","competitive"]
  projects?: Project[];   // extra section in AboutTab
}
