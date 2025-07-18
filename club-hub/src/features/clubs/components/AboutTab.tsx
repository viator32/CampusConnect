import React from 'react';
import { Club } from '../types';
import { Users, Calendar } from 'lucide-react';

interface AboutTabProps {
  club: Club;
}

export default function AboutTab({ club }: AboutTabProps) {
  return (
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
          Welcome to the {club.name}! We’re a community of students passionate about{' '}
          {club.category.toLowerCase()} activities.
        </p>
      </div>
    </div>
  );
}
