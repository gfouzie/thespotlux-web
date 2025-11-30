import { config } from "@/lib/config";
import { authRequest } from "./shared";

/**
 * Highlight interface
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface Highlight {
  id: number;
  highlightReelId: number;
  videoUrl: string;
  thumbnailUrl?: string;
  orderIndex: number;
  promptId?: number;
  promptName?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Highlight creation request
 */
export interface HighlightCreateRequest {
  highlightReelId: number;
  videoUrl: string;
  thumbnailUrl?: string;
  orderIndex: number;
  promptId?: number;
}

/**
 * Highlight update request
 */
export interface HighlightUpdateRequest {
  videoUrl?: string;
  thumbnailUrl?: string;
  orderIndex?: number;
  promptId?: number;
}

/**
 * Highlight reorder item
 */
export interface HighlightReorderItem {
  highlightId: number;
  orderIndex: number;
}

/**
 * Bulk reorder request
 */
export interface HighlightBulkReorderRequest {
  highlightReelId: number;
  reorders: HighlightReorderItem[];
}

/**
 * Paginated response for highlights
 */
export interface PaginatedHighlightsResponse {
  data: Highlight[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export const highlightsApi = {
  /**
   * Get all highlights for a specific reel
   */
  getHighlightsByReel: async (
    reelId: number,
    page: number = 1,
    itemsPerPage: number = 100
  ): Promise<PaginatedHighlightsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
      highlight_reel_id: reelId.toString(),
    });

    return authRequest<PaginatedHighlightsResponse>(
      `${config.apiBaseUrl}/api/v1/highlights?${params}`
    );
  },

  /**
   * Get a specific highlight by ID
   */
  getHighlight: async (id: number): Promise<Highlight> => {
    return authRequest<Highlight>(
      `${config.apiBaseUrl}/api/v1/highlights/${id}`
    );
  },

  /**
   * Create a new highlight
   */
  createHighlight: async (
    data: HighlightCreateRequest
  ): Promise<Highlight> => {
    return authRequest<Highlight>(
      `${config.apiBaseUrl}/api/v1/highlights`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update an existing highlight
   */
  updateHighlight: async (
    id: number,
    data: HighlightUpdateRequest
  ): Promise<Highlight> => {
    return authRequest<Highlight>(
      `${config.apiBaseUrl}/api/v1/highlights/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a highlight
   */
  deleteHighlight: async (id: number): Promise<void> => {
    return authRequest<void>(
      `${config.apiBaseUrl}/api/v1/highlights/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Bulk reorder highlights in a reel
   */
  bulkReorderHighlights: async (
    data: HighlightBulkReorderRequest
  ): Promise<void> => {
    return authRequest<void>(
      `${config.apiBaseUrl}/api/v1/highlights/reorder`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};
