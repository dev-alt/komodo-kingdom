import { createContext, useContext, useCallback, useEffect } from 'react';
import type { User, KomodoCard } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getRandomCards, komodoCards } from '@/data/cards';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  addCardsToCollection: (cards: KomodoCard[]) => void;
  removeCardFromCollection: (cardId: string) => void;
  updateUserStats: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default test user
const createTestUser = (): User => ({
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  collection: komodoCards.slice(0, 6), // Give test user 6 starter cards
  packsOpened: 2,
  quizzesCompleted: 3,
  correctAnswers: 7,
});

const defaultUsers = {
  'testuser': { 
    password: 'test123', 
    user: createTestUser() 
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('komodo-user', null);
  const [users, setUsers] = useLocalStorage<Record<string, { password: string; user: User }>>('komodo-users', defaultUsers);

  // Ensure test user exists
  useEffect(() => {
    setUsers(prev => {
      if (!prev['testuser']) {
        return { ...prev, ...defaultUsers };
      }
      return prev;
    });
  }, []);

  const isAuthenticated = !!user;

  const login = useCallback((username: string, password: string): boolean => {
    const userData = users[username.toLowerCase()];
    if (userData && userData.password === password) {
      setUser(userData.user);
      return true;
    }
    return false;
  }, [users, setUser]);

  const register = useCallback((username: string, email: string, password: string): boolean => {
    const usernameLower = username.toLowerCase();
    if (users[usernameLower]) {
      return false;
    }

    const starterCards = getRandomCards(3, 0.2);
    
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      collection: starterCards,
      packsOpened: 0,
      quizzesCompleted: 0,
      correctAnswers: 0,
    };

    setUsers(prev => ({
      ...prev,
      [usernameLower]: { password, user: newUser }
    }));
    setUser(newUser);
    return true;
  }, [users, setUsers, setUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const addCardsToCollection = useCallback((cards: KomodoCard[]) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return null;
      const existingIds = new Set(prev.collection.map(c => c.id));
      const newCards = cards.filter(c => !existingIds.has(c.id));
      return {
        ...prev,
        collection: [...prev.collection, ...newCards],
        packsOpened: prev.packsOpened + 1
      };
    });
  }, [user, setUser]);

  const removeCardFromCollection = useCallback((cardId: string) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        collection: prev.collection.filter(c => c.id !== cardId)
      };
    });
  }, [user, setUser]);

  const updateUserStats = useCallback((updates: Partial<User>) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, [user, setUser]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      addCardsToCollection,
      removeCardFromCollection,
      updateUserStats
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
