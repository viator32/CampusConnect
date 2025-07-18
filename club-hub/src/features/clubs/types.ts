// src/features/clubs/types.ts

export interface Event {
  id: number;
  title: string;
   description?: string;
  date: string;
  time: string;
}

export interface Comment {
  id: number;
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
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  commentsList?: Comment[];
  /** optional photo URL */
  photo?: string;
  /** optional poll */
  poll?: Poll;
}

export interface Member {
  id: number;
  name: string;
  role: string;
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

export interface Club {
  id: number;
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
}
