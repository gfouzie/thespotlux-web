import { config } from "@/lib/config";
import { ApiError, getToken } from "./shared";
import { keysToCamel } from "@/lib/caseConversion";

/**
 * Upload-specific request handler that doesn't set Content-Type for FormData
 * Automatically converts response data from snake_case to camelCase
 * Automatically adds auth token from the token provider
 */
const uploadRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

  // Get token from the global provider
  const token = getToken();
  if (!token) {
    throw new ApiError("Not authenticated", 401);
  }

  // Build headers with Authorization
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      // Don't set Content-Type - let browser set it for FormData
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

/**
 * Upload types for different file categories
 */
export type UploadType = "prompt" | "challenge" | "profile_picture";

/**
 * Upload request interface
 */
export interface UploadRequest {
  file: File;
  type: UploadType;
  metadata?: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  };
}

/**
 * Upload response interface
 * Uses camelCase (automatically converted from snake_case by upload middleware)
 */
export interface UploadResponse {
  message: string;
  filename: string;
  s3Key: string;
  fileUrl: string;
  fileSize: number;
  uploadType: UploadType;
  bucketName: string;
}

/**
 * Profile picture upload response interface
 * Uses camelCase (automatically converted from snake_case by upload middleware)
 */
export interface ProfilePictureUploadResponse {
  message: string;
  profileImageUrl: string;
}

/**
 * Upload API service
 */
export const uploadApi = {
  /**
   * Upload file to S3 based on type
   */
  upload: async (request: UploadRequest): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("type", request.type);

    // Add optional metadata
    if (request.metadata) {
      if (request.metadata.title)
        formData.append("title", request.metadata.title);
      if (request.metadata.description)
        formData.append("description", request.metadata.description);
      if (request.metadata.isPublic !== undefined)
        formData.append("isPublic", String(request.metadata.isPublic));
    }

    return uploadRequest<UploadResponse>(`${config.apiBaseUrl}/api/v1/upload`, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Upload profile picture (convenience method)
   */
  uploadProfilePicture: async (
    file: File
  ): Promise<ProfilePictureUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return uploadRequest<ProfilePictureUploadResponse>(
      `${config.apiBaseUrl}/api/v1/upload/profile-picture`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  /**
   * Delete profile picture (convenience method)
   */
  deleteProfilePicture: async (): Promise<{ message: string }> => {
    return uploadRequest<{ message: string }>(
      `${config.apiBaseUrl}/api/v1/upload/profile-picture`,
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Upload prompt video (convenience method)
   */
  uploadPrompt: async (
    file: File,
    metadata?: UploadRequest["metadata"]
  ): Promise<UploadResponse> => {
    return uploadApi.upload({ file, type: "prompt", metadata });
  },

  /**
   * Upload challenge video (convenience method)
   */
  uploadChallenge: async (
    file: File,
    metadata?: UploadRequest["metadata"]
  ): Promise<UploadResponse> => {
    return uploadApi.upload({ file, type: "challenge", metadata });
  },
};
