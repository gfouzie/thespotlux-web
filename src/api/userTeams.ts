import { config } from "@/lib/config";
import { apiRequest } from "./shared";
import type {
  UserTeam,
  UserTeamFull,
  UserTeamCreate,
  UserTeamUpdate,
} from "@/types/team";

/**
 * API functions for user team operations
 */
export const userTeamsApi = {
  /**
   * Get all teams for the current authenticated user with basic info (IDs only)
   */
  getUserTeams: async (): Promise<UserTeam[]> => {
    return apiRequest<UserTeam[]>(`${config.apiBaseUrl}/api/v1/user/teams`);
  },

  /**
   * Get all teams for the current authenticated user with full team, league, and position objects
   * This endpoint returns complete team information in a single API call, avoiding the need
   * for multiple requests to fetch team and league details separately.
   */
  getUserTeamsFull: async (): Promise<UserTeamFull[]> => {
    return apiRequest<UserTeamFull[]>(
      `${config.apiBaseUrl}/api/v1/user/teams/full`
    );
  },

  /**
   * Get all teams for a specific user by user ID with basic info (IDs only)
   */
  getUserTeamsByUserId: async (userId: number): Promise<UserTeam[]> => {
    return apiRequest<UserTeam[]>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/teams`
    );
  },

  /**
   * Get all teams for a specific user by user ID with full team, league, and position objects
   * This endpoint returns complete team information in a single API call, avoiding the need
   * for multiple requests to fetch team and league details separately.
   */
  getUserTeamsByUserIdFull: async (userId: number): Promise<UserTeamFull[]> => {
    return apiRequest<UserTeamFull[]>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/teams/full`
    );
  },

  /**
   * Get a specific user team by ID
   */
  getUserTeam: async (userTeamId: number): Promise<UserTeam> => {
    return apiRequest<UserTeam>(
      `${config.apiBaseUrl}/api/v1/user/teams/${userTeamId}`
    );
  },

  /**
   * Create a new user team for the current user
   */
  createUserTeam: async (teamData: UserTeamCreate): Promise<UserTeam> => {
    return apiRequest<UserTeam>(`${config.apiBaseUrl}/api/v1/user/teams`, {
      method: "POST",
      body: JSON.stringify(teamData),
    });
  },

  /**
   * Update an existing user team
   */
  updateUserTeam: async (
    userTeamId: number,
    teamData: UserTeamUpdate
  ): Promise<UserTeam> => {
    return apiRequest<UserTeam>(
      `${config.apiBaseUrl}/api/v1/user/teams/${userTeamId}`,
      {
        method: "PATCH",
        body: JSON.stringify(teamData),
      }
    );
  },

  /**
   * Delete a user team
   */
  deleteUserTeam: async (userTeamId: number): Promise<void> => {
    return apiRequest<void>(
      `${config.apiBaseUrl}/api/v1/user/teams/${userTeamId}`,
      {
        method: "DELETE",
      }
    );
  },
};
