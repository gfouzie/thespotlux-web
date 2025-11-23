import { config } from "@/lib/config";
import { apiRequest } from "./shared";

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

/**
 * API functions for authentication
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>(`${config.apiBaseUrl}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Logout user
   */
  logout: async (accessToken: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      `${config.apiBaseUrl}/api/v1/logout`,
      {
        method: "POST",
      },
      accessToken
    );
  },

  /**
   * Refresh access token using refresh token
   */
  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>(`${config.apiBaseUrl}/api/v1/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
  },
};
