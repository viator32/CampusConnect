import React, { useState, ChangeEvent, useEffect } from 'react';
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
import Avatar from '../../../components/Avatar';
import { bookmarksService } from '../../bookmarks/services/BookmarksService';
import { clubService } from '../services/ClubService';
import { formatDateTime } from '../../../utils/date';
import ProcessingBox from '../../../components/ProcessingBox';

/** Props for the club Posts tab. */
interface PostsTabProps {
  club: Club;
  onClubUpdate: (c: Club) => void;
  onSelectPost: (p: Post) => void;
}

/**
 * Posts tab for composing posts, listing them, and quick actions
 * such as like, comment, share, and bookmark.
 */
export default function PostsTab({ club, onClubUpdate, onSelectPost }: PostsTabProps) {
  const [text, setText]   = useState('');
  const [photo, setPhoto] = useState<File|null>(null);
  const [isPoll, setIsPoll] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions]   = useState<string[]>(['','']);
  const [error, setError]       = useState<string|null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLikedPosts(club.posts.filter((p: any) => p.liked).map(p => p.id));
  }, [club.posts]);

  useEffect(() => {
    bookmarksService
      .getAll()
      .then(list => setBookmarks(list.map(b => b.id)))
      .catch(() => {});
  }, []);

  const toggleBookmark = async (post: Post) => {
    if (bookmarks.includes(post.id)) {
      await bookmarksService.remove(post.id);
      setBookmarks(b => b.filter(x => x !== post.id));
    } else {
      await bookmarksService.add(post.id);
      setBookmarks(b => [...b, post.id]);
    }
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPhoto(e.target.files[0]);
  };

  const addPollOption = () => setOptions(o => [...o, '']);
  const changeOpt = (i: number, v: string) =>
    setOptions(o => o.map((x,idx) => idx===i? v:x));

  const handlePost = async () => {
    setError(null);
    if (!text.trim()) {
      setError('Add some text to your post.');
      return;
    }

    try {
      setPosting(true);
      const created = await clubService.createPost(club.id, text);
      onClubUpdate({ ...club, posts: [created, ...club.posts] });
      setText('');
      setPhoto(null);
      setIsPoll(false);
      setQuestion('');
      setOptions(['', '']);
      onSelectPost(created);
    } catch {
      setError('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (post: Post) => {
    const isLiked = likedPosts.includes(post.id);
    onClubUpdate({
      ...club,
      posts: club.posts.map(p =>
        p.id === post.id
          ? { ...p, liked: !isLiked, likes: p.likes + (isLiked ? -1 : 1) }
          : p
      ),
    });
    setLikedPosts(prev =>
      isLiked ? prev.filter(id => id !== post.id) : [...prev, post.id]
    );
    try {
      if (isLiked) await clubService.unlikePost(post.id);
      else await clubService.likePost(post.id);
    } catch {
      onClubUpdate({
        ...club,
        posts: club.posts.map(p =>
          p.id === post.id
            ? { ...p, liked: isLiked, likes: p.likes + (isLiked ? 1 : -1) }
            : p
        ),
      });
      setLikedPosts(prev =>
        isLiked ? [...prev, post.id] : prev.filter(id => id !== post.id)
      );
    }
  };

  return (
    <>
      {posting && <ProcessingBox message="Creating post..." />}
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
              <Avatar avatar={post.avatar} size={32} />
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-500">{formatDateTime(post.time)}</p>
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
              <button
                className="flex items-center gap-1 hover:text-orange-500"
                onClick={() => handleLike(post)}
              >
                <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'text-orange-500' : ''}`} />
                <span className="text-sm">{post.likes}</span>
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
  </>
  );
}
