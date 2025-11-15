"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { profileApi, type UserProfile } from "@/api/profile";
import { useAuth } from "./AuthContext";

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { authState } = useAuth();

  const fetchUserData = useCallback(async (accessToken: string) => {
    try {
      setIsLoading(true);
      const userData = await profileApi.getProfile(accessToken);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (authState.accessToken) {
      await fetchUserData(authState.accessToken);
    }
  }, [authState.accessToken, fetchUserData]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.accessToken) {
      fetchUserData(authState.accessToken);
    } else if (!authState.isLoading) {
      setUser(null);
      setIsLoading(false);
    }
  }, [
    authState.isAuthenticated,
    authState.accessToken,
    authState.isLoading,
    fetchUserData,
  ]);

  const value: UserContextType = {
    user,
    isLoading,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const useUser = () => {
  const { user, isLoading, refreshUser } = useUserContext();
  return {
    user,
    isLoading,
    isSuperuser: user?.isSuperuser ?? false,
    refreshUser,
  };
};
