export interface BookmarkedPost {
  id: string;
  author: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  clubId?: string;
  clubName?: string;
  clubImage?: string;
}

export const dummyBookmarks: BookmarkedPost[] = [
  {
    id: '1',
    author: 'John Doe',
    content: 'Just finished our latest project! Check it out 🚀',
    likes: 15,
    comments: 3,
    time: '2h ago',
    clubId: '1',
    clubName: 'Computer Science Society',
    clubImage: '🖥️'
  },
  {
    id: '2',
    author: 'Jane Smith',
    content: 'Looking for study partners for the algorithms course',
    likes: 8,
    comments: 12,
    time: '5h ago',
    clubId: '1',
    clubName: 'Computer Science Society',
    clubImage: '🖥️'
  },
  {
    id: '3',
    author: 'Emily Chen',
    content: 'Photography walk this weekend anyone? 📸',
    likes: 5,
    comments: 0,
    time: '1d ago',
    clubId: '2',
    clubName: 'Photography Club',
    clubImage: '📷'
  }
];
