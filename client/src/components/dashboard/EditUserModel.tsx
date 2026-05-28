import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../ui/FormInput';

const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EditProfileForm = z.infer<typeof editProfileSchema>;
type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

type Tab = 'profile' | 'password';

export default function EditUserModal({ onClose }: { onClose: () => void }) {
  const { user, login } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');

  // ── Profile form ──────────────────────────────────────────────────────────
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const onProfileSubmit = async (data: EditProfileForm) => {
    try {
      await api.patch('/auth/update-profile', data);
      // Re-fetch user to update context
      await login({ email: data.email, password: '' });
      toast.success('Profile updated!');
      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Update failed'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  // ── Password form ─────────────────────────────────────────────────────────
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPassword,
  } = useForm<ChangePasswordForm>({ resolver: zodResolver(changePasswordSchema) });

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    try {
      await api.patch('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed!');
      resetPassword();
      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Failed to change password'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Edit profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-100 px-6">
          {(['profile', 'password'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-1 mr-6 text-sm font-medium border-b-2 transition capitalize
                ${tab === t
                  ? 'border-slate-800 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              {t === 'profile' ? 'Profile info' : 'Change password'}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="p-6">

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
              <FormInput
                label="Full name"
                type="text"
                placeholder="John Doe"
                registration={regProfile('name')}
                error={profileErrors.name?.message}
              />
              <FormInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                registration={regProfile('email')}
                error={profileErrors.email?.message}
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={profileSubmitting}
                  className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
                  {profileSubmitting ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          )}

          {/* PASSWORD TAB */}
          {tab === 'password' && (
            <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
              <FormInput
                label="Current password"
                type="password"
                placeholder="••••••••"
                registration={regPassword('currentPassword')}
                error={passwordErrors.currentPassword?.message}
              />
              <FormInput
                label="New password"
                type="password"
                placeholder="Min. 6 characters"
                registration={regPassword('newPassword')}
                error={passwordErrors.newPassword?.message}
              />
              <FormInput
                label="Confirm new password"
                type="password"
                placeholder="••••••••"
                registration={regPassword('confirmPassword')}
                error={passwordErrors.confirmPassword?.message}
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={passwordSubmitting}
                  className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
                  {passwordSubmitting ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}