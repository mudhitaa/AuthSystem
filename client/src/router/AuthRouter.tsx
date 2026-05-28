import LoginPage from '../pages/AuthPages/LoginPage';
import RegisterPage from '../pages/AuthPages/RegisterPage';
import ForgotPasswordPage from '../pages/AuthPages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/AuthPages/ResetPasswordPage';
import VerifyEmailPage from '../pages/AuthPages/VerifyEmailPage';
import { PublicRoute } from '../components/ProtectedRoute';

export const AuthRouter = [
  {
    element: <PublicRoute />,
    children: [
      { path: '/login',                    element: <LoginPage /> },
      { path: '/register',                 element: <RegisterPage /> },
      { path: '/forgot-password',          element: <ForgotPasswordPage /> },
      { path: '/reset-password/:token',    element: <ResetPasswordPage /> },
      { path: '/verify-email/:token',      element: <VerifyEmailPage /> },
    ]
  }
];