import loginImg from '../assets/loginimg.jpg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginForm } from '../hooks/useFormSchemas';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Login failed'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <div className="flex bg-white shadow-xl rounded-xl overflow-hidden max-w-4xl w-full">

        {/* LEFT IMAGE */}
        <div className="hidden lg:block w-1/2">
          <img
            src={loginImg}
            alt="login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 p-10">

          <h1 className="text-2xl font-bold text-pink-700 text-center mb-6">
            Login
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...register('password')}
              />

              <div className="text-right mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs hover:text-pink-500"
                >
                  Forgot password?
                </Link>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-700 text-white py-2 rounded hover:bg-pink-500 transition"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs mt-4">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-pink-700 hover:text-pink-500"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}