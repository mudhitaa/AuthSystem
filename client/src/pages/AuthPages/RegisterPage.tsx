import registerImg from '../../assets/registerImg.jpg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { registerSchema, type RegisterForm } from '../../hooks/useFormSchemas';
import AuthCard from '../../components/ui/AuthCards';
import FormInput from '../../components/ui/FormInput';
import { Heading } from '../../components/typography/Heading';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

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
    <AuthCard image={registerImg} imageAlt="register" gradient="from-purple-50 to-purple-100">

      <Heading classname="text-purple-700" text="Sign Up" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Name"
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

        <FormInput
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          registration={register('password')}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-500 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-xs text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-700 hover:text-purple-500">Login</Link>
      </p>

    </AuthCard>
  );
}