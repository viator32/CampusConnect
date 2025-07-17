// src/features/clubs/pages/CreateClubPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../hooks/useClubs';
import { Plus } from 'lucide-react';
import Button from '../../../components/Button';
import type { Club } from '../types';

const categories = ['Academic', 'Creative', 'Sports', 'Cultural', 'Technical'];

export default function CreateClubPage() {
  const { addClub } = useClubs();
  const navigate = useNavigate();

  const [form, setForm] = useState<Pick<Club, 'name' | 'description' | 'category' | 'image'>>({
    name: '',
    description: '',
    category: categories[0],
    image: '🏷️'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClub: Club = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      category: form.category,
      image: form.image,
      members: 1,
      isJoined: true,
      events: [],
      posts: [],
      members_list: [],
      forum_threads: []
    };
    addClub(newClub);
    navigate('/my-clubs');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" /> Create Club
      </h1>
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
        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => navigate('/my-clubs')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
