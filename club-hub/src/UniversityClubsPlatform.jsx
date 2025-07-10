import React, { useState } from 'react';
import {
  Search,
  Users,
  Calendar,
  MessageSquare,
  BookOpen,
  Bookmark,
  Home,
  TrendingUp,
  Bell,
  Settings,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MapPin,
  Clock,
  Crown,
  Shield,
  User,
  Plus,
  Filter,
  Grid,
  List
} from 'lucide-react';

const UniversityClubsPlatform = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubActiveTab, setClubActiveTab] = useState('about');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [newComment, setNewComment] = useState('');

  const initialUser = {
    id: 1,
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
  const [currentUser, setCurrentUser] = useState(initialUser);

  const toggleNotification = (key) => {
    setCurrentUser({
      ...currentUser,
      settings: {
        ...currentUser.settings,
        notifications: {
          ...currentUser.settings.notifications,
          [key]: !currentUser.settings.notifications[key]
        }
      }
    });
  };

  const togglePrivacy = (key) => {
    setCurrentUser({
      ...currentUser,
      settings: {
        ...currentUser.settings,
        privacy: {
          ...currentUser.settings.privacy,
          [key]: !currentUser.settings.privacy[key]
        }
      }
    });
  };

  const changePreference = (key, value) => {
    setCurrentUser({
      ...currentUser,
      settings: {
        ...currentUser.settings,
        preferences: {
          ...currentUser.settings.preferences,
          [key]: value
        }
      }
    });
  };

  const clubs = [
    {
      id: 1,
      name: "Computer Science Society",
      description: "A community for CS students to collaborate and learn",
      members: 245,
      category: "Academic",
      image: "🖥️",
      isJoined: true,
      events: [
        { id: 1, title: "Hackathon 2025", date: "2025-07-15", time: "10:00 AM" },
        { id: 2, title: "Tech Talk: AI in Healthcare", date: "2025-07-20", time: "2:00 PM" }
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
      id: 2,
      name: "Photography Club",
      description: "Capture memories and improve your photography skills",
      members: 128,
      category: "Creative",
      image: "📸",
      isJoined: false,
      events: [
        { id: 3, title: "Campus Photo Walk", date: "2025-07-12", time: "9:00 AM" },
        { id: 4, title: "Portrait Photography Workshop", date: "2025-07-18", time: "1:00 PM" }
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
      id: 3,
      name: "Debate Society",
      description: "Sharpen your argumentation and public speaking skills",
      members: 87,
      category: "Academic",
      image: "🎯",
      isJoined: true,
      events: [
        { id: 5, title: "Weekly Debate Night", date: "2025-07-11", time: "7:00 PM" }
      ],
      posts: [],
      members_list: [
        { id: 7, name: "Grace Lee", role: "President", avatar: "👩‍⚖️" }
      ],
      forum_threads: []
    }
  ];

  const sidebarItems = [
    { id: 'explore', label: 'Explore', icon: TrendingUp },
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'my-clubs', label: 'My Clubs', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const clubTabs = [
    { id: 'about', label: 'About', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'posts', label: 'Posts', icon: MessageCircle },
    { id: 'members', label: 'Members', icon: Users }
  ];

  const categories = ['All', 'Academic', 'Creative', 'Sports', 'Cultural', 'Technical'];

  const renderUserProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setShowUserProfile(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
            {currentUser.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-gray-600">{currentUser.year} • {currentUser.major}</p>
            <p className="text-gray-500 text-sm">Member since {currentUser.joinedDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{currentUser.clubsJoined}</div>
            <div className="text-sm text-gray-600">Clubs Joined</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{currentUser.eventsAttended}</div>
            <div className="text-sm text-gray-600">Events Attended</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{currentUser.postsCreated}</div>
            <div className="text-sm text-gray-600">Posts Created</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-700">{currentUser.bio}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.badges.map(badge => (
              <span key={badge} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.interests.map(interest => (
              <span key={interest} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900">{currentUser.email}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsPage = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          {Object.entries(currentUser.settings.notifications).map(([key, enabled]) => {
            const labelMap = {
              email: 'Email Notifications',
              push: 'Push Notifications',
              clubUpdates: 'Club Updates',
              eventReminders: 'Event Reminders',
              forumReplies: 'Forum Replies'
            };
            const descMap = {
              email: 'Receive notifications via email',
              push: 'Receive push notifications on your device',
              clubUpdates: 'Get updates when clubs you follow post',
              eventReminders: 'Be reminded before events',
              forumReplies: 'Notify when someone replies to your forum posts'
            };
            return (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{labelMap[key]}</p>
                  <p className="text-sm text-gray-600">{descMap[key]}</p>
                </div>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">Who can see your profile</p>
            </div>
            <select
              value={currentUser.settings.privacy.profileVisibility}
              onChange={e => changePreference('profileVisibility', e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          {['showEmail', 'showClubs', 'allowMessages'].map(key => {
            const labelMap = {
              showEmail: 'Show Email on Profile',
              showClubs: 'Show Clubs on Profile',
              allowMessages: 'Allow Direct Messages'
            };
            return (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{labelMap[key]}</p>
                </div>
                <button
                  onClick={() => togglePrivacy(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    currentUser.settings.privacy[key] ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      currentUser.settings.privacy[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Theme</p>
            </div>
            <select
              value={currentUser.settings.preferences.theme}
              onChange={e => changePreference('theme', e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Language</p>
            </div>
            <select
              value={currentUser.settings.preferences.language}
              onChange={e => changePreference('language', e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Time Format</p>
            </div>
            <select
              value={currentUser.settings.preferences.timeFormat}
              onChange={e => changePreference('timeFormat', e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClubCard = (club) => (
    <div
      key={club.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedClub(club)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">{club.image}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{club.name}</h3>
            <p className="text-sm text-gray-600">{club.category}</p>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">{club.members}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{club.description}</p>
        <div className="flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              club.isJoined ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {club.isJoined ? 'Joined' : 'Not Joined'}
          </span>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              club.isJoined
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {club.isJoined ? 'Joined' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderClubListItem = (club) => (
    <div
      key={club.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-4"
      onClick={() => setSelectedClub(club)}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{club.image}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{club.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{club.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {club.members} members
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100">{club.category}</span>
          </div>
        </div>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            club.isJoined
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {club.isJoined ? 'Joined' : 'Join'}
        </button>
      </div>
    </div>
  );

  const renderExploreContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clubs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {clubs.filter(club =>
          club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(club => viewMode === 'grid' ? renderClubCard(club) : renderClubListItem(club))}
      </div>
    </div>
  );

  const renderFeedContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {clubs.flatMap(club =>
            club.posts.map(post => (
              <div key={`${club.id}-${post.id}`} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-lg">{club.image}</div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author}</p>
                    <p className="text-sm text-gray-500">{club.name} • {post.time}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{post.content}</p>
                <div className="flex items-center gap-6 text-gray-500">
                  <button className="flex items-center gap-1 hover:text-orange-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-orange-500">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-orange-500">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderMyClubsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Clubs</h2>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Club
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.filter(club => club.isJoined).map(renderClubCard)}
      </div>
    </div>
  );

  const renderClubAbout = (club) => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{club.image}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{club.name}</h2>
            <p className="text-gray-600">{club.category}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{club.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="text-gray-700">{club.members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span className="text-gray-700">Student Union, Room 205</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">About This Club</h3>
        <p className="text-gray-700 mb-4">
          Welcome to the {club.name}! We are a vibrant community of students passionate about {club.category.toLowerCase()} activities.
          Our mission is to provide a supportive environment where members can learn, grow, and connect with like-minded individuals.
        </p>
        <p className="text-gray-700">
          We organize regular events, workshops, and social gatherings throughout the academic year. Whether you're a beginner or an expert,
          there's always something for everyone in our community.
        </p>
      </div>
    </div>
  );

  const renderClubEvents = (club) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Upcoming Events</h3>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {club.events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{event.time}</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
              Join Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClubForum = (club) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Forum Discussions</h3>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Thread
        </button>
      </div>

      <div className="space-y-4">
        {club.forum_threads.map(thread => (
          <div
            key={thread.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedThread(thread)}
          >
            <h4 className="font-semibold text-gray-900 mb-2 hover:text-orange-600">{thread.title}</h4>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>By {thread.author}</span>
              <div className="flex items-center gap-4">
                <span>{thread.replies} replies</span>
                <span>{thread.lastActivity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThreadPage = (thread) => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedThread(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Forum
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{thread.author}</p>
            <p className="text-sm text-gray-500">Original Post</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{thread.title}</h2>
        <p className="text-gray-700 mb-4">{thread.content}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{thread.replies} replies</span>
          <span>{thread.lastActivity}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Replies</h3>
        {thread.posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="text-gray-500 hover:text-orange-500 text-sm">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Add a Reply</h4>
        <textarea
          placeholder="Write your reply..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );

  const renderClubPosts = (club) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Club Posts</h3>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="space-y-4">
        {club.posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex items-center gap-6 text-gray-500">
              <button className="flex items-center gap-1 hover:text-orange-500">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button
                className="flex items-center gap-1 hover:text-orange-500"
                onClick={() => setSelectedPost(post)}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-orange-500">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 hover:text-orange-500">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPostComments = (post) => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedPost(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Posts
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author}</p>
            <p className="text-sm text-gray-500">{post.time}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex items-center gap-6 text-gray-500">
          <button className="flex items-center gap-1 hover-text-orange-500">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{post.likes}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{post.comments} comments</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        {post.commentsList.map(comment => (
          <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{comment.author}</p>
                <p className="text-sm text-gray-500">{comment.time}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{comment.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{comment.likes}</span>
              </button>
              <button className="text-gray-500 hover:text-orange-500 text-sm">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Add a Comment</h4>
        <textarea
          placeholder="Write your comment..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );

  const renderClubMembers = (club) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Members ({club.members})</h3>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Invite Members
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {club.members_list.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{member.avatar}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.name}</p>
                <div className="flex items-center gap-2">
                  {member.role === 'President' && <Crown className="w-4 h-4 text-orange-500" />}
                  {member.role === 'Vice President' && <Shield className="w-4 h-4 text-orange-500" />}
                  <span className="text-sm text-gray-600">{member.role}</span>
                </div>
              </div>
              <button className="text-orange-500 hover:text-orange-600">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClubContent = () => {
    if (!selectedClub) return null;

    const renderTabContent = () => {
      switch (clubActiveTab) {
        case 'about':
          return renderClubAbout(selectedClub);
        case 'events':
          return renderClubEvents(selectedClub);
        case 'forum':
          return renderClubForum(selectedClub);
        case 'posts':
          return renderClubPosts(selectedClub);
        case 'members':
          return renderClubMembers(selectedClub);
        default:
          return renderClubAbout(selectedClub);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedClub(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Clubs
          </button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{selectedClub.image}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedClub.name}</h1>
              <p className="text-gray-600">{selectedClub.members} members</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {clubTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setClubActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    clubActiveTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {renderTabContent()}
      </div>
    );
  };

  const renderMainContent = () => {
    if (showUserProfile) {
      return renderUserProfile();
    }
    if (selectedThread) {
      return renderThreadPage(selectedThread);
    }
    if (selectedPost) {
      return renderPostComments(selectedPost);
    }
    if (selectedClub) {
      return renderClubContent();
    }
    switch (activeTab) {
      case 'explore':
        return renderExploreContent();
      case 'feed':
        return renderFeedContent();
      case 'my-clubs':
        return renderMyClubsContent();
      case 'bookmarks':
        return (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600">Bookmark clubs and posts to find them easily later</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        );
      case 'settings':
        return renderSettingsPage();
      default:
        return renderExploreContent();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">ClubHub</h1>
          <p className="text-sm text-gray-600">University Clubs Platform</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowUserProfile(false);
                  setSelectedClub(null);
                  setSelectedThread(null);
                  setSelectedPost(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left font-medium transition-colors ${
                  activeTab === item.id && !selectedClub && !showUserProfile
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div
          className="p-4 border-t border-gray-200 cursor-pointer"
          onClick={() => {
            setShowUserProfile(true);
            setSelectedClub(null);
            setSelectedThread(null);
            setSelectedPost(null);
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-sm text-gray-600">Student</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default UniversityClubsPlatform;
