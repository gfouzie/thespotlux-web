import { config } from "@/lib/config";
import { authRequest } from "./shared";

/**
 * Prompt category interface
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface PromptCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Prompt category creation request
 */
export interface PromptCategoryCreateRequest {
  name: string;
}

/**
 * Prompt category update request
 */
export interface PromptCategoryUpdateRequest {
  name?: string;
}

/**
 * Paginated response for prompt categories
 */
export interface PaginatedPromptCategoriesResponse {
  data: PromptCategory[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export const promptCategoriesApi = {
  /**
   * Get all prompt categories
   */
  getPromptCategories: async (
    page: number = 1,
    itemsPerPage: number = 100
  ): Promise<PaginatedPromptCategoriesResponse> => {
    return authRequest<PaginatedPromptCategoriesResponse>(
      `${config.apiBaseUrl}/api/v1/prompt_categories?page=${page}&items_per_page=${itemsPerPage}`
    );
  },

  /**
   * Create a new prompt category (superuser only)
   */
  createPromptCategory: async (
    data: PromptCategoryCreateRequest
  ): Promise<PromptCategory> => {
    return authRequest<PromptCategory>(
      `${config.apiBaseUrl}/api/v1/prompt_categories`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update an existing prompt category (superuser only)
   */
  updatePromptCategory: async (
    id: number,
    data: PromptCategoryUpdateRequest
  ): Promise<PromptCategory> => {
    return authRequest<PromptCategory>(
      `${config.apiBaseUrl}/api/v1/prompt_categories/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a prompt category (superuser only)
   */
  deletePromptCategory: async (id: number): Promise<void> => {
    return authRequest<void>(
      `${config.apiBaseUrl}/api/v1/prompt_categories/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
