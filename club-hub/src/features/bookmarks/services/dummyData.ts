export interface BookmarkedPost {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
}

export const dummyBookmarks: BookmarkedPost[] = [
  {
    id: 1,
    author: 'John Doe',
    content: 'Just finished our latest project! Check it out 🚀',
    likes: 15,
    comments: 3,
    time: '2h ago'
  },
  {
    id: 2,
    author: 'Jane Smith',
    content: 'Looking for study partners for the algorithms course',
    likes: 8,
    comments: 12,
    time: '5h ago'
  }
];
