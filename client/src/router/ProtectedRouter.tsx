import DashboardPage from '../pages/DashboardPages/DashboardPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const ProtectedRouter = [
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
    ]
  }
];