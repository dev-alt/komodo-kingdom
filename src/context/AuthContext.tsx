import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { KomodoCard, User } from "@/types";
import { loginRequest, logoutRequest, registerRequest, getCurrentUser } from "@/lib/authClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addCardsToCollection: (cards: KomodoCard[]) => void;
  removeCardFromCollection: (cardId: string) => void;
  updateUserStats: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const session = await getCurrentUser();
        if (isMounted) {
          setUser(session.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsSessionLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const isAuthenticated = !!user;

  const login = useCallback(async (username: string, password: string) => {
    try {
      const payload = await loginRequest(username, password);
      setUser(payload.user);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unable to sign in.",
      };
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const payload = await registerRequest(username, email, password);
      setUser(payload.user);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unable to create account.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const addCardsToCollection = useCallback((cards: KomodoCard[]) => {
    setUser((prev) => {
      if (!prev) return null;
      const existingIds = new Set(prev.collection.map((card) => card.id));
      const newCards = cards.filter((card) => !existingIds.has(card.id));

      return {
        ...prev,
        collection: [...prev.collection, ...newCards],
        packsOpened: prev.packsOpened + 1,
      };
    });
  }, []);

  const removeCardFromCollection = useCallback((cardId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        collection: prev.collection.filter((card) => card.id !== cardId),
      };
    });
  }, []);

  const updateUserStats = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isSessionLoading,
      login,
      register,
      logout,
      addCardsToCollection,
      removeCardFromCollection,
      updateUserStats,
    }),
    [
      user,
      isAuthenticated,
      isSessionLoading,
      login,
      register,
      logout,
      addCardsToCollection,
      removeCardFromCollection,
      updateUserStats,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
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
