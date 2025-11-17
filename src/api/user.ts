import { config } from "@/lib/config";
import { apiRequest, authRequest } from "./shared";
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
  accountId: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  profileImageUrl: string;
  birthday: string | null;
  height: number | null;
  weight: number | null;
  tierId: number | null;
  isSuperuser: boolean;
}

/**
 * Paginated users response interface
 */
export interface PaginatedUsersResponse {
  data: User[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  hasMore: boolean;
}

/**
 * API functions for user operations
 */
export const userApi = {
  /**
   * Register a new user (public endpoint)
   */
  register: async (userData: RegisterUserData): Promise<User> => {
    return apiRequest<User>(`${config.apiBaseUrl}/api/v1/user`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Register and auto-login user (public endpoint)
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
   * Get available user roles (public endpoint)
   */
  getRoles: async (): Promise<{
    roles: Record<number, string>;
    defaultRole: number;
  }> => {
    return apiRequest(`${config.apiBaseUrl}/api/v1/roles`);
  },

  /**
   * Get user by username (public endpoint)
   */
  getUserByUsername: async (username: string): Promise<User> => {
    return apiRequest<User>(
      `${config.apiBaseUrl}/api/v1/user/by-username/${username}`
    );
  },

  /**
   * Get paginated list of users with optional search (authenticated)
   */
  getUsers: async (
    page: number = 1,
    itemsPerPage: number = 20,
    search?: string
  ): Promise<PaginatedUsersResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    return authRequest<PaginatedUsersResponse>(
      `${config.apiBaseUrl}/api/v1/users?${params}`,
      {
        cache: "no-store",
      }
    );
  },
};
