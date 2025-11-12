import { config } from "@/lib/config";
import { apiRequest } from "./shared";

/**
 * User profile interface
 * Uses camelCase (automatically converted from snake_case by API middleware)
 */
export interface UserProfile {
  id: number;
  accountId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string | null;
  height: number | null;
  weight: number | null;
  profileImageUrl: string;
  tierId: number | null;
}

/**
 * Profile update request interface
 * Uses camelCase (automatically converted to snake_case by API middleware)
 */
export interface ProfileUpdateRequest {
  firstName?: string | null;
  lastName?: string | null;
  birthday?: string | null;
  height?: number | null;
  weight?: number | null;
  profileImageUrl?: string | null;
}

export const profileApi = {
  async getProfile(accessToken: string): Promise<UserProfile> {
    return apiRequest<UserProfile>(`${config.apiBaseUrl}/api/v1/user/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async updateProfile(
    accessToken: string,
    updateData: ProfileUpdateRequest
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `${config.apiBaseUrl}/api/v1/user/me`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );
  },
};
