import type { FC, PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, FolderKanban } from 'lucide-react';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
                <Link
                  to="/"
                  className={`inline-flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive('/')
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/entries"
                  className={`inline-flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive('/entries')
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  Entries
                </Link>
                <Link
                  to="/categories"
                  className={`inline-flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive('/categories')
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <FolderKanban className="w-5 h-5 mr-2" />
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};
