import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const logout = () => {
  document.cookie = 'jwt=';
};

const login = (jwt: string) => {
  document.cookie = `jwt=${jwt}`;
};

interface UserData {
  id: number;
}

export interface UserObject {
  user: UserData;
  logout: () => void;
  login: (jwt: string) => void;
  loggedIn: boolean;
}

export const DashformContext = React.createContext<UserObject | null>(null);

export const DashformProvider = ({ children }: any) => {
  const login = async (token: string) => {
    console.log(token);
    document.cookie = `jwt=${token}`;
    setLoggedIn(true);
    const decoded = jwt.decode(token, { complete: true })
      ?.payload as jwt.JwtPayload;
    console.log(decoded);
    const newUser = await axios.post('http://localhost:9876/users', {
      username: decoded!.name,
      email: decoded!.email,
    });
    setUser(newUser);
  };

  const logout = () => {
    setUser('');
    document.cookie = 'jwt=';
    document.location.href = document.location.origin;
  };
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>();
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
    <DashformContext.Provider value={{ user, loggedIn, login, logout }}>
      {children}
    </DashformContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(DashformContext);
  if (context === null) {
    throw new Error('useAuth must be used within a DashformProvider');
  }
  return context;
};
