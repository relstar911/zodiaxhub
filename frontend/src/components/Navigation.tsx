import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-700' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || !token) {
    return null;
  }

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Zodiax Hub
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md ${isActive('/')} hover:bg-gray-700`}
            >
              Dashboard
            </Link>
            <Link
              to="/card-editor"
              className={`px-3 py-2 rounded-md ${isActive('/card-editor')} hover:bg-gray-700`}
            >
              Card Editor
            </Link>
            <Link
              to="/deck-builder"
              className={`px-3 py-2 rounded-md ${isActive('/deck-builder')} hover:bg-gray-700`}
            >
              Deck Builder
            </Link>
            <Link
              to="/simulator"
              className={`px-3 py-2 rounded-md ${isActive('/simulator')} hover:bg-gray-700`}
            >
              Simulator
            </Link>
            <Link
              to="/community"
              className={`px-3 py-2 rounded-md ${isActive('/community')} hover:bg-gray-700`}
            >
              Community
            </Link>
            <Link
              to="/test-game"
              className={`px-3 py-2 rounded-md ${isActive('/test-game')} hover:bg-gray-700`}
            >
              Test Game
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-300">Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
