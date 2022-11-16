import React, { useEffect, useState } from 'react';

const logout = () => {
  document.cookie = 'jwt=';
};

const login = (jwt: string) => {
  document.cookie = `jwt=${jwt}`;
};

export interface UserObject {
  user: string;
  logout: () => void;
  login: (jwt: string) => void;
  loggedIn: boolean;
}

export const UserContext = React.createContext<UserObject | null>(null);

export const UserProvider = ({ children }: any) => {
  const login = (jwt: string) => {
    document.cookie = `jwt=${jwt}`;
    setLoggedIn(true);
    setUser(jwt);
  };

  const logout = () => {
    setUser('');
    document.cookie = 'jwt=';
    document.location.href = 'http://localhost:3000';
  };
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [value, setValue] = useState({ user, loggedIn, login, logout });
  useEffect(() => {
    const jwt = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1];

    if (jwt) {
      login(jwt);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(UserContext);
  if (context === null) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};
