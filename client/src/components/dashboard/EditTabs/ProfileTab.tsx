import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import FormInput from '../../ui/FormInput';
import { type EditProfileForm, editProfileSchema } from '../../../schemas/User';
import { type User } from '../../../types';

export default function ProfileTab({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const onSubmit = async (data: EditProfileForm) => {
    try {
      const { data: res } = await api.patch<{
        message: string;
        emailChanged: boolean;
        user?: User;
      }>('/dashboard/update-profile', data);

      if (res.emailChanged) {
        toast.success('Email updated! Check your new inbox to verify.');
        onClose();
        await logout();
        navigate('/login');
        return;
      }

      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      toast.success('Profile updated!');
      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Update failed'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Full name"
        type="text"
        placeholder="John Doe"
        registration={register('name')}
        error={errors.name?.message}
      />
      <FormInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        registration={register('email')}
        error={errors.email?.message}
      />
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}