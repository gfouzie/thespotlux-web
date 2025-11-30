import { config } from "@/lib/config";
import { authRequest } from "./shared";

export interface Prompt {
  id: number;
  name: string;
  sport: string;
  description?: string;
  createdByUserId: number;
  createdAt: string;
  promptCategoryId?: number;
  promptCategoryName?: string;
  featuredStartDate?: string;
  featuredEndDate?: string;
}

export interface PromptCreate {
  name: string;
  sport: string;
  description?: string;
  promptCategoryId?: number;
  featuredStartDate?: string;
  featuredEndDate?: string;
}

export interface PromptUpdate {
  name?: string;
  sport?: string;
  description?: string;
  promptCategoryId?: number;
  featuredStartDate?: string;
  featuredEndDate?: string;
}

export interface PaginatedPromptsResponse {
  data: Prompt[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  hasMore: boolean;
}

export const promptsApi = {
  async getPrompts(
    page: number = 1,
    itemsPerPage: number = 50,
    sport?: string
  ): Promise<PaginatedPromptsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    if (sport) {
      params.append("sport", sport);
    }

    return authRequest<PaginatedPromptsResponse>(
      `${config.apiBaseUrl}/api/v1/prompts?${params}`,
      {
        cache: "no-store",
      }
    );
  },

  async createPrompt(prompt: PromptCreate): Promise<Prompt> {
    return authRequest<Prompt>(`${config.apiBaseUrl}/api/v1/prompts`, {
      method: "POST",
      body: JSON.stringify(prompt),
    });
  },

  async updatePrompt(id: number, prompt: PromptUpdate): Promise<Prompt> {
    return authRequest<Prompt>(`${config.apiBaseUrl}/api/v1/prompts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(prompt),
    });
  },

  async deletePrompt(id: number): Promise<void> {
    await authRequest<void>(`${config.apiBaseUrl}/api/v1/prompts/${id}`, {
      method: "DELETE",
    });
  },
};
