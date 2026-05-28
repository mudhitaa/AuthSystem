import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import api from '../api/axios';
import type { User , LoginPayload,RegisterPayload } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  

  // On mount, verify token is still valid
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { setIsLoading(false); return; }
      try {
        const { data } = await api.get<{ user: User }>('/auth/me');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    void verify();
  }, []);

  const login = async (payload: LoginPayload): Promise<void> => {
    const { data } = await api.post<{ accessToken: string; user: User }>(
      '/auth/login',
      payload
    );
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload: RegisterPayload): Promise<string> => {
    const { data } = await api.post<{ message: string }>('/auth/register', payload);
    return data.message;
  };

  const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
