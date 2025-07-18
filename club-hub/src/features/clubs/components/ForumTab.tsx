import React, { useState, ChangeEvent } from 'react';
import { Club, Thread } from '../types';
import { MessageSquare } from 'lucide-react';
import Button from '../../../components/Button';

interface ForumTabProps {
  club: Club;
  setClub: React.Dispatch<React.SetStateAction<Club | null>>;
  onSelectThread: (thread: Thread) => void;
}

export default function ForumTab({ club, setClub, onSelectThread }: ForumTabProps) {
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [threadError, setThreadError] = useState<string|null>(null);

  const handleThreadSubmit = () => {
    setThreadError(null);
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      setThreadError('Please enter both a title and content for your thread.');
      return;
    }
    const newThread: Thread = {
      id: Date.now(),
      title: newThreadTitle.trim(),
      author: 'You',
      content: newThreadContent.trim(),
      replies: 0,
      lastActivity: 'Just now',
      posts: []
    };
    setClub(prev => prev && ({ ...prev, forum_threads: [newThread, ...prev.forum_threads] }));
    setNewThreadTitle('');
    setNewThreadContent('');
  };

  return (
    <div className="space-y-4">
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
