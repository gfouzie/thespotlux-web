import { config } from "@/lib/config";
import { apiRequest } from "./shared";

export interface Prompt {
  id: number;
  name: string;
  sport: string;
  description?: string;
  createdByUserId: number;
  createdAt: string;
}

export interface PromptCreate {
  name: string;
  sport: string;
  description?: string;
}

export interface PromptUpdate {
  name?: string;
  sport?: string;
  description?: string;
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
    accessToken: string,
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

    return apiRequest<PaginatedPromptsResponse>(
      `${config.apiBaseUrl}/api/v1/prompts?${params}`,
      {
        cache: "no-store",
      },
      accessToken
    );
  },

  async createPrompt(accessToken: string, prompt: PromptCreate): Promise<Prompt> {
    return apiRequest<Prompt>(
      `${config.apiBaseUrl}/api/v1/prompts`,
      {
        method: "POST",
        body: JSON.stringify(prompt),
      },
      accessToken
    );
  },

  async updatePrompt(
    accessToken: string,
    id: number,
    prompt: PromptUpdate
  ): Promise<Prompt> {
    return apiRequest<Prompt>(
      `${config.apiBaseUrl}/api/v1/prompts/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(prompt),
      },
      accessToken
    );
  },

  async deletePrompt(accessToken: string, id: number): Promise<void> {
    await apiRequest<void>(
      `${config.apiBaseUrl}/api/v1/prompts/${id}`,
      {
        method: "DELETE",
      },
      accessToken
    );
  },
};
