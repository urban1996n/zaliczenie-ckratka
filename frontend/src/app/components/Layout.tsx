import { type FC, type PropsWithChildren, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, FolderKanban, LogOutIcon } from 'lucide-react';
import { useAuth } from 'hooks/useAuth.ts';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = useCallback((path: string) => location.pathname === path, []);

  const getClasses = useCallback((path: string) => {
    return `inline-flex items-center px-3 py-2 rounded-md transition-colors ${
      isActive(path) ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-500 hover:text-white'
    }`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-white text-xl">Finance Tracker</h1>
              </div>
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/" className={getClasses('/')}>
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <Link to="/entries" className={getClasses('/entries')}>
                  <Receipt className="w-5 h-5 mr-2" />
                  Entries
                </Link>
                <Link to="/categories" className={getClasses('/categories')}>
                  <FolderKanban className="w-5 h-5 mr-2" />
                  Categories
                </Link>
                <a href="#" onClick={() => logout()} className={getClasses('/logout')}>
                  <LogOutIcon className="w-5 h-5 mr-2" />
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};
