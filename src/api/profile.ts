import { config } from "@/lib/config";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  height: number | null;
  weight: number | null;
  hometown: string | null;
  profile_image_url: string | null;
}

export interface ProfileUpdateRequest {
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | null;
  height?: number | null;
  weight?: number | null;
  hometown?: string | null;
}

export const profileApi = {
  async getProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(`${config.apiBaseUrl}/api/v1/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: UserProfile = await response.json();
    return data;
  },

  async updateProfile(
    accessToken: string,
    updateData: ProfileUpdateRequest
  ): Promise<UserProfile> {
    const response = await fetch(`${config.apiBaseUrl}/api/v1/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: UserProfile = await response.json();
    return data;
  },
};
