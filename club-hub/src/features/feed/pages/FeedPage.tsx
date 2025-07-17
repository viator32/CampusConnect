import React from 'react';
import { useClubs } from '../../clubs/hooks/useClubs';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export default function FeedPage() {
  const { clubs } = useClubs();
  const posts = clubs.flatMap(club =>
    club.posts.map(post => ({
      ...post,
      clubName: club.name,
      clubImage: club.image,
      clubId: club.id
    }))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <div
              key={`${post.clubId}-${post.id ?? idx}`}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-lg">{post.clubImage}</div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">
                    {post.clubName} • {post.time}
                  </p>
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
          ))}
        </div>
      </div>
    </div>
  );
}
