import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../hooks/useClubs';
import { Plus, Users, X } from 'lucide-react';
import Button from '../../../components/Button';
import type { Club } from '../types';

const categories = ['Academic', 'Creative', 'Sports', 'Cultural', 'Technical'];

export default function MyClubsPage() {
  const navigate = useNavigate();
  const { clubs, addClub } = useClubs();
  const joinedClubs = clubs.filter(c => c.isJoined);

  // modal state + form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Pick<Club, 'name'|'description'|'category'|'image'>>({
    name: '',
    description: '',
    category: categories[0],
    image: '🏷️'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClub: Club = {
      id: Date.now(),
      ...form,
      members: 1,
      isJoined: true,
      events: [],
      posts: [],
      members_list: [],
      forum_threads: []
    };
    addClub(newClub);
    setShowModal(false);
    // reset form if you like
    setForm({ name: '', description: '', category: categories[0], image: '🏷️' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Clubs</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" />
          Create Club
        </Button>
      </div>

      {/* Joined Clubs List */}
      {joinedClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {joinedClubs.map(club => (
            <div
              key={club.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/clubs/${club.id}`)}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{club.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{club.name}</h3>
                    <p className="text-sm text-gray-600">{club.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{club.members}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{club.description}</p>
                <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-600">
                  Joined
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          You haven’t joined any clubs yet.
        </div>
      )}

      {/* Create Club Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-600" /> New Club
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Icon (emoji)</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="w-16 border px-3 py-2 rounded text-center"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
