import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid as GridIcon, List as ListIcon } from 'lucide-react';
import { useClubs } from '../hooks/useClubs';
import ClubGrid from '../components/ClubGrid';
import ClubList from '../components/ClubList';
import Input from '../../../components/Input';

const categories = ['All', 'Academic', 'Creative', 'Sports', 'Cultural', 'Technical'];

export default function ExplorePage() {
  const { clubs } = useClubs();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Explore</h1>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10 pr-4 py-2 w-full"
            placeholder="Search clubs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <GridIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
      {viewMode === 'grid' ? (
        <ClubGrid clubs={filtered} onSelect={c => navigate(`/clubs/${c.id}`)} />
      ) : (
        <ClubList clubs={filtered} onSelect={c => navigate(`/clubs/${c.id}`)} />
      )}
    </div>
  );
}
