import forgotImg from '../../assets/forgotimg.jpg';
import bgImg from '../../assets/passbg.jpg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import api from '../../api/axios';
import { forgotPasswordSchema, type ForgotPasswordForm } from '../../hooks/useFormSchemas';
import FormInput from '../../components/ui/FormInput';
import { Heading } from '../../components/typography/Heading';

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await api.post('/auth/forgot-password', data);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Request failed'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  // SUCCESS STATE
  if (isSubmitSuccessful) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Check your inbox</h2>
          <p className="text-sm text-gray-500 mt-2">If that email exists, we've sent a reset link.</p>
          <Link to="/login" className="inline-block mt-6 text-yellow-700 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  // MAIN FORM
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex bg-white shadow-xl rounded-xl overflow-hidden w-[800px] h-[450px]">

        <div className="hidden md:block w-1/2">
          <img src={forgotImg} alt="forgot password" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <Heading classname="text-yellow-700" text="Forgot Password?" />
          <p className="text-sm text-yellow-500 text-center mt-2 mb-6">
            Enter your email and we'll send a reset link
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              registration={register('email')}
              error={errors.email?.message}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Link'}
            </button>
          </form>

          <p className="text-xs text-center mt-4">
            Remember password?{' '}
            <Link to="/login" className="text-yellow-700 hover:text-yellow-500">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}