import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterForm } from '../hooks/useFormSchemas';

import registerImg from '../assets/register.jpg';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const message = await registerUser(data);
      toast.success(message);
      navigate('/login');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Registration failed'
        : 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4">
      <div className="flex bg-white shadow-xl rounded-xl overflow-hidden w-[900px] h-[500px]">

        {/* LEFT IMAGE */}
        <div className="hidden lg:block w-1/2">
          <img
            src={registerImg}
            alt="register"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
            Sign Up
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-purple-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-purple-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                placeholder="Min. 6 characters"
                className="w-full border border-purple-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-500 transition"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-xs text-center mt-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-700 hover:text-purple-500"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}