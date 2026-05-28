import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthRouter } from './AuthRouter';
import { ProtectedRouter } from './ProtectedRouter';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  ...AuthRouter,
  ...ProtectedRouter,
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export default function RouterConfig() {
  return <RouterProvider router={router} />;
}