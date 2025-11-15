import { config } from "@/lib/config";
import { keysToCamel, keysToSnake } from "@/lib/caseConversion";

/**
 * API Error class for handling backend errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic API request handler with error handling and timeout
 * Automatically converts request bodies from camelCase to snake_case
 * and response data from snake_case to camelCase
 * @param url - The URL to fetch
 * @param options - Fetch options (method, body, headers, etc.)
 * @param accessToken - Optional JWT access token (will be added as Bearer token)
 */
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.apiTimeout);

  // Convert request body from camelCase to snake_case if present
  const processedOptions: RequestInit = { ...options };
  if (options.body && typeof options.body === "string") {
    try {
      const bodyObj = JSON.parse(options.body);
      const snakeCaseBody = keysToSnake(bodyObj);
      processedOptions.body = JSON.stringify(snakeCaseBody);
    } catch {
      // If body is not JSON, leave it as is
      processedOptions.body = options.body;
    }
  }

  // Build headers with automatic Authorization if accessToken provided
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...processedOptions,
      signal: controller.signal,
      headers,
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

    // Handle empty responses (e.g., 204 No Content, DELETE requests)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // If no JSON content, return empty object or handle as void
      return undefined as T;
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    // Convert response from snake_case to camelCase
    const responseData = JSON.parse(text);
    return keysToCamel(responseData) as T;
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
