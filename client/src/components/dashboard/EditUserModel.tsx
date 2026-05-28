import { useState } from 'react';
import { EditHeader } from '../ui/Header';
import ProfileTab from './EditTabs/ProfileTab';
import PasswordTab from './EditTabs/PasswordTab';
import DangerTab from './EditTabs/DangerTab';

type Tab = 'profile' | 'password' | 'danger';

export default function EditUserModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('profile');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        <EditHeader onClose={onClose} />

        {/* TABS */}
        <div className="flex border-b border-slate-100 px-6">
          {(['profile', 'password', 'danger'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-1 mr-6 text-sm font-medium border-b-2 transition
                ${tab === t
                  ? t === 'danger'
                    ? 'border-red-500 text-red-600'
                    : 'border-slate-800 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              {t === 'profile' ? 'Profile info' : t === 'password' ? 'Change password' : 'Danger zone'}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="p-6">
          {tab === 'profile'   && <ProfileTab  onClose={onClose} />}
          {tab === 'password'  && <PasswordTab onClose={onClose} />}
          {tab === 'danger'    && <DangerTab   onClose={onClose} />}
        </div>

      </div>
    </div>
  );
}