/**
 * League interface matching the backend LeagueRead schema
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface League {
  id: number;
  name: string;
  sport: string;
  city: string | null;
  country: string | null;
  abbreviation: string | null;
  state: string | null;
  createdAt: string;
}

/**
 * Team interface matching the backend TeamRead schema
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface Team {
  id: number;
  name: string;
  sport: string;
  leagueId: number | null;
  level: string | null;
  profileImageUrl: string | null;
  createdAt: string;
}

/**
 * Position interface matching the backend PositionRead schema
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface Position {
  id: number;
  sport: string;
  name: string;
  abbreviation: string | null;
  createdAt: string;
}

/**
 * UserTeam interface matching the backend UserTeamRead schema
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface UserTeam {
  id: number;
  userId: number;
  teamId: number;
  sport: string;
  yearJoined: number;
  positionId: number | null;
  jerseyNumber: number | null;
  yearLeft: number | null;
  createdAt: string;
}

/**
 * UserTeamFull interface matching the backend UserTeamReadFull schema
 * Contains full nested objects for team, league, and position
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface UserTeamFull {
  id: number;
  userId: number;
  sport: string;
  yearJoined: number;
  jerseyNumber: number | null;
  yearLeft: number | null;
  createdAt: string;
  team: Team;
  league: League | null;
  position: Position | null;
}

/**
 * UserTeamCreate interface for creating a new user team
 * Uses camelCase (automatically converted to snake_case by API middleware)
 */
export interface UserTeamCreate {
  teamId: number;
  sport: string;
  yearJoined: number;
  positionId?: number | null;
  jerseyNumber?: number | null;
  yearLeft?: number | null;
}

/**
 * UserTeamUpdate interface for updating a user team
 * Uses camelCase (automatically converted to snake_case by API middleware)
 */
export interface UserTeamUpdate {
  teamId?: number;
  sport?: string;
  yearJoined?: number;
  positionId?: number | null;
  jerseyNumber?: number | null;
  yearLeft?: number | null;
}
