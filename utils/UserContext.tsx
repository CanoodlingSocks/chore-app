import * as React from 'react'
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextProps {
  userId: number | null;
  updateUser: (newUserId: number | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);

  const updateUser = (newUserId: number | null) => {
    setUserId(newUserId);
  };

  return (
    <UserContext.Provider value={{ userId, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};