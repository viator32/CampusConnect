// src/features/clubs/pages/ClubDetailPage.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { Club, Thread, Post } from '../types';
import { ClubService } from '../services/ClubService';
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  MessageCircle,
  User as UserIcon,
  Heart,
  Share2,
  Image as PhotoIcon,
  BarChart2,
  Bookmark as BookmarkIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Button from '../../../components/Button';

export default function ClubDetailPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState<'about'|'events'|'forum'|'posts'|'members'>('about');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // New feature state
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostPhoto, setNewPostPhoto] = useState<File | null>(null);
  const [isPoll, setIsPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [memberView, setMemberView] = useState<'grid'|'list'>('grid');

  // Validation errors
  const [postError, setPostError] = useState<string | null>(null);
  const [threadError, setThreadError] = useState<string | null>(null);

    // --- Calendar & Create‑Event State ---
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [eventError, setEventError] = useState<string|null>(null);

  const prevMonth = () => {
    const m = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const y = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    setCalendarMonth(m);
    setCalendarYear(y);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    const m = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    setCalendarMonth(m);
    setCalendarYear(y);
    setSelectedDate(null);
  };

  const handleCreateEvent = () => {
    setEventError(null);
    if (!newEventTitle.trim() || !newEventDate || !newEventTime) {
      setEventError('Title, date & time are required.');
      return;
    }
    const newEv = {
      id: Date.now(),
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      description: newEventDesc
    };
    setClub({ ...club!, events: [ newEv, ...club!.events ] });
    // reset
    setShowCreateEventForm(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventDesc('');
  };


  useEffect(() => {
    if (clubId) {
      ClubService.getById(Number(clubId)).then(c => setClub(c || null));
    }
  }, [clubId]);

  if (!club) return <div>Loading...</div>;

  // Handlers
  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(ids =>
      ids.includes(postId) ? ids.filter(id => id !== postId) : [...ids, postId]
    );
  };

  const handlePostPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setNewPostPhoto(e.target.files[0]);
  };

  const handleAddPollOption = () => {
    setPollOptions(opts => [...opts, '']);
  };

  const handlePollOptionChange = (idx: number, value: string) => {
    setPollOptions(opts => opts.map((o,i) => i === idx ? value : o));
  };

  const handlePostSubmit = () => {
    setPostError(null);
    // Basic validation: need text, photo, or poll
    if (!newPostText.trim() && !newPostPhoto && !isPoll) {
      setPostError('Please add text, upload a photo, or create a poll before posting.');
      return;
    }
    // If poll mode, require question + at least two non-empty options
    if (isPoll) {
      if (!pollQuestion.trim()) {
        setPostError('Please enter a poll question.');
        return;
      }
      const filled = pollOptions.filter(o => o.trim());
      if (filled.length < 2) {
        setPostError('Please provide at least two poll options.');
        return;
      }
    }

    const newPost: Post = {
      id: Date.now(),
      author: 'You',
      content: newPostText,
      likes: 0,
      comments: 0,
      time: 'Just now',
      commentsList: [],
      photo: newPostPhoto ? URL.createObjectURL(newPostPhoto) : undefined,
      poll: isPoll
        ? {
            question: pollQuestion,
            options: pollOptions
              .filter(o => o.trim())
              .map(o => ({ text: o, votes: 0 }))
          }
        : undefined
    };

    setClub({ ...club, posts: [newPost, ...club.posts] });
    // reset
    setNewPostText('');
    setNewPostPhoto(null);
    setIsPoll(false);
    setPollQuestion('');
    setPollOptions(['','']);
  };

  const handleThreadSubmit = () => {
    setThreadError(null);
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      setThreadError('Please enter both a title and content for your thread.');
      return;
    }

    const newThread: Thread = {
      id: Date.now(),
      title: newThreadTitle,
      author: 'You',
      content: newThreadContent,
      replies: 0,
      lastActivity: 'Just now',
      posts: []
    };

    setClub({ ...club, forum_threads: [newThread, ...club.forum_threads] });
    setNewThreadTitle('');
    setNewThreadContent('');
  };

  // Thread detail view
  if (selectedThread) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedThread(null)} className="text-gray-500 hover:text-gray-700">
          ← Back to Forum
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedThread.author}</p>
              <p className="text-sm text-gray-500">Original Post</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedThread.title}</h2>
          <p className="text-gray-700 mb-4">{selectedThread.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{selectedThread.replies} replies</span>
            <span>{selectedThread.lastActivity}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Replies</h3>
          {(selectedThread.posts ?? []).map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.time}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{post.content}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                  <Heart className="w-4 h-4" /><span className="text-sm">{post.likes}</span>
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
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Post Reply
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Post comments view
  if (selectedPost) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-gray-700">
          ← Back to Posts
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedPost.author}</p>
              <p className="text-sm text-gray-500">{selectedPost.time}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{selectedPost.content}</p>
          <div className="flex items-center gap-6 text-gray-500">
            <button className="flex items-center gap-1 hover:text-orange-500">
              <Heart className="w-4 h-4" /><span className="text-sm">{selectedPost.likes}</span>
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /><span className="text-sm">{selectedPost.comments} comments</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          {(selectedPost.commentsList ?? []).map(c => (
            <div key={c.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{c.author}</p>
                  <p className="text-sm text-gray-500">{c.time}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{c.content}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                  <Heart className="w-4 h-4" /><span className="text-sm">{c.likes}</span>
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
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main detail + tabs
  const tabs = [
    { id: 'about',   label: 'About',  icon: BookOpen      },
    { id: 'events',  label: 'Events', icon: Calendar      },
    { id: 'forum',   label: 'Forum',  icon: MessageSquare },
    { id: 'posts',   label: 'Posts',  icon: MessageCircle },
    { id: 'members', label: 'Members',icon: Users         },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{club.image}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
            <p className="text-gray-600">{club.members} members</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedThread(null);
                  setSelectedPost(null);
                }}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* About */}
      {activeTab === 'about' && (
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
                <Calendar className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">{club.events.length} upcoming events</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">About This Club</h3>
            <p className="text-gray-700">
              Welcome to the {club.name}! We’re a community of students passionate about {club.category.toLowerCase()} activities.
            </p>
          </div>
        </div>
      )}


{/* Events */}
{activeTab === 'events' && (
  <div className="flex flex-col lg:flex-row lg:space-x-6">
    {/* Left: Event List */}
    <div className="flex-1 space-y-4 overflow-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        <Button
          onClick={() => setShowCreateEventForm(b => !b)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          {showCreateEventForm ? 'Cancel' : 'Create Event'}
        </Button>
      </div>

      {showCreateEventForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          {eventError && <p className="text-sm text-red-600 mb-2">{eventError}</p>}
          <input
            type="text"
            placeholder="Event Title"
            className="w-full border border-gray-300 rounded-lg px-3 py-1 mb-2"
            value={newEventTitle}
            onChange={e => setNewEventTitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-1"
              value={newEventDate}
              onChange={e => setNewEventDate(e.target.value)}
            />
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-1"
              value={newEventTime}
              onChange={e => setNewEventTime(e.target.value)}
            />
          </div>
          <textarea
            placeholder="Description (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 resize-none"
            rows={3}
            value={newEventDesc}
            onChange={e => setNewEventDesc(e.target.value)}
          />
          <Button
            onClick={handleCreateEvent}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Add Event
          </Button>
        </div>
      )}

      {(club!.events
        .filter(ev => {
          if (!selectedDate) return true;
          const d = new Date(ev.date);
          return (
            d.getFullYear() === calendarYear &&
            d.getMonth() === calendarMonth &&
            d.getDate() === selectedDate
          );
        })
        .map(ev => (
          <div
            key={ev.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <h4 className="font-semibold text-gray-900 mb-1">{ev.title}</h4>
            <p className="text-sm text-gray-600 mb-1">
              {ev.date} at {ev.time}
            </p>
            {ev.description && (
              <p className="text-gray-700 mb-2">{ev.description}</p>
            )}
            <Button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
              Join Event
            </Button>
          </div>
        ))) || <p className="text-gray-600">No events on this date.</p>}
    </div>

    {/* Right: Fixed‑size Mini‑Calendar + Clear Button */}
    <div className="mt-6 lg:mt-0 w-full lg:w-80 flex flex-col">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-900">
            {new Date(calendarYear, calendarMonth).toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
          {['S','M','T','W','T','F','S'].map(w => (
            <div key={w} className="text-center">{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {(() => {
            const first = new Date(calendarYear, calendarMonth, 1);
            const offset = first.getDay();
            const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
            const marked = new Set(
              club!.events
                .map(e => new Date(e.date))
                .filter(d => d.getFullYear() === calendarYear && d.getMonth() === calendarMonth)
                .map(d => d.getDate())
            );
            const cells: (number|null)[] = [];
            for (let i = 0; i < offset; i++) cells.push(null);
            for (let d = 1; d <= daysInMonth; d++) cells.push(d);
            while (cells.length < 42) cells.push(null);

            return cells.map((day, i) => {
              const isToday =
                day === today.getDate() &&
                calendarMonth === today.getMonth() &&
                calendarYear === today.getFullYear();
              const hasEvent = day !== null && marked.has(day);
              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={`relative h-12 flex items-center justify-center cursor-pointer
                    ${isToday ? 'bg-orange-100 rounded-full' : ''}
                    ${day && selectedDate === day ? 'ring-2 ring-orange-300 rounded-full' : ''}
                    hover:bg-gray-50`}
                >
                  {day && <span className="text-sm text-gray-800">{day}</span>}
                  {hasEvent && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>

      <button
        onClick={() => setSelectedDate(null)}
        className="mt-4 bg-orange-500 w-full text-white py-2 rounded-lg hover:bg-orange-600"
      >
        Show All Events
      </button>
    </div>
  </div>
)}


      {/* Forum */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          {/* New Thread Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {threadError && <p className="text-sm text-red-600 mb-2">{threadError}</p>}
            <input
              type="text"
              placeholder="Thread title"
              className="w-full border border-gray-300 rounded-lg px-3 py-1 mb-2"
              value={newThreadTitle}
              onChange={e => setNewThreadTitle(e.target.value)}
            />
            <textarea
              placeholder="Thread content"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 resize-none"
              rows={3}
              value={newThreadContent}
              onChange={e => setNewThreadContent(e.target.value)}
            />
            <Button
              onClick={handleThreadSubmit}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Create Thread
            </Button>
          </div>

          {club.forum_threads.map(thread => (
            <div
              key={thread.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md cursor-pointer"
              onClick={() => setSelectedThread(thread)}
            >
              <h4 className="font-semibold text-gray-900 mb-2">{thread.title}</h4>
              <p className="text-xs text-gray-500">
                By {thread.author} • {thread.replies} replies
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* New Post / Poll Form */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {postError && <p className="text-sm text-red-600 mb-2">{postError}</p>}
            <textarea
              placeholder="What's on your mind?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
              rows={3}
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
            />

            {isPoll && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Poll question"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                />
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1"
                    value={opt}
                    onChange={e => handlePollOptionChange(idx, e.target.value)}
                  />
                ))}
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-blue-500 text-sm"
                >
                  + Add option
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mt-2">
              <label className="p-2 cursor-pointer hover:bg-gray-100 rounded-full">
                <PhotoIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePostPhotoChange}
                />
              </label>
              <button
                type="button"
                onClick={() => setIsPoll(prev => !prev)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <BarChart2 className="w-5 h-5 text-gray-500" />
              </button>
              <Button
                onClick={handlePostSubmit}
                className="ml-auto bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Post
              </Button>
            </div>
          </div>

          {club.posts.map(post => {
            const isBookmarked = bookmarkedPosts.includes(post.id);
            return (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{post.content}</p>

                {post.photo && (
                  <img
                    src={post.photo}
                    alt="attachment"
                    className="mb-2 rounded-lg max-h-60 object-cover w-full"
                  />
                )}

                {post.poll && (
                  <div className="mb-2">
                    <p className="font-medium">{post.poll.question}</p>
                    <ul className="list-disc list-inside">
                      {post.poll.options.map((o, i) => (
                        <li key={i} className="text-gray-700 text-sm">
                          {o.text} — {o.votes} votes
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-6 text-gray-500">
                  <button className="flex items-center gap-1 hover:text-orange-500">
                    <Heart className="w-4 h-4" /><span className="text-sm">{post.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-orange-500"
                    onClick={() => setSelectedPost(post)}
                  >
                    <MessageCircle className="w-4 h-4" /><span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-orange-500">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-orange-500"
                    onClick={() => toggleBookmark(post.id)}
                  >
                    <BookmarkIcon
                      className={`w-4 h-4 ${isBookmarked ? 'text-orange-500' : 'text-gray-500'}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

       {/* Members */}
 {activeTab === 'members' && (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex justify-end items-center gap-2">
        <button
          onClick={() => setMemberView('grid')}
          className={`p-2 rounded-lg ${memberView === 'grid' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMemberView('list')}
          className={`p-2 rounded-lg ${memberView === 'list' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Members */}
      {memberView === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {club.members_list.map(member => (
            <div
              key={member.id}
              onClick={() => navigate(`/users/${member.id}`)}
              className="cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl">{member.avatar}</div>
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {club.members_list.map(member => (
            <div
              key={member.id}
              onClick={() => navigate(`/users/${member.id}`)}
              className="cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl">{member.avatar}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                View Profile →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

    </div>
  );
}
