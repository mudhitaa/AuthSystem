import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="auth-card text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {user?.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Hey, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            ✅ You're authenticated — this is a protected route
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2.5 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition duration-150"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
