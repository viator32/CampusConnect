// src/features/admin/pages/AdminPage.tsx
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useProfile } from '../../profile/hooks/useProfile';
import { Shield, Users, Globe } from 'lucide-react';
import Button from '../../../components/Button';

type ClubRequest = { id: number; name: string; requestedBy: string; date: string };
type ExternalAccountRequest = { id: number; email: string; reason: string; date: string };

export default function AdminPage() {
  const { user } = useProfile();
  const navigate = useNavigate();

  const [clubRequests, setClubRequests] = useState<ClubRequest[]>([
    { id: 1, name: 'Art Club', requestedBy: 'alice@uni.edu', date: '2025-07-10' },
    { id: 2, name: 'Chess Club', requestedBy: 'bob@uni.edu',   date: '2025-07-11' }
  ]);
  const [externalRequests, setExternalRequests] = useState<ExternalAccountRequest[]>([
    { id: 1, email: 'john@gmail.com', reason: 'Faculty advisor', date: '2025-07-12' }
  ]);

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return <Navigate to="/" replace />;
  }

  const approveClub = (id: number) =>
    setClubRequests(reqs => reqs.filter(r => r.id !== id));
  const rejectClub  = (id: number) =>
    setClubRequests(reqs => reqs.filter(r => r.id !== id));

  const approveExt = (id: number) =>
    setExternalRequests(reqs => reqs.filter(r => r.id !== id));
  const rejectExt  = (id: number) =>
    setExternalRequests(reqs => reqs.filter(r => r.id !== id));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Shield className="w-6 h-6 text-orange-600" /> Administration
      </h1>

      {/* Club creation approvals */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-1">
          <Users className="w-5 h-5 text-gray-600" /> Club Creation Requests
        </h2>
        {clubRequests.length > 0 ? (
          clubRequests.map(req => (
            <div key={req.id} className="flex items-center justify-between bg-white p-4 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{req.name}</p>
                <p className="text-sm text-gray-500">
                  by {req.requestedBy} on {req.date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => approveClub(req.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">
                  Approve
                </Button>
                <Button onClick={() => rejectClub(req.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No pending club requests.</p>
        )}
      </section>

      {/* External account approvals */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-1">
          <Globe className="w-5 h-5 text-gray-600" /> External Account Requests
        </h2>
        {externalRequests.length > 0 ? (
          externalRequests.map(req => (
            <div key={req.id} className="flex items-center justify-between bg-white p-4 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{req.email}</p>
                <p className="text-sm text-gray-500">{req.reason} • {req.date}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => approveExt(req.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">
                  Approve
                </Button>
                <Button onClick={() => rejectExt(req.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No pending external account requests.</p>
        )}
      </section>

      {/* Other Tools */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Other Tools</h2>
        <ul className="space-y-2">
          <li>
            <Button
              onClick={() => navigate('/admin/users')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Manage Users
            </Button>
          </li>
          <li>
            <Button
              onClick={() => navigate('/admin/analytics')}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              View Platform Analytics
            </Button>
          </li>
          <li>
            <Button
              onClick={() => navigate('/admin/moderation')}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Content Moderation
            </Button>
          </li>
        </ul>
      </section>
    </div>
  );
}
