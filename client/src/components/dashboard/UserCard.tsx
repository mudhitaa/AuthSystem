import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EditUserModal from './EditUserModel';
import { SubHeading } from '../typography/Heading';

export default function UserCard() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-white tracking-wide">{initials}</span>
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SubHeading text={user?.name || 'User'} />
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5 truncate">{user?.email}</p>
         
        </div>

        {/* STATS */}
        <div className="flex gap-6 text-center shrink-0">
          <div>
            <p className="text-lg font-bold text-slate-800">JWT</p>
            <p className="text-xs text-slate-400">Auth method</p>
          </div>
          <div className="w-px bg-slate-100" />
          <div>
            <p className="text-lg font-bold text-slate-800">2</p>
            <p className="text-xs text-slate-400">Tokens active</p>
          </div>
          <div className="w-px bg-slate-100" />
          <div>
            <p className="text-lg font-bold text-emerald-600">✓</p>
            <p className="text-xs text-slate-400">Verified</p>
          </div>
        </div>

        {/* EDIT  */}
        <button
          onClick={() => setEditOpen(true)}
          className="shrink-0 flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit profile
        </button>
      </div>

      {editOpen && <EditUserModal onClose={() => setEditOpen(false)} />}
    </>
  );
}