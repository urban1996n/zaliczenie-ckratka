import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'app/components/Layout';
import { Dashboard } from 'app/pages/Dashboard';
import { Entries } from 'app/pages/Entries';
import { Categories } from 'app/pages/Categories';
import { AuthPage } from 'app/pages/Auth/AuthPage';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from 'hooks/useAuth.ts';

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />}
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/entries"
          element={
            <Layout>
              <Entries />
            </Layout>
          }
        />
        <Route
          path="/categories"
          element={
            <Layout>
              <Categories />
            </Layout>
          }
        />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
