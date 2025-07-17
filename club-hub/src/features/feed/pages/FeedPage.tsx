import React from 'react';
import { useClubs } from '../../clubs/hooks/useClubs';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import Button from '../../../components/Button';

export default function FeedPage() {
  const { clubs } = useClubs();
  const posts = clubs.flatMap(club =>
    club.posts.map(post => ({ ...post, clubName: club.name, clubImage: club.image }))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Feed</h1>
      <div className="space-y-4">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-lg">{post.clubImage}</div>
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">
                  {post.clubName} • {post.time}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            <div className="flex items-center gap-6 text-gray-500">
              <Button className="flex items-center gap-1 bg-transparent text-gray-500 hover:text-orange-500">
                <Heart className="w-4 h-4" /> {post.likes}
              </Button>
              <Button className="flex items-center gap-1 bg-transparent text-gray-500 hover:text-orange-500">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </Button>
              <Button className="flex items-center gap-1 bg-transparent text-gray-500 hover:text-orange-500">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
