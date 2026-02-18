import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!loginUsername || !loginPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const success = login(loginUsername, loginPassword);
    if (success) {
      onClose();
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setError('Invalid username or password');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!registerUsername || !registerEmail || !registerPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const success = register(registerUsername, registerEmail, registerPassword);
    if (success) {
      onClose();
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
    } else {
      setError('Username already exists');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1B2B1B] border-2 border-[#3a4a3a] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="font-display text-2xl text-[#F3EFE6]">
              Welcome to Komodo Kingdom
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 bg-[#243824]">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-[#FF6F2C] data-[state=active]:text-[#F3EFE6] text-[#B8C1B8]"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="data-[state=active]:bg-[#FF6F2C] data-[state=active]:text-[#F3EFE6] text-[#B8C1B8]"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </TabsTrigger>
          </TabsList>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[#B8C1B8] text-sm mb-1">Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="input-komodo w-full"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-[#B8C1B8] text-sm mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input-komodo w-full pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8C1B8] hover:text-[#F3EFE6]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            {/* Test Login Button */}
            <div className="mt-4 pt-4 border-t border-[#3a4a3a]">
              <p className="text-[#B8C1B8] text-xs text-center mb-2">Or try with a test account</p>
              <button
                type="button"
                onClick={() => {
                  setLoginUsername('testuser');
                  setLoginPassword('test123');
                  setTimeout(() => {
                    const success = login('testuser', 'test123');
                    if (success) {
                      onClose();
                      setLoginUsername('');
                      setLoginPassword('');
                    }
                  }, 100);
                }}
                className="w-full py-2 px-4 bg-[#243824] border border-[#3a4a3a] rounded-lg text-[#B8C1B8] hover:text-[#F3EFE6] hover:border-[#FF6F2C] transition-colors text-sm"
              >
                Login as Test User (testuser / test123)
              </button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[#B8C1B8] text-sm mb-1">Username</label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="input-komodo w-full"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="block text-[#B8C1B8] text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="input-komodo w-full"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-[#B8C1B8] text-sm mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="input-komodo w-full pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8C1B8] hover:text-[#F3EFE6]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[#B8C1B8] text-sm mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className="input-komodo w-full"
                  placeholder="Confirm your password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
