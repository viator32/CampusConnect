import React, { useState, ChangeEvent } from 'react';
import { Club, Post } from '../types';
import {
  MessageCircle,
  Heart,
  Share2,
  Image as PhotoIcon,
  BarChart2,
  Bookmark as BookmarkIcon
} from 'lucide-react';
import Button from '../../../components/Button';

interface PostsTabProps {
  club: Club;
  setClub: React.Dispatch<React.SetStateAction<Club | null>>;
  onSelectPost: (post: Post) => void;
}

export default function PostsTab({ club, setClub, onSelectPost }: PostsTabProps) {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostPhoto, setNewPostPhoto] = useState<File | null>(null);
  const [isPoll, setIsPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [postError, setPostError] = useState<string|null>(null);

  const handlePostPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setNewPostPhoto(e.target.files[0]);
  };
  const handleAddPollOption = () => setPollOptions(o => [...o, '']);
  const handlePollOptionChange = (i: number, v: string) =>
    setPollOptions(o => o.map((x, idx) => (idx === i ? v : x)));

  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(ids =>
      ids.includes(postId) ? ids.filter(id => id !== postId) : [...ids, postId]
    );
  };

  const handlePostSubmit = () => {
    setPostError(null);
    if (!newPostText.trim() && !newPostPhoto && !isPoll) {
      setPostError('Please add text, photo, or poll.');
      return;
    }
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
      content: newPostText.trim(),
      likes: 0,
      comments: 0,
      time: 'Just now',
      commentsList: [],
      photo: newPostPhoto ? URL.createObjectURL(newPostPhoto) : undefined,
      poll: isPoll
        ? {
            question: pollQuestion.trim(),
            options: pollOptions
              .filter(o => o.trim())
              .map(o => ({ text: o.trim(), votes: 0 }))
          }
        : undefined
    };
    setClub(prev => prev && ({ ...prev, posts: [newPost, ...prev.posts] }));
    setNewPostText('');
    setNewPostPhoto(null);
    setIsPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  return (
    <div className="space-y-4">
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
            {pollOptions.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                value={opt}
                onChange={e => handlePollOptionChange(i, e.target.value)}
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
            onClick={() => setIsPoll(p => !p)}
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
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
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
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button
                className="flex items-center gap-1 hover:text-orange-500"
                onClick={() => onSelectPost(post)}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-orange-500">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="flex items-center gap-1 hover:text-orange-500"
                onClick={() => toggleBookmark(post.id)}
              >
                <BookmarkIcon
                  className={`w-4 h-4 ${
                    isBookmarked ? 'text-orange-500' : 'text-gray-500'
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
