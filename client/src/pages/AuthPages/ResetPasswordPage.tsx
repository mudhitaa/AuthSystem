import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import api from '../../api/axios';
import { resetPasswordSchema, type ResetPasswordForm } from '../../hooks/useFormSchemas';
import FormInput from '../../components/ui/FormInput';
import {Heading} from '../../components/typography/Heading';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await api.put(`/auth/reset-password/${token ?? ''}`, { password: data.password });
      toast.success('Password updated! Please sign in.');
      navigate('/login');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Reset failed'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-10">

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <Heading
            text="Set new password"
            subtitle="Must be at least 6 characters"
            classname="text-gray-900"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <FormInput
              label="New password"
              type="password"
              placeholder="••••••••"
              registration={register('password')}
              error={errors.password?.message}
            />

            <FormInput
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Updating...
                </span>
              ) : 'Update password'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link to="/login" className="text-blue-600 hover:text-blue-500 hover:underline">
              ← Back to Login
            </Link>
          </p>

        </div>

        {/* BOTTOM NOTE */}
        <p className="text-center text-xs text-gray-400 mt-4">
          This link expires after use. Request a new one if needed.
        </p>

      </div>
    </div>
  );
}