import React, { useState } from 'react';
import { Club, Event } from '../types';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Button from '../../../components/Button';

interface EventsTabProps {
  club: Club;
  setClub: React.Dispatch<React.SetStateAction<Club | null>>;
}

export default function EventsTab({ club, setClub }: EventsTabProps) {
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [eventError, setEventError] = useState<string | null>(null);

  const prevMonth = () => {
    const m = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const y = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    setCalendarMonth(m);
    setCalendarYear(y);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    const m = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    setCalendarMonth(m);
    setCalendarYear(y);
    setSelectedDate(null);
  };

  const handleCreateEvent = () => {
    setEventError(null);
    if (!newEventTitle.trim() || !newEventDate || !newEventTime) {
      setEventError('Title, date & time are required.');
      return;
    }
    const newEv: Event & { description?: string } = {
      id: Date.now(),
      title: newEventTitle.trim(),
      date: newEventDate,
      time: newEventTime,
      description: newEventDesc.trim() || undefined
    };
    setClub(prev => prev && ({ ...prev, events: [newEv, ...prev.events] }));
    setShowCreateEventForm(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventDesc('');
  };

  const filtered = club.events.filter(ev => {
    if (!selectedDate) return true;
    const d = new Date(ev.date);
    return (
      d.getFullYear() === calendarYear &&
      d.getMonth() === calendarMonth &&
      d.getDate() === selectedDate
    );
  });

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      {/* Event List */}
      <div className="flex-1 space-y-4 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          <Button
            onClick={() => setShowCreateEventForm(f => !f)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            {showCreateEventForm ? 'Cancel' : 'Create Event'}
          </Button>
        </div>

        {showCreateEventForm && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {eventError && <p className="text-sm text-red-600 mb-2">{eventError}</p>}
            <input
              type="text"
              placeholder="Event Title"
              className="w-full border border-gray-300 rounded-lg px-3 py-1 mb-2"
              value={newEventTitle}
              onChange={e => setNewEventTitle(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                value={newEventDate}
                onChange={e => setNewEventDate(e.target.value)}
              />
              <input
                type="time"
                className="w-full border border-gray-300 rounded-lg px-3 py-1"
                value={newEventTime}
                onChange={e => setNewEventTime(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Description (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 resize-none"
              rows={3}
              value={newEventDesc}
              onChange={e => setNewEventDesc(e.target.value)}
            />
            <Button
              onClick={handleCreateEvent}
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

      {/* Calendar */}
      <div className="mt-6 lg:mt-0 w-full lg:w-80 flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">
              {new Date(calendarYear, calendarMonth).toLocaleString('default', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
            {['S','M','T','W','T','F','S'].map(d => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2">
            {(() => {
              const first = new Date(calendarYear, calendarMonth, 1);
              const offset = first.getDay();
              const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
              const marked = new Set(
                club.events
                  .map(e => new Date(e.date))
                  .filter(d => d.getFullYear() === calendarYear && d.getMonth() === calendarMonth)
                  .map(d => d.getDate())
              );
              const cells: (number|null)[] = [];
              for (let i = 0; i < offset; i++) cells.push(null);
              for (let d = 1; d <= daysInMonth; d++) cells.push(d);
              while (cells.length < 42) cells.push(null);

              return cells.map((day, i) => {
                const isToday =
                  day === today.getDate() &&
                  calendarMonth === today.getMonth() &&
                  calendarYear === today.getFullYear();
                const hasEvent = day !== null && marked.has(day);
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={`relative h-12 flex items-center justify-center cursor-pointer
                      ${isToday ? 'bg-orange-100 rounded-full' : ''}
                      ${day && selectedDate === day ? 'ring-2 ring-orange-300 rounded-full' : ''}
                      hover:bg-gray-50`}
                  >
                    {day && <span className="text-sm text-gray-800">{day}</span>}
                    {hasEvent && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <button
          onClick={() => setSelectedDate(null)}
          className="mt-4 bg-orange-500 w-full text-white py-2 rounded-lg hover:bg-orange-600"
        >
          Show All Events
        </button>
      </div>
    </div>
  );
}
