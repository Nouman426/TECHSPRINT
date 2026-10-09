import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => Promise<boolean>;
  register: (fullName: string, email: string, role: UserRole, extra?: Partial<User>) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  isAuthModalOpen: boolean;
  openAuthModal: (initialRole?: UserRole, initialMode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  authModalConfig: { role: UserRole; mode: 'signin' | 'signup' };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('veteren_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { console.error(e); }
    }
    // Default demo session as Client for immediate usability
    return INITIAL_MOCK_USERS.find(u => u.uid === 'client-demo') || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{ role: UserRole; mode: 'signin' | 'signup' }>({
    role: 'client',
    mode: 'signin',
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('veteren_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('veteren_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, requestedRole: UserRole): Promise<boolean> => {
    // Check existing mock/saved users or create clean session
    const users = JSON.parse(localStorage.getItem('veteren_all_users') || 'null') || INITIAL_MOCK_USERS;
    const existing = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      if (existing.role !== requestedRole && existing.role !== 'admin') {
        throw new Error(`Account exists as a ${existing.role.toUpperCase()}. Please switch role tab to ${existing.role} or sign in with correct account.`);
      }
      setCurrentUser(existing);
      return true;
    }

    // Default dynamic user creation if signing in first time
    const newUser: User = {
      uid: 'u-' + Date.now(),
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: requestedRole,
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('veteren_all_users', JSON.stringify(users));
    setCurrentUser(newUser);
    return true;
  };

  const register = async (fullName: string, email: string, role: UserRole, extra?: Partial<User>): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('veteren_all_users') || 'null') || INITIAL_MOCK_USERS;
    if (users.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`An account with email ${email} already exists. Please Sign In.`);
    }

    const newUser: User = {
      uid: 'u-' + Date.now(),
      email,
      fullName,
      role,
      accountStatus: 'active',
      ...extra,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('veteren_all_users', JSON.stringify(users));
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
  };

  const openAuthModal = (initialRole: UserRole = 'client', initialMode: 'signin' | 'signup' = 'signin') => {
    setAuthModalConfig({ role: initialRole, mode: initialMode });
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role: currentUser?.role || 'client',
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      logout,
      switchRole,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      authModalConfig,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
