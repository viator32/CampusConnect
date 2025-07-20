import React, { useState } from 'react';
import { Club } from '../types';
import { Users, Calendar } from 'lucide-react';
import Button from '../../../components/Button';

interface AboutTabProps {
  club: Club;
  onUpdate: (updated: Club) => void;
}

export default function AboutTab({ club, onUpdate }: AboutTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: club.name,
    description: club.description,
    category: club.category,
    image: club.image
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const save = () => {
    onUpdate({ ...club, ...form });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {isEditing ? (
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="text-4xl w-12 text-center"
              />
            ) : (
              <div className="text-4xl">{club.image}</div>
            )}
            {isEditing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="text-2xl font-bold border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{club.name}</h2>
            )}
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={save}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              >
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>

        {isEditing ? (
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-1 mb-4"
          >
            {['Academic','Creative','Sports','Cultural','Technical'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        ) : (
          <p className="text-gray-600">{club.category}</p>
        )}

        {isEditing ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-4 resize-none"
          />
        ) : (
          <p className="text-gray-700 mt-4">{club.description}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <span>{club.members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span>{club.events.length} upcoming events</span>
          </div>
        </div>
      </div>

      {/* About text */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">About This Club</h3>
        {isEditing ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
          />
        ) : (
          <p className="text-gray-700">
            Welcome to the {club.name}! We’re a community passionate about {club.category.toLowerCase()} activities.
          </p>
        )}
      </div>
    </div>
);
}
