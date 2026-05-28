import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import api from '../../../api/axios';
import FormInput from '../../ui/FormInput';
import { type ChangePasswordForm, changePasswordSchema } from '../../../schemas/User';

export default function PasswordTab({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordForm>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await api.patch('/dashboard/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed!');
      reset();
      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Failed to change password'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Current password"
        type="password"
        placeholder="••••••••"
        registration={register('currentPassword')}
        error={errors.currentPassword?.message}
      />
      <FormInput
        label="New password"
        type="password"
        placeholder="Min. 6 characters"
        registration={register('newPassword')}
        error={errors.newPassword?.message}
      />
      <FormInput
        label="Confirm new password"
        type="password"
        placeholder="••••••••"
        registration={register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>
      </div>
    </form>
  );
}