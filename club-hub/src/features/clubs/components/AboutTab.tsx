// src/features/clubs/components/AboutTab.tsx
import React, { useState } from 'react';
import { Club, Project } from '../types';
import {
  Users,
  Calendar,
  Info as InfoIcon,
  Edit as EditIcon
} from 'lucide-react';
import Button from '../../../components/Button';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface AboutTabProps {
  club: Club;
  onUpdate: (updated: Club) => void;
}

export default function AboutTab({ club, onUpdate }: AboutTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // initialize form with existing club data
  const [form, setForm] = useState({
    name:        club.name,
    description: club.description,
    category:    club.category,
    image:       club.image,
    founded:     club.founded || '',
    location:    club.location || '',
    tags:        (club.tags || []).join(', '),
    projects:    club.projects || [] as Project[]
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onEmojiClick = (data: EmojiClickData) => {
    setForm(f => ({ ...f, image: data.emoji }));
    setShowEmojiPicker(false);
  };

  const addProject = () => {
    setForm(f => ({
      ...f,
      projects: [
        ...f.projects,
        { id: Date.now(), title: '', description: '', link: '' }
      ]
    }));
  };
  const updateProject = (idx: number, field: keyof Project, value: string) => {
    setForm(f => {
      const ps = f.projects.map((p,i) =>
        i === idx ? { ...p, [field]: value } : p
      );
      return { ...f, projects: ps };
    });
  };
  const removeProject = (idx: number) => {
    setForm(f => ({
      ...f,
      projects: f.projects.filter((_,i) => i !== idx)
    }));
  };

  const save = () => {
    const updated: Club = {
      ...club,
      name:        form.name,
      description: form.description,
      category:    form.category,
      image:       form.image,
      founded:     form.founded || undefined,
      location:    form.location || undefined,
      tags:        form.tags.split(',').map(s=>s.trim()).filter(Boolean),
      projects:    form.projects.filter(p=>p.title.trim())
    };
    onUpdate(updated);
    setIsEditing(false);
  };

  // safe arrays
  const tags     = club.tags     ?? [];
  const projects = club.projects ?? [];

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Emoji Icon */}
            <div className="relative">
              <div
                className="text-4xl cursor-pointer"
                onClick={() => isEditing && setShowEmojiPicker(v=>!v)}
              >
                {form.image}
              </div>
              {showEmojiPicker && isEditing && (
                <div className="absolute z-30 mt-2">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      theme={Theme.AUTO}
                      height={400}
                      width="100%"
                    />
                  
                </div>
              )}
            </div>

            {/* Club Name */}
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

          {/* Edit / Save */}
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={save}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              >
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <EditIcon className="w-4 h-4" /> Edit
            </Button>
          )}
        </div>

        {/* Category */}
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
          <p className="text-gray-600 mb-4">{club.category}</p>
        )}

        {/* Founded & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {['founded','location'].map(field => (
            <div key={field}>
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <InfoIcon className="w-4 h-4" /> {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {isEditing ? (
                <input
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1"
                  placeholder={field==='founded'?'e.g. 2005':'e.g. Main Campus'}
                />
              ) : (
                <p className="text-gray-700">
                  {(club as any)[field] ?? (
                    <span className="text-gray-400 italic">Not specified</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-gray-700">
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

      {/* ── Details ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">About This Club</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
              placeholder="Short description…"
            />
          ) : (
            <p className="text-gray-700">
              {club.description || (
                <span className="italic text-gray-400">No description yet.</span>
              )}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Tags</h3>
          {isEditing ? (
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-1"
              placeholder="Comma‑separated tags"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map(t => (
                  <span
                    key={t}
                    className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-sm"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="italic text-gray-400">No tags yet.</span>
              )}
            </div>
          )}
        </div>

        {/* Projects */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-gray-900">Projects</h3>
            {isEditing && (
              <Button
                onClick={addProject}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
              >
                + Add Project
              </Button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              {form.projects.map((p, i) => (
                <div key={p.id} className="space-y-1 border border-gray-200 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <input
                      placeholder="Title"
                      value={p.title}
                      onChange={e => updateProject(i, 'title', e.target.value)}
                      className="w-2/3 border-b border-gray-300 focus:outline-none"
                    />
                    <Button
                      onClick={() => removeProject(i)}
                      className="px-2 py-1 text-sm text-red-600"
                    >
                      ✕
                    </Button>
                  </div>
                  <input
                    placeholder="Link (optional)"
                    value={p.link || ''}
                    onChange={e => updateProject(i, 'link', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    rows={2}
                    value={p.description || ''}
                    onChange={e => updateProject(i, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 resize-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {projects.length > 0 ? (
                projects.map(p => (
                  <li key={p.id}>
                    {p.link ? (
                      <a href={p.link} className="text-orange-600 hover:underline">
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                    {p.description && ` — ${p.description}`}
                  </li>
                ))
              ) : (
                <li className="italic text-gray-400">No projects yet.</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
