import React, { useState, ReactNode } from "react";
import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/utils/UseStorageState";
import { loginUser, logoutUser } from "@/api/authHelper";

interface AuthContextProps {
  userData?: any;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  loading: boolean;
  logout: () => void;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return context;
}

export function SessionProvider({ children }: PropsWithChildren<{}>) {
  const [[isLoading, session], setSession] = useStorageState<string>("session");
  const [[loading, userData], setUserData] = useStorageState<any>("user");

  return (
    <AuthContext.Provider
      value={{
        login: async (credentials: { email: string; password: string }) => {
          try {
            const response = await loginUser(credentials);
            if (response) {
              setSession(response.id);
              setUserData(response);
            }
          } catch (e) {
            console.error("Error logging in:", e);
            throw e; // Rethrow the error to be caught by the caller
          }
        },
        logout: () => {
          logoutUser();
          setSession(null);
          setUserData(null);
        },
        userData,
        session,
        isLoading,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}