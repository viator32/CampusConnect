export interface BookmarkedPost {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  clubId?: string;
  clubName?: string;
  clubImage?: string;
  liked?: boolean;
}
