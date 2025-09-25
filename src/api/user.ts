import { config } from "@/lib/config";
import { apiRequest } from "./shared";
import { authApi, type LoginResponse } from "./auth";

/**
 * User registration data interface
 */
export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

/**
 * User response interface
 */
export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  profile_image_url: string;
  role_id: number | null;
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
    default_role: number;
  }> => {
    return apiRequest(`${config.apiBaseUrl}/api/v1/roles`);
  },
};
