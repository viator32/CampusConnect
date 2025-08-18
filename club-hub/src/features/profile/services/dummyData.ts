import { User } from '../types';

export const initialUser: User = {
  id: '1',
  role: "admin",
  name: "John Doe",
  email: "john.doe@university.edu",
  avatar: "👨‍🎓",
  year: "Junior",
  major: "Computer Science",
  bio: "Passionate about technology and creating innovative solutions. Love connecting with fellow students through clubs and activities.",
  joinedDate: "September 2023",
  clubsJoined: 5,
  eventsAttended: 23,
  postsCreated: 12,
  badges: ["Active Member", "Event Organizer", "Helpful Contributor"],
  interests: ["Programming", "Photography", "Debate", "Volunteering"],
  memberships: [],
  joinedEvents: [
    {
      id: 101,
      clubId: '10',
      clubName: "Art Society",
      clubImage: "🎨",
      title: "Watercolor Workshop",
      date: "2025-08-05",
      time: "14:00"
    },
    {
      id: 202,
      clubId: '20',
      clubName: "Chess Club",
      clubImage: "♟️",
      title: "Weekly Blitz Tournament",
      date: "2025-08-07",
      time: "18:30"
    }
  ],

  settings: {
    notifications: {
      email: true,
      push: true,
      clubUpdates: true,
      eventReminders: true,
      forumReplies: true
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showClubs: true,
      allowMessages: true
    },
    preferences: {
      theme: "light",
      language: "english",
      timeFormat: "12h"
    }
  }
};
