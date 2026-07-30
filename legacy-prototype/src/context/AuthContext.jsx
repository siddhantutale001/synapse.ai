import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'synapse_active_user';
const STORAGE_KEY_ACCOUNTS = 'synapse_accounts';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pendingOTP, setPendingOTP] = useState(null);

  // Sync active user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  // Helper to fetch all accounts
  const getAccounts = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Helper to save accounts
  const saveAccounts = (accounts) => {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  };

  // Signup -> Creates pending OTP
  const signup = (name, email, password) => {
    const accounts = getAccounts();
    const existing = accounts.find((acc) => acc.email.toLowerCase() === email.toLowerCase());

    if (existing && existing.isVerified) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    // Generate 6-digit code
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    const pending = {
      name,
      email,
      password,
      code: generatedOTP,
      expiresAt: Date.now() + 30 * 1000, // 30s expiry
    };

    setPendingOTP(pending);
    return { success: true, otp: generatedOTP };
  };

  // Verify OTP -> Finalize registration & log in
  const verifyOTP = (inputCode) => {
    if (!pendingOTP) {
      throw new Error('No pending registration found. Please sign up again.');
    }

    if (inputCode !== pendingOTP.code) {
      throw new Error('Invalid 6-digit verification code. Please check and try again.');
    }

    const accounts = getAccounts();
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: pendingOTP.name,
      email: pendingOTP.email,
      password: pendingOTP.password,
      avatar: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400',
      bio: 'Exploring frontier AI models & cognitive architecture.',
      isVerified: true,
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      settings: { emailNotifications: true, darkMode: true },
    };

    // Replace if unverified account existed, else push
    const filtered = accounts.filter((acc) => acc.email.toLowerCase() !== pendingOTP.email.toLowerCase());
    saveAccounts([...filtered, newUser]);

    setUser(newUser);
    setPendingOTP(null);
    return newUser;
  };

  // Resend OTP
  const resendOTP = () => {
    if (!pendingOTP) return null;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const updated = {
      ...pendingOTP,
      code: newCode,
      expiresAt: Date.now() + 30 * 1000,
    };
    setPendingOTP(updated);
    return newCode;
  };

  // Login via Email & Password
  const login = (email, password) => {
    const accounts = getAccounts();
    const found = accounts.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    setUser(found);
    return found;
  };

  // Google OAuth Login / Registration Simulation
  const googleLogin = (googleUserData) => {
    const accounts = getAccounts();
    let found = accounts.find((acc) => acc.email.toLowerCase() === googleUserData.email.toLowerCase());

    if (!found) {
      found = {
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        name: googleUserData.name,
        email: googleUserData.email,
        avatar: googleUserData.avatar || 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500',
        bio: googleUserData.bio || 'AI Product Strategist & Developer.',
        isVerified: true,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
        settings: { emailNotifications: true, darkMode: true },
      };
      saveAccounts([...accounts, found]);
    } else {
      // Ensure Google provider & verification marked
      found = {
        ...found,
        isVerified: true,
        authProvider: 'google',
        avatar: googleUserData.avatar || found.avatar,
      };
      const updated = accounts.map((acc) => (acc.id === found.id ? found : acc));
      saveAccounts(updated);
    }

    setUser(found);
    return found;
  };

  // Update Profile
  const updateProfile = (updatedFields) => {
    if (!user) return;

    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    const accounts = getAccounts();
    const updatedAccounts = accounts.map((acc) => (acc.id === user.id ? updatedUser : acc));
    saveAccounts(updatedAccounts);
  };

  // Delete Account
  const deleteAccount = () => {
    if (!user) return;

    const accounts = getAccounts();
    const remaining = accounts.filter((acc) => acc.id !== user.id);
    saveAccounts(remaining);

    setUser(null);
    setPendingOTP(null);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setPendingOTP(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingOTP,
        signup,
        verifyOTP,
        resendOTP,
        login,
        googleLogin,
        updateProfile,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
