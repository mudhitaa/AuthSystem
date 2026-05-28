import loginImg from '../../assets/loginimg.jpg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, type LoginForm } from '../../hooks/useFormSchemas';
import AuthCard from '../../components/ui/AuthCards';
import FormInput from '../../components/ui/FormInput';
import {Heading} from '../../components/typography/Heading';
import { AuthButton } from '../../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    console.log('Login data:', data);
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
    <AuthCard image={loginImg} imageAlt="login" gradient="from-pink-50 to-pink-100">

      <Heading classname="text-pink-700" text="Login" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          placeholder="••••••••"
          registration={register('password')}
          error={errors.password?.message}
          rightElement={
            <Link to="/forgot-password" className="text-xs hover:text-pink-500">
              Forgot password?
            </Link>
          }
        />

      <AuthButton isSubmitting={isSubmitting} buffer="Login" buffering="Logging in..." className=" bg-pink-500 hover:bg-pink-600 " />
      </form>

      <p className="text-center text-xs mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-pink-700 hover:text-pink-500">Sign up</Link>
      </p>

    </AuthCard>
  );
}