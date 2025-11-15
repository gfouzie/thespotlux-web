import config from "@/lib/config";
import { keysToCamel, keysToSnake } from "@/lib/caseConversion";

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

    const response = await fetch(
      `${config.apiBaseUrl}/api/v1/prompts?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch prompts");
    }

    const data = await response.json();
    return keysToCamel(data);
  },

  async createPrompt(token: string, prompt: PromptCreate): Promise<Prompt> {
    const response = await fetch(`${config.apiBaseUrl}/api/v1/prompts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keysToSnake(prompt)),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create prompt");
    }

    const data = await response.json();
    return keysToCamel(data);
  },

  async updatePrompt(
    token: string,
    id: number,
    prompt: PromptUpdate
  ): Promise<Prompt> {
    const response = await fetch(`${config.apiBaseUrl}/api/v1/prompts/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keysToSnake(prompt)),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update prompt");
    }

    const data = await response.json();
    return keysToCamel(data);
  },

  async deletePrompt(token: string, id: number): Promise<void> {
    const response = await fetch(`${config.apiBaseUrl}/api/v1/prompts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete prompt");
    }
  },
};
