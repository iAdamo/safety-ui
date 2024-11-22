import React, { useState, createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  authData: { [key: string]: any } | null;
  setAuthData: React.Dispatch<
    React.SetStateAction<{ [key: string]: any } | null>
  >;
}

const AuthContext = createContext<AuthContextType>({
  authData: null,
  setAuthData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<{ [key: string]: any } | null>(null);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
