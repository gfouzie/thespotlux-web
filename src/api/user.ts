import { config } from "@/lib/config";
import { apiRequest } from "./shared";
import { authApi, type LoginResponse } from "./auth";

/**
 * User registration data interface
 * Uses camelCase (automatically converted to snake_case by API middleware)
 */
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

/**
 * User response interface
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  profileImageUrl: string;
  roleId: number | null;
}

/**
 * API functions for user operations
 */
export const userApi = {
  /**
   * Register a new user
   */
  register: async (userData: RegisterUserData): Promise<User> => {
    return apiRequest<User>(`${config.apiBaseUrl}/api/v1/user`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Register and auto-login user
   */
  registerAndLogin: async (
    userData: RegisterUserData
  ): Promise<LoginResponse> => {
    // First register the user
    await userApi.register(userData);

    // Then login with the same credentials
    return authApi.login({
      email: userData.email,
      password: userData.password,
    });
  },

  /**
   * Get available user roles
   */
  getRoles: async (): Promise<{
    roles: Record<number, string>;
    defaultRole: number;
  }> => {
    return apiRequest(`${config.apiBaseUrl}/api/v1/roles`);
  },

  /**
   * Get user by username (convenience endpoint)
   */
  getUserByUsername: async (username: string): Promise<User> => {
    return apiRequest<User>(
      `${config.apiBaseUrl}/api/v1/user/by-username/${username}`
    );
  },
};
