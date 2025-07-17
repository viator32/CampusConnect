// src/features/clubs/pages/ClubDetailPage.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Bookmark as BookmarkIcon
} from 'lucide-react';
import Button from '../../../components/Button';

export default function ClubDetailPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState<'about'|'events'|'forum'|'posts'|'members'>('about');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // new feature state
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostPhoto, setNewPostPhoto] = useState<File | null>(null);
  const [isPoll, setIsPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  useEffect(() => {
    if (clubId) {
      ClubService.getById(Number(clubId)).then(c => setClub(c || null));
    }
  }, [clubId]);

  if (!club) return <div>Loading...</div>;

  // Handlers
  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(ids =>
      ids.includes(postId)
        ? ids.filter(id => id !== postId)
        : [...ids, postId]
    );
  };

  const handlePostPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setNewPostPhoto(e.target.files[0]);
  };

  const handleAddPollOption = () => {
    setPollOptions(opts => [...opts, '']);
  };

  const handlePollOptionChange = (idx: number, value: string) => {
    setPollOptions(opts => opts.map((o,i) => i===idx ? value : o));
  };

  const handlePostSubmit = () => {
    if (!newPostText.trim() && !newPostPhoto && !isPoll) return;
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
            options: pollOptions.filter(o => o.trim()).map(o => ({ text: o, votes: 0 }))
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
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
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
                onClick={() => { setActiveTab(tab.id as any); setSelectedThread(null); setSelectedPost(null); }}
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
        <div className="space-y-4">
          {club.events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {event.date} at {event.time}
              </p>
              <Button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                Join Event
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Forum */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          {/* New Thread Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
            <Button onClick={handleThreadSubmit} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Create Thread
            </Button>
          </div>

          {club.forum_threads.map(thread => (
            <div
              key={thread.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
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

      {/* Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* New Post / Poll Form */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
                  <img src={post.photo} alt="attachment" className="mb-2 rounded-lg max-h-60 object-cover w-full" />
                )}

                {post.poll && (
                  <div className="mb-2">
                    <p className="font-medium">{post.poll.question}</p>
                    <ul className="list-disc list-inside">
                      {post.poll.options.map((o, i) => (
                        <li key={i} className="text-gray-700 text-sm">{o.text} — {o.votes} votes</li>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {club.members_list.map(member => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3"
            >
              <div className="text-2xl">{member.avatar}</div>
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
