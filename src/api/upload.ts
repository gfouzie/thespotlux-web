import { config } from "@/lib/config";
import { authRequest } from "./shared";

/**
 * Upload types for different file categories
 */
export type UploadType = "prompt" | "challenge" | "profile_picture" | "team_picture";

/**
 * Presigned URL request interface
 */
export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
  uploadType: UploadType;
  teamId?: number;
}

/**
 * Presigned URL response interface
 */
export interface PresignedUrlResponse {
  uploadUrl: string;
  fields: Record<string, string>;
  fileUrl: string;
  s3Key: string;
}

/**
 * Upload completion request interface
 */
export interface UploadCompleteRequest {
  s3Key: string;
  uploadType: UploadType;
  teamId?: number;
}

/**
 * Profile picture upload response interface
 */
export interface ProfilePictureUploadResponse {
  message: string;
  profileImageUrl: string;
}

/**
 * Upload a file directly to S3 using presigned URL
 */
const uploadToS3 = async (
  file: File,
  presignedData: PresignedUrlResponse
): Promise<void> => {
  const formData = new FormData();

  // Add all the fields from presigned URL
  Object.entries(presignedData.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // File must be the last field
  formData.append("file", file);

  const response = await fetch(presignedData.uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`S3 upload failed: ${errorText}`);
  }
};

/**
 * Upload API service
 */
export const uploadApi = {
  /**
   * Upload profile picture using presigned URL flow
   */
  uploadProfilePicture: async (
    file: File
  ): Promise<ProfilePictureUploadResponse> => {
    // Step 1: Request presigned URL from backend
    const presignedRequest: PresignedUrlRequest = {
      filename: file.name,
      contentType: file.type,
      uploadType: "profile_picture",
    };

    const presignedData = await authRequest<PresignedUrlResponse>(
      `${config.apiBaseUrl}/api/v1/upload/presigned-url`,
      {
        method: "POST",
        body: JSON.stringify(presignedRequest),
      }
    );

    // Step 2: Upload directly to S3
    await uploadToS3(file, presignedData);

    // Step 3: Notify backend of completion
    const completeRequest: UploadCompleteRequest = {
      s3Key: presignedData.s3Key,
      uploadType: "profile_picture",
    };

    return authRequest<ProfilePictureUploadResponse>(
      `${config.apiBaseUrl}/api/v1/upload/complete`,
      {
        method: "POST",
        body: JSON.stringify(completeRequest),
      }
    );
  },

  /**
   * Delete profile picture
   */
  deleteProfilePicture: async (): Promise<{ message: string }> => {
    return authRequest<{ message: string }>(
      `${config.apiBaseUrl}/api/v1/upload/profile-picture`,
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Upload team picture using presigned URL flow
   */
  uploadTeamPicture: async (
    teamId: number,
    file: File
  ): Promise<ProfilePictureUploadResponse> => {
    // Step 1: Request presigned URL from backend
    const presignedRequest: PresignedUrlRequest = {
      filename: file.name,
      contentType: file.type,
      uploadType: "team_picture",
      teamId,
    };

    const presignedData = await authRequest<PresignedUrlResponse>(
      `${config.apiBaseUrl}/api/v1/upload/presigned-url`,
      {
        method: "POST",
        body: JSON.stringify(presignedRequest),
      }
    );

    // Step 2: Upload directly to S3
    await uploadToS3(file, presignedData);

    // Step 3: Notify backend of completion
    const completeRequest: UploadCompleteRequest = {
      s3Key: presignedData.s3Key,
      uploadType: "team_picture",
      teamId,
    };

    return authRequest<ProfilePictureUploadResponse>(
      `${config.apiBaseUrl}/api/v1/upload/complete`,
      {
        method: "POST",
        body: JSON.stringify(completeRequest),
      }
    );
  },

  /**
   * Delete team picture
   */
  deleteTeamPicture: async (teamId: number): Promise<{ message: string }> => {
    return authRequest<{ message: string }>(
      `${config.apiBaseUrl}/api/v1/upload/team-picture/${teamId}`,
      {
        method: "DELETE",
      }
    );
  },
};
