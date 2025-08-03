// src/features/clubs/pages/ExplorePage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid as GridIcon,
  List as ListIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useClubs } from '../hooks/useClubs';
import ClubGrid from '../components/ClubGrid';
import ClubList from '../components/ClubList';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const categories = ['All', 'Academic', 'Creative', 'Sports', 'Cultural', 'Technical'];
const joinedStatuses = ['All', 'Joined', 'Not Joined'] as const;
type JoinedStatus = typeof joinedStatuses[number];
type SortKey = 'members_desc' | 'members_asc' | 'name_asc' | 'name_desc';

export default function ExplorePage() {
  const { clubs } = useClubs();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJoinedStatus, setSelectedJoinedStatus] = useState<JoinedStatus>('All');
  const [sortKey, setSortKey] = useState<SortKey>('members_desc');

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedJoinedStatus('All');
    setSortKey('members_desc');
  };

  const filtered = useMemo(() => {
    let arr = clubs.filter(c => {
      const q = search.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesJoined =
        selectedJoinedStatus === 'All' ||
        (selectedJoinedStatus === 'Joined' && c.isJoined) ||
        (selectedJoinedStatus === 'Not Joined' && !c.isJoined);
      return matchesSearch && matchesCategory && matchesJoined;
    });

    switch (sortKey) {
      case 'members_desc':
        arr = [...arr].sort((a, b) => b.members - a.members);
        break;
      case 'members_asc':
        arr = [...arr].sort((a, b) => a.members - b.members);
        break;
      case 'name_asc':
        arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        arr = [...arr].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return arr;
  }, [clubs, search, selectedCategory, selectedJoinedStatus, sortKey]);

  return (
    <div className="space-y-6">
      {/* Header + controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold mb-2">Explore</h1>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                className="pl-10 pr-4 py-2 w-full"
                placeholder="Search clubs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:shadow-sm"
                  onClick={() => setShowFilters(f => !f)}
                  aria-label="Toggle filters"
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 w-screen max-w-[760px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Category */}
                      <div className="flex-1 min-w-[140px]">
                        <div className="mb-1">
                          <h3 className="font-medium text-sm">Category</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                                selectedCategory === cat
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-orange-200'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Membership */}
                      <div className="flex-1 min-w-[140px]">
                        <div className="mb-1">
                          <h3 className="font-medium text-sm">Membership</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {joinedStatuses.map(s => (
                            <button
                              key={s}
                              onClick={() => setSelectedJoinedStatus(s)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                                selectedJoinedStatus === s
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-orange-200'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort */}
                      <div className="flex-1 min-w-[140px]">
                        <div className="mb-1">
                          <h3 className="font-medium text-sm">Sort By</h3>
                        </div>
                        <select
                          value={sortKey}
                          onChange={e => setSortKey(e.target.value as SortKey)}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="members_desc">Members (high → low)</option>
                          <option value="members_asc">Members (low → high)</option>
                          <option value="name_asc">Name (A → Z)</option>
                          <option value="name_desc">Name (Z → A)</option>
                        </select>
                      </div>
                    </div>

                    {/* Clear All on its own line */}
                    <div className="mt-4">
                      <Button
                        onClick={resetFilters}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Grid view"
                >
                  <GridIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="List view"
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clubs listing */}
      <div>
        {viewMode === 'grid' ? (
          <ClubGrid clubs={filtered} onSelect={c => navigate(`/clubs/${c.id}`)} />
        ) : (
          <ClubList clubs={filtered} onSelect={c => navigate(`/clubs/${c.id}`)} />
        )}
      </div>
    </div>
  );
}
