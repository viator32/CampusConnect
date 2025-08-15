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
import SharePopup from '../../../components/SharePopup';
import { bookmarksService } from '../../bookmarks/services/BookmarksService';

interface PostsTabProps {
  club: Club;
  onClubUpdate: (c: Club) => void;
  onSelectPost: (p: Post) => void;
}

export default function PostsTab({ club, onClubUpdate, onSelectPost }: PostsTabProps) {
  const [text, setText]   = useState('');
  const [photo, setPhoto] = useState<File|null>(null);
  const [isPoll, setIsPoll] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions]   = useState<string[]>(['','']);
  const [error, setError]       = useState<string|null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [sharePostId, setSharePostId] = useState<number | null>(null);

  const toggleBookmark = async (post: Post) => {
    if (bookmarks.includes(post.id)) {
      await bookmarksService.remove(post.id);
      setBookmarks(b => b.filter(x => x !== post.id));
    } else {
      await bookmarksService.add({
        id: post.id,
        author: post.author,
        content: post.content,
        time: post.time,
        likes: post.likes,
        comments: post.comments,
        clubId: Number(club.id),
        clubName: club.name,
        clubImage: club.image
      });
      setBookmarks(b => [...b, post.id]);
    }
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPhoto(e.target.files[0]);
  };

  const addPollOption = () => setOptions(o => [...o, '']);
  const changeOpt = (i: number, v: string) =>
    setOptions(o => o.map((x,idx) => idx===i? v:x));

  const handlePost = () => {
    setError(null);
    if (!text.trim() && !photo && !isPoll) {
      setError('Add text, photo or poll.');
      return;
    }
    if (isPoll) {
      if (!question.trim() || options.filter(o=>o.trim()).length<2) {
        setError('Poll needs question + 2 options.');
        return;
      }
    }
    const newPost: Post = {
      id: Date.now(),
      author: 'You',
      content: text,
      likes: 0,
      comments: 0,
      time: 'Just now',
      commentsList: [],
      photo: photo ? URL.createObjectURL(photo) : undefined,
      poll: isPoll
        ? {
            question,
            options: options.filter(o=>o.trim()).map(o => ({ text: o, votes: 0 }))
          }
        : undefined
    } as any;
    onClubUpdate({ ...club, posts: [ newPost, ...club.posts ] });
    setText(''); setPhoto(null); setIsPoll(false); setQuestion(''); setOptions(['','']);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <textarea
          placeholder="What's on your mind?"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
        />

        {isPoll && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="Poll question"
              className="w-full border border-gray-300 rounded-lg px-3 py-1"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
            {options.map((opt,i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i+1}`}
                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                value={opt}
                onChange={e => changeOpt(i, e.target.value)}
              />
            ))}
            <button
              type="button"
              onClick={addPollOption}
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
              onChange={handlePhoto}
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
            onClick={handlePost}
            className="ml-auto bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Post
          </Button>
        </div>
      </div>

      {club.posts.map(post => {
        const isBookmarked = bookmarks.includes(post.id);
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
                  {post.poll.options.map((o,i)=>(
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
                onClick={() => onSelectPost(post)}
              >
                <MessageCircle className="w-4 h-4" /><span className="text-sm">{post.comments}</span>
              </button>
              <div className="relative">
                <button
                  className="flex items-center gap-1 hover:text-orange-500"
                  onClick={() =>
                    setSharePostId(prev => (prev === post.id ? null : post.id))
                  }
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {sharePostId === post.id && (
                  <SharePopup
                    url={`${window.location.origin}/clubs/${club.id}/posts/${post.id}`}
                    onClose={() => setSharePostId(null)}
                  />
                )}
              </div>
              <button
                className="flex items-center gap-1 hover:text-orange-500"
                onClick={() => toggleBookmark(post)}
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
  );
}
