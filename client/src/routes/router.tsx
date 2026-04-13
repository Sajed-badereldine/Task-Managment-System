import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PublicOnlyRoute, ProtectedRoute } from '@/routes/guards';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTasksPage } from '@/pages/admin/AdminTasksPage';
import { PendingUsersPage } from '@/pages/admin/PendingUsersPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SignupPage } from '@/pages/SignupPage';
import { MyTasksPage } from '@/pages/user/MyTasksPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { UserDashboardPage } from '@/pages/user/UserDashboardPage';

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    path: '/forbidden',
    element: <ForbiddenPage />,
  },
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '/admin',
        element: <AppShell />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'pending-users', element: <PendingUsersPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'tasks', element: <AdminTasksPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['user']} />,
    children: [
      {
        path: '/app',
        element: <AppShell />,
        children: [
          { index: true, element: <UserDashboardPage /> },
          { path: 'tasks', element: <MyTasksPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '/home',
    element: <Navigate to="/" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
