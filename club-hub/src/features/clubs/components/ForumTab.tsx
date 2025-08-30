import React, { useState } from 'react';
import { Club, Thread } from '../types';
import Button from '../../../components/Button';

/** Props for the club Forum tab. */
interface ForumTabProps {
  club: Club;
  onClubUpdate: (c: Club) => void;
  onSelectThread: (t: Thread) => void;
}

/**
 * Forum tab for creating and browsing discussion threads inside a club.
 */
export default function ForumTab({ club, onClubUpdate, onSelectThread }: ForumTabProps) {
  const [title, setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [error, setError]   = useState<string|null>(null);

  const handleCreate = () => {
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }
    const newThread: Thread = {
      id: Date.now(),
      title,
      author: 'You',
      replies: 0,
      lastActivity: 'Just now',
      content,
      posts: []
    };
    onClubUpdate({ ...club, forum_threads: [ newThread, ...club.forum_threads ] });
    setTitle(''); setContent('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Thread title"
          className="w-full border border-gray-300 rounded-lg px-3 py-1 mb-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Thread content"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 resize-none"
          rows={3}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Button
          onClick={handleCreate}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Create Thread
        </Button>
      </div>

      {club.forum_threads.map(thread => (
        <div
          key={thread.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md cursor-pointer"
          onClick={() => onSelectThread(thread)}
        >
          <h4 className="font-semibold text-gray-900 mb-2">{thread.title}</h4>
          <p className="text-xs text-gray-500">
            By {thread.author} • {thread.replies} replies
          </p>
        </div>
      ))}
    </div>
  );
}
