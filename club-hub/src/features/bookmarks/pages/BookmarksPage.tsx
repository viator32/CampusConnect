import React from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  // TODO: replace with real bookmarked‑posts data
  const bookmarks: Array<{
    id: number;
    author: string;
    content: string;
    time: string;
    likes: number;
    comments: number;
  }> = [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map(post => (
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
              <p className="text-gray-700 mb-3">{post.content}</p>
              <div className="flex items-center gap-6 text-gray-500">
                <button className="flex items-center gap-1 hover:text-orange-500">
                  ❤️<span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-orange-500">
                  💬<span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-orange-500">
                  🔗
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600">Bookmark posts to find them here later</p>
        </div>
      )}
    </div>
  );
}
