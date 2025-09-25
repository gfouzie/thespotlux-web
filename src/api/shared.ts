import { config } from "@/lib/config";

/**
 * API Error class for handling backend errors
 */
export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic API request handler with error handling and timeout
 */
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.apiTimeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
};
