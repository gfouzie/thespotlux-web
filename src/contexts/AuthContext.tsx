"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { authApi, type LoginResponse, type LoginCredentials } from "@/api";

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "LOGIN_SUCCESS"; token: string }
  | { type: "LOGOUT" }
  | { type: "TOKEN_REFRESH"; token: string };

// Auth context interface
interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  isLoading: true, // Start with loading to check for existing auth
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.token,
        isLoading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        isLoading: false,
        error: null,
      };
    case "TOKEN_REFRESH":
      return {
        ...state,
        accessToken: action.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Store access token in memory (not localStorage for security)
  const setAccessToken = useCallback((token: string) => {
    dispatch({ type: "LOGIN_SUCCESS", token });
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "SET_ERROR", error: null });

      const response = await authApi.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", token: response.accessToken });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "SET_ERROR", error: errorMessage });
      throw error; // Re-throw for component handling
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (state.accessToken) {
        await authApi.logout(state.accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, [state.accessToken]);

  // Auto-refresh token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to refresh token using the HTTP-only cookie
        const response = await authApi.refresh();
        dispatch({ type: "TOKEN_REFRESH", token: response.accessToken });
      } catch (error) {
        // No valid refresh token, user is not authenticated
        dispatch({ type: "LOGOUT" });
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiration (every 25 minutes)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        const response = await authApi.refresh();
        dispatch({ type: "TOKEN_REFRESH", token: response.accessToken });
      } catch (error) {
        console.error("Token refresh failed:", error);
        dispatch({ type: "LOGOUT" });
      }
    }, 25 * 60 * 1000); // 25 minutes

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated]);

  const value: AuthContextType = {
    authState: state,
    login,
    logout,
    setAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
