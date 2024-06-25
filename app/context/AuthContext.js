import { useRouter } from 'next/router';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  userName: null,
  profileImageUrl: null,
  loadedUserData: false,
  login: () => { },
  logout: () => { },
  updateUserData: () => { },
});

const initialUserData = {
  userId: null,
  userName: null,
  profileImageUrl: null,
};

const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(initialUserData);
  const [loadedUserData, setLoadedUserData] = useState(false);

  useEffect(() => {
    const localStorageToken = localStorage.getItem('token') || null;
    const localStorageUserData = localStorage.getItem('userData') || null;

    setIsLoggedIn(!!localStorageToken);
    setToken(localStorageToken);
    setUserData({
      ...initialUserData,
      ...(localStorageUserData && JSON.parse(localStorageUserData)),
    });
    setLoadedUserData(true);
  }, []);

  const login = useCallback((newToken, userData) => {
    setIsLoggedIn(true);
    setToken(newToken);
    setUserData(userData);

    localStorage.setItem('token', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setToken(null);
    setUserData(initialUserData);

    localStorage.clear();
    router.push('/');
  }, [router]);

  const updateUserData = useCallback((newUserData) => {
    setUserData((prevUserData) => {
      const finalUserData = {
        ...prevUserData,
        ...newUserData,
      };

      localStorage.setItem('userData', JSON.stringify(finalUserData));
      return finalUserData;
    });
  }, []);

  const contextValue = useMemo(() => {
    return {
      isLoggedIn,
      token,
      userId: userData.userId,
      userName: userData.userName,
      profileImageUrl: userData.profileImageUrl,
      loadedUserData,
      login,
      logout,
      updateUserData,
    };
  }, [isLoggedIn, token, userData, loadedUserData, login, logout, updateUserData]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export {
  AuthContextProvider,
};
