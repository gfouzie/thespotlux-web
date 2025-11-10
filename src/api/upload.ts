import { config } from "@/lib/config";
import { ApiError } from "./shared";

/**
 * Upload-specific request handler that doesn't set Content-Type for FormData
 */
const uploadRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
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
 */
export interface UploadResponse {
  message: string;
  filename: string;
  s3_key: string;
  file_url: string;
  file_size: number;
  upload_type: UploadType;
  bucket_name: string;
}

/**
 * Profile picture upload response interface
 */
export interface ProfilePictureUploadResponse {
  message: string;
  profile_image_url: string;
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
    file: File,
    accessToken: string
  ): Promise<ProfilePictureUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return uploadRequest<ProfilePictureUploadResponse>(
      `${config.apiBaseUrl}/api/v1/upload/profile-picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );
  },

  /**
   * Delete profile picture (convenience method)
   */
  deleteProfilePicture: async (
    accessToken: string
  ): Promise<{ message: string }> => {
    return uploadRequest<{ message: string }>(
      `${config.apiBaseUrl}/api/v1/upload/profile-picture`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
