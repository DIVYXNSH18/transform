'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const DEMO_USER = {
  id: 'demo_001',
  name: 'Alex Chen',
  email: 'alex.chen@transformai.local',
  password: 'demo1234',
  plan: 'Pro Edge',
  avatar: 'AC',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Seed demo user
    const db = JSON.parse(localStorage.getItem('transformai_users_db') || '[]');
    if (!db.find(u => u.email === DEMO_USER.email)) {
      localStorage.setItem('transformai_users_db', JSON.stringify([...db, DEMO_USER]));
    }
    // Restore session
    const session = localStorage.getItem('transformai_auth_user');
    if (session) {
      try {
        const u = JSON.parse(session);
        setUser(u);
        setIsAuthenticated(true);
      } catch {}
    }
  }, []);

  const _persist = (u) => {
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('transformai_auth_user', JSON.stringify(u));
  };

  const login = (email, password) => {
    const db = JSON.parse(localStorage.getItem('transformai_users_db') || '[]');
    const found = db.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Invalid email or password.' };
    _persist(found);
    return { success: true };
  };

  const quickDemoLogin = () => {
    _persist(DEMO_USER);
    return { success: true };
  };

  const signup = (name, email, password) => {
    const db = JSON.parse(localStorage.getItem('transformai_users_db') || '[]');
    if (db.find(u => u.email === email)) return { error: 'Email already registered.' };
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      plan: 'Free',
      avatar: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('transformai_users_db', JSON.stringify([...db, newUser]));
    _persist(newUser);
    return { success: true };
  };

  const resetPassword = (email, newPassword) => {
    const db = JSON.parse(localStorage.getItem('transformai_users_db') || '[]');
    const idx = db.findIndex(u => u.email === email);
    if (idx === -1) return { error: 'No account found with that email.' };
    db[idx].password = newPassword;
    localStorage.setItem('transformai_users_db', JSON.stringify(db));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('transformai_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, quickDemoLogin, signup, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
