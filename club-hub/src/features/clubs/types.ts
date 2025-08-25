// src/features/clubs/types.ts

import { Subject, Preference } from '../profile/types';

export type EventStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Participant {
  id: string;
  name: string;
  surname: string;
  email: string;
  avatar?: string;
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
  avatar?: string;
  liked?: boolean;
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
  avatar?: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  commentsList?: Comment[];
  photo?: string;
  poll?: Poll;
  liked?: boolean;
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
  avatar?: string;
  replies: number;
  lastActivity: string;
  content?: string;
  posts?: Comment[];
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  subject: Subject;
  interest: Preference;
  avatar: string;
  isJoined: boolean;

  events: Event[];
  posts: Post[];
  members_list: Member[];
  forum_threads: Thread[];
}
