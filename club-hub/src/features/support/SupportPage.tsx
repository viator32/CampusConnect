// src/features/support/SupportPage.tsx
import React, { useState } from 'react';
import Button from '../../components/Button';

export default function SupportPage() {
  const [subject, setSubject]   = useState('');
  const [email, setEmail]       = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your support API
    console.log({ subject, email, message });
    alert('Thank you! Your feedback has been sent.');
    setSubject('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Support & Feedback</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Subject"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue or feedback…"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
          <Button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
