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
    token: string,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },

  async createPrompt(token: string, prompt: PromptCreate): Promise<Prompt> {
    return apiRequest<Prompt>(`${config.apiBaseUrl}/api/v1/prompts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(prompt),
    });
  },

  async updatePrompt(
    token: string,
    id: number,
    prompt: PromptUpdate
  ): Promise<Prompt> {
    return apiRequest<Prompt>(`${config.apiBaseUrl}/api/v1/prompts/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(prompt),
    });
  },

  async deletePrompt(token: string, id: number): Promise<void> {
    await apiRequest<void>(`${config.apiBaseUrl}/api/v1/prompts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
