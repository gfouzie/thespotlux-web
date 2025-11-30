import { config } from "@/lib/config";
import { authRequest } from "./shared";

/**
 * User sport interface
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface UserSport {
  userId: number;
  sport: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * User sport creation request
 */
export interface UserSportCreateRequest {
  sport: string;
  isPrimary?: boolean;
}

export const userSportsApi = {
  /**
   * Get user sports for the authenticated user
   */
  getUserSports: async (): Promise<UserSport[]> => {
    return authRequest<UserSport[]>(
      `${config.apiBaseUrl}/api/v1/user/sports`
    );
  },

  /**
   * Get user sports for a specific user by username
   */
  getUserSportsByUsername: async (username: string): Promise<UserSport[]> => {
    return authRequest<UserSport[]>(
      `${config.apiBaseUrl}/api/v1/users/${username}/sports`
    );
  },

  /**
   * Add a sport to the authenticated user's profile
   */
  addUserSport: async (data: UserSportCreateRequest): Promise<UserSport> => {
    return authRequest<UserSport>(
      `${config.apiBaseUrl}/api/v1/user/sports`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Remove a sport from the authenticated user's profile
   */
  deleteUserSport: async (sport: string): Promise<void> => {
    return authRequest<void>(
      `${config.apiBaseUrl}/api/v1/user/sports/${sport}`,
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Set a sport as primary
   */
  setPrimarySport: async (sport: string): Promise<UserSport> => {
    return authRequest<UserSport>(
      `${config.apiBaseUrl}/api/v1/user/sports/${sport}`,
      {
        method: "PATCH",
        body: JSON.stringify({ isPrimary: true }),
      }
    );
  },
};
