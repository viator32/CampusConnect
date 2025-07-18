import React, { useState } from 'react';
import { Club, Event as ClubEvent } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/Button';

interface EventsTabProps {
  club: Club;
  onClubUpdate: (c: Club) => void;
}

export default function EventsTab({ club, onClubUpdate }: EventsTabProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number|null>(null);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle]   = useState('');
  const [date, setDate]     = useState('');
  const [time, setTime]     = useState('');
  const [desc, setDesc]     = useState('');
  const [error, setError]   = useState<string|null>(null);

  const prev = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year  - 1 : year;
    setMonth(m); setYear(y); setSelectedDay(null);
  };
  const next = () => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    setMonth(m); setYear(y); setSelectedDay(null);
  };

  const handleAdd = () => {
    setError(null);
    if (!title.trim() || !date || !time) {
      setError('Title, date & time are required.');
      return;
    }
    const newEv: ClubEvent = {
      id: Date.now(),
      title,
      date,
      time,
      description: desc
    } as ClubEvent; // cast to ensure description property
    onClubUpdate({ ...club, events: [ newEv, ...club.events ] });
    setShowForm(false);
    setTitle(''); setDate(''); setTime(''); setDesc('');
  };

  // filter
  const filtered = club.events.filter(ev => {
    if (selectedDay == null) return true;
    const d = new Date(ev.date);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === selectedDay
    );
  });

  // calendar cells
  const first = new Date(year, month, 1);
  const offset = first.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const marked = new Set(
    club.events
      .map(e => new Date(e.date))
      .filter(d => d.getFullYear()===year && d.getMonth()===month)
      .map(d => d.getDate())
  );
  const cells: (number|null)[] = [];
  for (let i=0;i<offset;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);
  while(cells.length<42) cells.push(null);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      {/* Left */}
      <div className="flex-1 space-y-4 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          <Button
            onClick={() => setShowForm(f => !f)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            {showForm ? 'Cancel' : 'Create Event'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <input
              type="text"
              placeholder="Event Title"
              className="w-full border border-gray-300 rounded-lg px-3 py-1 mb-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
              <input
                type="time"
                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Description (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 resize-none"
              rows={3}
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <Button
              onClick={handleAdd}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Add Event
            </Button>
          </div>
        )}

        {filtered.length > 0 ? (
          filtered.map(ev => (
            <div
              key={ev.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <h4 className="font-semibold text-gray-900 mb-1">{ev.title}</h4>
              <p className="text-sm text-gray-600 mb-1">
                {ev.date} at {ev.time}
              </p>
              {ev.description && (
                <p className="text-gray-700 mb-2">{ev.description}</p>
              )}
              <Button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                Join Event
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No events on this date.</p>
        )}
      </div>

      {/* Right (fixed-size) */}
      <div className="mt-6 lg:mt-0 w-full lg:w-80 flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prev} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">
              {new Date(year, month).toLocaleString('default', {
                month: 'long',
                year: 'numeric'
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
          <div className="grid grid-cols-7 gap-y-2">
            {cells.map((day, i) => {
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const hasEvent = day !== null && marked.has(day);
              return (
                <div
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    relative h-12 flex items-center justify-center cursor-pointer
                    ${isToday ? 'bg-orange-100 rounded-full' : ''}
                    ${day && selectedDay === day ? 'ring-2 ring-orange-300 rounded-full' : ''}
                    hover:bg-gray-50
                  `}
                >
                  {day && <span className="text-sm text-gray-800">{day}</span>}
                  {hasEvent && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setSelectedDay(null)}
          className="mt-4 bg-orange-500 w-full text-white py-2 rounded-lg hover:bg-orange-600"
        >
          Show All Events
        </button>
      </div>
    </div>
  );
}
