import React, { useState, useMemo, useEffect } from 'react';
import { Club, Event as ClubEvent, Participant, Role } from '../types';
import { ChevronLeft, ChevronRight, Users as UsersIcon } from 'lucide-react';
import Button from '../../../components/Button';
import { useProfile } from '../../profile/hooks/useProfile';
import { clubService } from '../services/ClubService';

interface EventsTabProps {
  club: Club;
  onClubUpdate: (c: Club) => void;
  userRole?: Role;
}

const STATUSES = [
  { value: 'Scheduled', label: 'Scheduled', bg: 'bg-orange-100', text: 'text-orange-600' },
  { value: 'Completed',  label: 'Completed',  bg: 'bg-gray-100',   text: 'text-gray-600'   },
  { value: 'Cancelled',  label: 'Cancelled',  bg: 'bg-red-100',    text: 'text-red-600'    },
] as const;
type Status = typeof STATUSES[number]['value'];

export default function EventsTab({ club, onClubUpdate, userRole }: EventsTabProps) {
  const { user } = useProfile();
  const today = new Date();
  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth());
  const [selectedDay, setDay] = useState<number|null>(null);

  // Form state
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number|null>(null);
  const [title, setTitle]         = useState('');
  const [date, setDate]           = useState('');
  const [time, setTime]           = useState('');
  const [location, setLocation]   = useState('');
  const [desc, setDesc]           = useState('');
  const [status, setStatus]       = useState<Status>('Scheduled');
  const [error, setError]         = useState<string|null>(null);

  // reset editingId when form closes
  useEffect(() => {
    if (!showForm) setEditingId(null);
  }, [showForm]);

  const prev = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    setMonth(m); setYear(y); setDay(null);
  };
  const next = () => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    setMonth(m); setYear(y); setDay(null);
  };

  const openForm = (ev?: ClubEvent) => {
    if (ev) {
      setEditingId(ev.id);
      setTitle(ev.title);
      setDate(ev.date);
      setTime(ev.time);
      setLocation(ev.location || '');
      setDesc(ev.description || '');
      setStatus(ev.status || 'Scheduled');
    } else {
      setEditingId(null);
      setTitle(''); setDate(''); setTime('');
      setLocation(''); setDesc('');
      setStatus('Scheduled');
    }
    setError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setError(null);
    if (!title.trim() || !date || !time) {
      setError('Title, date & time are required.');
      return;
    }

    try {
      let updated: ClubEvent[];
      if (editingId != null) {
        const dto = await clubService.updateEvent(club.id, editingId, {
          title,
          date,
          time,
          description: desc,
          status,
          location,
        });
        updated = club.events.map(ev => (ev.id === editingId ? dto : ev));
      } else {
        const dto = await clubService.createEvent(club.id, {
          title,
          date,
          time,
          description: desc,
          status,
          location,
        });
        updated = [dto, ...club.events];
      }
      onClubUpdate({ ...club, events: updated });
      setShowForm(false);
    } catch (err) {
      setError('Failed to save event');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await clubService.deleteEvent(club.id, id);
      const updated = club.events.filter(e => e.id !== id);
      onClubUpdate({ ...club, events: updated });
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinToggle = async (ev: ClubEvent) => {
    if (!user) return;
    const updated = club.events.map(e => {
      if (e.id !== ev.id) return e;
      const parts = e.participants ? [...e.participants] : [];
      const exists = parts.find(p => p.email === user.email);
      if (exists) {
        const filtered = parts.filter(p => p.email !== user.email);
        return { ...e, participants: filtered };
      } else {
        const next: Participant = {
          id: user.id,
          name: user.name,
          surname: (user as any).surname || '',
          email: user.email,
        };
        return { ...e, participants: [...parts, next] };
      }
    });
    onClubUpdate({ ...club, events: updated });
    const exists = ev.participants?.find(p => p.email === user.email);
    if (!exists) {
      try { await clubService.joinEvent(club.id, ev.id); } catch {}
    }
  };

  const downloadCSV = (ev: ClubEvent) => {
    const parts = ev.participants || [];
    let csv = 'Name,Surname,Email\n';
    parts.forEach(p => {
      csv += `${p.name},${p.surname},${p.email}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.title}_participants.csv`;
    a.click();
  };

  const filtered = useMemo(() => {
    return club.events.filter(ev => {
      if (selectedDay == null) return true;
      const d = new Date(ev.date);
      return (
        d.getFullYear() === year &&
        d.getMonth()    === month &&
        d.getDate()     === selectedDay
      );
    });
  }, [club.events, year, month, selectedDay]);

  // build calendar cells
  const first     = new Date(year, month, 1);
  const offset    = first.getDay();
  const daysInMon = new Date(year, month + 1, 0).getDate();
  const marked    = new Set(
    club.events
      .map(e => new Date(e.date))
      .filter(d => d.getFullYear() === year && d.getMonth() === month)
      .map(d => d.getDate())
  );
  const cells: (number|null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMon; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      {/* ── Event List ── */}
      <div className="flex-1 space-y-4 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          {(userRole === 'ADMIN' || userRole === 'MODERATOR' || user?.role === 'ADMIN') && (
            <Button
              onClick={() => (showForm ? setShowForm(false) : openForm())}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              {showForm ? 'Cancel' : 'Create Event'}
            </Button>
          )}
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-3">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
              rows={3}
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={status}
                onChange={e => setStatus(e.target.value as Status)}
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600">
                {editingId != null ? 'Save' : 'Add'}
              </Button>
            </div>
          </div>
        )}

        {/* Event Cards */}
        {filtered.length > 0 ? (
          filtered.map(ev => {
            const st = STATUSES.find(s => s.value === ev.status) ?? STATUSES[0];
            const isJoined = user
              ? !!ev.participants?.find(p => p.email === user.email)
              : false;

            return (
              <div key={ev.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{ev.title}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium ${st.bg} ${st.text} rounded-full`}>
                      {st.label}
                    </span>
                  </div>
                  {(userRole === 'ADMIN' || userRole === 'MODERATOR' || user?.role === 'ADMIN') && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openForm(ev)}
                        className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(ev.id)}
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {ev.date} at {ev.time} · {ev.location}
                </p>
                {ev.description && <p className="text-gray-700 mb-2">{ev.description}</p>}
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <UsersIcon className="w-4 h-4" />
                  <span>{ev.participants?.length ?? 0} joined</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleJoinToggle(ev)}
                    disabled={isJoined}
                    className={`flex-1 py-2 rounded-lg text-center ${
                      isJoined
                        ? 'bg-gray-300 text-gray-700 cursor-default'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {isJoined ? 'Joined' : 'Join Event'}
                  </Button>
                  {ev.participants && ev.participants.length > 0 && (
                    <Button
                      onClick={() => downloadCSV(ev)}
                      className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600"
                    >
                      Download CSV
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No events on this date.</p>
        )}
      </div>

      {/* ── Mini‑Calendar ── */}
      <div className="mt-6 lg:mt-0 w-full lg:w-80 flex-none">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-h-[400px] overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prev} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">
              {new Date(year, month).toLocaleString('default', {
                month: 'long',
                year:  'numeric'
              })}
            </span>
            <button onClick={next} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
            {['S','M','T','W','T','F','S'].map(w => (
              <div key={w} className="text-center">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {cells.map((day, i) => {
              if (day == null) return <div key={i} className="h-10" />;
              const isToday    = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const hasEvent   = marked.has(day);
              const isSelected = day === selectedDay;
              return (
                <div
                  key={i}
                  onClick={() => setDay(day)}
                  className={`
                    relative h-10 w-10 flex items-center justify-center
                    cursor-pointer rounded-full
                    ${isToday    ? 'bg-orange-100'          : ''}
                    ${isSelected ? 'ring-2 ring-orange-300' : ''}
                    hover:bg-gray-100
                  `}
                >
                  <span className="text-sm text-gray-800">{day}</span>
                  {hasEvent && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => setDay(null)}
          className="mt-4 bg-orange-500 w-full text-white py-2 rounded-lg hover:bg-orange-600"
        >
          Show All Events
        </button>
      </div>
    </div>
  );
}
