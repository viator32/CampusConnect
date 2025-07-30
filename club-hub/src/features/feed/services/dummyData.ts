import { Comment } from '../../clubs/types';

export interface FeedPost {
  id: number;
  clubId: number;
  clubName: string;
  clubImage: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  commentsList?: Comment[];
}

export let dummyFeedPosts: FeedPost[] = [
  {
    id: 1,
    clubId: 1,
    clubName: 'Computer Science Society',
    clubImage: '🖥️',
    author: 'John Doe',
    content: 'Just finished our latest project! Check it out 🚀',
    likes: 15,
    comments: 3,
    time: '2h ago',
    commentsList: [
      { id: 1, author: 'Alice Johnson', content: 'Great work!', time: '1h ago' }
    ]
  },
  {
    id: 2,
    clubId: 2,
    clubName: 'Photography Club',
    clubImage: '📸',
    author: 'Emma Davis',
    content: "Beautiful sunset shots from yesterday's meetup 🌅",
    likes: 32,
    comments: 7,
    time: '1h ago',
    commentsList: [
      { id: 2, author: 'Frank Miller', content: 'The composition is perfect!', time: '50m ago' }
    ]
  }
];
