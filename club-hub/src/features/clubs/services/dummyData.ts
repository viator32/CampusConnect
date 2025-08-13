import { Club } from '../types';

export const dummyClubs: Club[] = [
  {
    id: '1',
    name: "Computer Science Society",
    description: "A community for CS students to collaborate and learn",
    members: 245,
    category: "Academic",
    image: "🖥️",
    isJoined: true,
    events: [
      { id: 1, title: "Hackathon 2025", description:"some top event", date: "2025-07-15", time: "10:00 AM" },
      { id: 2, title: "Tech Talk: AI in Healthcare", description:"some top event", date: "2025-07-20", time: "2:00 PM" }
    ],
    posts: [
      {
        id: 1,
        author: "John Doe",
        content: "Just finished our latest project! Check it out 🚀",
        likes: 15,
        comments: 3,
        time: "2h ago",
        commentsList: [
          { id: 1, author: "Alice Johnson", content: "Great work! Can you share the GitHub link?", time: "1h ago", likes: 2 },
          { id: 2, author: "Bob Wilson", content: "This looks amazing! How long did it take?", time: "45m ago", likes: 1 },
          { id: 3, author: "Carol Brown", content: "Would love to collaborate on the next version", time: "30m ago", likes: 0 }
        ]
      },
      {
        id: 2,
        author: "Jane Smith",
        content: "Looking for study partners for the algorithms course",
        likes: 8,
        comments: 12,
        time: "5h ago",
        commentsList: [
          { id: 4, author: "David Lee", content: "I'm interested! What topics are you covering?", time: "4h ago", likes: 3 },
          { id: 5, author: "Emma Davis", content: "Count me in! I'm struggling with dynamic programming", time: "3h ago", likes: 2 }
        ]
      }
    ],
    members_list: [
      { id: 1, name: "Alice Johnson", role: "President", avatar: "👩‍💼" },
      { id: 2, name: "Bob Wilson", role: "Vice President", avatar: "👨‍💻" },
      { id: 3, name: "Carol Brown", role: "Treasurer", avatar: "👩‍🎓" },
      { id: 4, name: "David Lee", role: "Member", avatar: "👨‍🎓" }
    ],
    forum_threads: [
      {
        id: 1,
        title: "Best programming resources for beginners",
        author: "Mike Chen",
        replies: 23,
        lastActivity: "1h ago",
        content: "Hey everyone! I'm creating a comprehensive list of programming resources for beginners. What are your top recommendations for someone just starting out?",
        posts: [
          { id: 1, author: "Alice Johnson", content: "I highly recommend FreeCodeCamp - it's completely free and very comprehensive!", time: "45m ago", likes: 8 },
          { id: 2, author: "Bob Wilson", content: "Codecademy is great for interactive learning. The Python course is excellent.", time: "30m ago", likes: 5 },
          { id: 3, author: "Carol Brown", content: "Don't forget about YouTube! Channels like Corey Schafer have amazing tutorials.", time: "15m ago", likes: 12 }
        ]
      },
      {
        id: 2,
        title: "Internship opportunities discussion",
        author: "Sarah Kim",
        replies: 45,
        lastActivity: "3h ago",
        content: "Let's share internship opportunities and tips for landing tech internships. I'll start with some companies I know are hiring.",
        posts: [
          { id: 4, author: "David Lee", content: "Google Summer of Code applications are open! Great opportunity for open source contributions.", time: "2h ago", likes: 15 },
          { id: 5, author: "Emma Davis", content: "Local startups are often overlooked but offer amazing learning experiences.", time: "1h ago", likes: 7 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: "Photography Club",
    description: "Capture memories and improve your photography skills",
    members: 128,
    category: "Creative",
    image: "📸",
    isJoined: false,
    events: [
      { id: 3, title: "Campus Photo Walk",description:"some top event", date: "2025-07-12", time: "9:00 AM" },
      { id: 4, title: "Portrait Photography Workshop",description:"some top event", date: "2025-07-18", time: "1:00 PM" }
    ],
    posts: [
      {
        id: 3,
        author: "Emma Davis",
        content: "Beautiful sunset shots from yesterday's meetup 🌅",
        likes: 32,
        comments: 7,
        time: "1h ago",
        commentsList: [
          { id: 6, author: "Frank Miller", content: "The composition is perfect! What camera settings did you use?", time: "50m ago", likes: 4 },
          { id: 7, author: "Grace Lee", content: "Stunning colors! I wish I could have joined the meetup", time: "35m ago", likes: 2 }
        ]
      }
    ],
    members_list: [
      { id: 5, name: "Emma Davis", role: "President", avatar: "👩‍🎨" },
      { id: 6, name: "Frank Miller", role: "Event Coordinator", avatar: "👨‍🎨" }
    ],
    forum_threads: [
      {
        id: 3,
        title: "Equipment recommendations under $500",
        author: "Tom Wilson",
        replies: 18,
        lastActivity: "2h ago",
        content: "Looking for camera recommendations for beginners with a budget under $500. What would you suggest?",
        posts: [
          { id: 8, author: "Emma Davis", content: "Canon EOS Rebel T7 is a great starter DSLR within your budget!", time: "1h ago", likes: 6 },
          { id: 9, author: "Frank Miller", content: "Consider mirrorless cameras too - Sony Alpha a6000 is excellent value", time: "45m ago", likes: 4 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: "Debate Society",
    description: "Sharpen your argumentation and public speaking skills",
    members: 87,
    category: "Academic",
    image: "🎯",
    isJoined: true,
    events: [{ id: 5, title: "Weekly Debate Night",description:"some top event", date: "2025-07-11", time: "7:00 PM" }],
    posts: [],
    members_list: [{ id: 7, name: "Grace Lee", role: "President", avatar: "👩‍⚖️" }],
    forum_threads: []
  }
];
