import { config } from "@/lib/config";
import { apiRequest } from "./shared";
import { UserProfile } from "./profile";

export type FriendshipStatus = "pending" | "accepted" | "rejected";

export interface Friendship {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt?: string | null;
}

export interface FriendshipSendRequest {
  addresseeId: number;
}

export interface FriendshipSendResponse extends Friendship {
  autoAccepted: boolean;
}

export interface FriendshipStatusResponse {
  status: "accepted" | "pending" | "none";
  isRequester: boolean;
  friendshipId?: number | null;
}

export interface PaginatedFriendshipsResponse {
  data: Friendship[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  hasMore: boolean;
}

export interface PaginatedUsersResponse {
  data: UserProfile[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  hasMore: boolean;
}

export const friendshipsApi = {
  // Send friend request
  async sendFriendRequest(
    accessToken: string,
    request: FriendshipSendRequest
  ): Promise<FriendshipSendResponse> {
    return apiRequest<FriendshipSendResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests`,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
      accessToken
    );
  },

  // Get received friend requests
  async getReceivedRequests(
    accessToken: string,
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedFriendshipsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return apiRequest<PaginatedFriendshipsResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/received?${params}`,
      {
        cache: "no-store",
      },
      accessToken
    );
  },

  // Get sent friend requests
  async getSentRequests(
    accessToken: string,
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedFriendshipsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return apiRequest<PaginatedFriendshipsResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/sent?${params}`,
      {
        cache: "no-store",
      },
      accessToken
    );
  },

  // Accept friend request
  async acceptFriendRequest(accessToken: string, friendshipId: number): Promise<Friendship> {
    return apiRequest<Friendship>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/${friendshipId}/accept`,
      {
        method: "PATCH",
      },
      accessToken
    );
  },

  // Reject friend request
  async rejectFriendRequest(accessToken: string, friendshipId: number): Promise<Friendship> {
    return apiRequest<Friendship>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/${friendshipId}/reject`,
      {
        method: "PATCH",
      },
      accessToken
    );
  },

  // Get my friends list
  async getMyFriends(
    accessToken: string,
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return apiRequest<PaginatedUsersResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends?${params}`,
      {
        cache: "no-store",
      },
      accessToken
    );
  },

  // Unfriend a user
  async unfriend(accessToken: string, userId: number): Promise<void> {
    await apiRequest<void>(
      `${config.apiBaseUrl}/api/v1/user/friends/${userId}`,
      {
        method: "DELETE",
      },
      accessToken
    );
  },

  // Get another user's friends list
  async getUserFriends(
    accessToken: string,
    userId: number,
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return apiRequest<PaginatedUsersResponse>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/friends?${params}`,
      {
        cache: "no-store",
      },
      accessToken
    );
  },

  // Check friendship status with a user
  async getFriendshipStatus(
    accessToken: string,
    userId: number
  ): Promise<FriendshipStatusResponse> {
    return apiRequest<FriendshipStatusResponse>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/friendship-status`,
      {
        cache: "no-store",
      },
      accessToken
    );
  },

  // Get mutual friends with a user
  async getMutualFriends(
    accessToken: string,
    userId: number,
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return apiRequest<PaginatedUsersResponse>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/mutual-friends?${params}`,
      {
        cache: "no-store",
      },
      accessToken
    );
  },
};
