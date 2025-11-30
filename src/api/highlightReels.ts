import { config } from "@/lib/config";
import { authRequest } from "./shared";

/**
 * Highlight reel interface
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface HighlightReel {
  id: number;
  userId: number;
  name: string;
  sport: string;
  orderRanking: number;
  visibility: "private" | "public" | "friends_only";
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Highlight reel creation request
 */
export interface HighlightReelCreateRequest {
  name: string;
  sport: string;
  orderRanking: number;
  visibility?: "private" | "public" | "friends_only";
  thumbnailUrl?: string;
}

/**
 * Highlight reel update request
 */
export interface HighlightReelUpdateRequest {
  name?: string;
  sport?: string;
  orderRanking?: number;
  visibility?: "private" | "public" | "friends_only";
  thumbnailUrl?: string;
}

/**
 * Paginated response for highlight reels
 */
export interface PaginatedHighlightReelsResponse {
  data: HighlightReel[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export const highlightReelsApi = {
  /**
   * Get all highlight reels for the authenticated user
   */
  getHighlightReels: async (
    page: number = 1,
    itemsPerPage: number = 100,
    sport?: string
  ): Promise<PaginatedHighlightReelsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    if (sport) {
      params.append("sport", sport);
    }

    return authRequest<PaginatedHighlightReelsResponse>(
      `${config.apiBaseUrl}/api/v1/highlight_reels?${params}`
    );
  },

  /**
   * Get highlight reels for a specific user by username
   */
  getUserHighlightReels: async (
    username: string,
    page: number = 1,
    itemsPerPage: number = 100,
    sport?: string
  ): Promise<PaginatedHighlightReelsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    if (sport) {
      params.append("sport", sport);
    }

    return authRequest<PaginatedHighlightReelsResponse>(
      `${config.apiBaseUrl}/api/v1/users/${username}/highlight_reels?${params}`
    );
  },

  /**
   * Get a specific highlight reel by ID
   */
  getHighlightReel: async (id: number): Promise<HighlightReel> => {
    return authRequest<HighlightReel>(
      `${config.apiBaseUrl}/api/v1/highlight_reels/${id}`
    );
  },

  /**
   * Create a new highlight reel
   */
  createHighlightReel: async (
    data: HighlightReelCreateRequest
  ): Promise<HighlightReel> => {
    return authRequest<HighlightReel>(
      `${config.apiBaseUrl}/api/v1/highlight_reels`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update an existing highlight reel
   */
  updateHighlightReel: async (
    id: number,
    data: HighlightReelUpdateRequest
  ): Promise<HighlightReel> => {
    return authRequest<HighlightReel>(
      `${config.apiBaseUrl}/api/v1/highlight_reels/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a highlight reel
   */
  deleteHighlightReel: async (id: number): Promise<void> => {
    return authRequest<void>(
      `${config.apiBaseUrl}/api/v1/highlight_reels/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
