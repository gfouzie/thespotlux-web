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
  access_token: string;
  token_type: string;
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
      credentials: "include", // Include cookies for refresh token
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include", // Include cookies for refresh token
      }
    );
  },

  /**
   * Refresh access token
   */
  refresh: async (): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>(`${config.apiBaseUrl}/api/v1/refresh`, {
      method: "POST",
      credentials: "include", // Include cookies for refresh token
    });
  },
};
