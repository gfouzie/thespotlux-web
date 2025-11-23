import { config } from "@/lib/config";
import { authRequest } from "./shared";
import { Team } from "@/types/team";

/**
 * Team creation data interface
 * Uses camelCase (automatically converted to snake_case by API middleware)
 */
export interface CreateTeamData {
  name: string;
  sport: string;
  leagueId?: number | null;
  level?: string | null;
}

/**
 * Team update data interface
 * Uses camelCase (automatically converted to snake_case by API middleware)
 */
export interface UpdateTeamData {
  name?: string;
  sport?: string;
  leagueId?: number | null;
  level?: string | null;
  profileImageUrl?: string | null;
}

/**
 * API functions for team operations
 */
export const teamsApi = {
  /**
   * Create a new team
   */
  createTeam: async (data: CreateTeamData): Promise<Team> => {
    return authRequest<Team>(`${config.apiBaseUrl}/api/v1/teams`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a team by ID
   */
  getTeam: async (teamId: number): Promise<Team> => {
    return authRequest<Team>(`${config.apiBaseUrl}/api/v1/teams/${teamId}`);
  },

  /**
   * Update a team
   */
  updateTeam: async (teamId: number, data: UpdateTeamData): Promise<Team> => {
    return authRequest<Team>(`${config.apiBaseUrl}/api/v1/teams/${teamId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a team
   */
  deleteTeam: async (teamId: number): Promise<void> => {
    return authRequest<void>(`${config.apiBaseUrl}/api/v1/teams/${teamId}`, {
      method: "DELETE",
    });
  },

  /**
   * Get all teams
   */
  getAllTeams: async (): Promise<Team[]> => {
    return authRequest<Team[]>(`${config.apiBaseUrl}/api/v1/teams`);
  },
};
