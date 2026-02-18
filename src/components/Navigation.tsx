import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';
import { LogOut, Package, BookOpen, LayoutGrid } from 'lucide-react';

interface NavigationProps {
  onCollectionClick?: () => void;
  onQuizClick?: () => void;
  onPacksClick?: () => void;
}

export function Navigation({ onCollectionClick, onQuizClick, onPacksClick }: NavigationProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const handleLoginClick = () => {
    setAuthTab('login');
    setAuthOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthTab('register');
    setAuthOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B2B1B]/90 backdrop-blur-sm border-b border-[#3a4a3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦎</span>
              <span className="font-display font-bold text-[#F3EFE6] text-lg hidden sm:block">
                Komodo Kingdom
              </span>
            </div>

            {/* Navigation Links */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={onCollectionClick}
                  className="text-[#B8C1B8] hover:text-[#F3EFE6] flex items-center gap-2 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Collection
                </button>
                <button 
                  onClick={onQuizClick}
                  className="text-[#B8C1B8] hover:text-[#F3EFE6] flex items-center gap-2 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Quiz
                </button>
                <button 
                  onClick={onPacksClick}
                  className="text-[#B8C1B8] hover:text-[#F3EFE6] flex items-center gap-2 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Packs
                </button>
              </div>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-[#F3EFE6] text-sm font-medium">{user?.username}</p>
                    <p className="text-[#B8C1B8] text-xs">{user?.collection.length} cards</p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-[#B8C1B8] hover:text-[#F3EFE6] hover:bg-[#243824] rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoginClick}
                    className="text-[#B8C1B8] hover:text-[#F3EFE6] px-3 py-2 rounded-lg hover:bg-[#243824] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="bg-[#FF6F2C] text-[#F3EFE6] px-4 py-2 rounded-lg font-medium hover:bg-[#e56222] transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        defaultTab={authTab}
      />
    </>
  );
}
