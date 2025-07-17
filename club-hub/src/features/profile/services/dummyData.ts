import { User } from '../types';

export const initialUser: User = {
  id: 1,
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
