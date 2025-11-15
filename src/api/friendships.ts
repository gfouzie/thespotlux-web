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
    token: string,
    request: FriendshipSendRequest
  ): Promise<FriendshipSendResponse> {
    return apiRequest<FriendshipSendResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );
  },

  // Get received friend requests
  async getReceivedRequests(
    token: string,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },

  // Get sent friend requests
  async getSentRequests(
    token: string,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },

  // Accept friend request
  async acceptFriendRequest(token: string, friendshipId: number): Promise<Friendship> {
    return apiRequest<Friendship>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/${friendshipId}/accept`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Reject friend request
  async rejectFriendRequest(token: string, friendshipId: number): Promise<Friendship> {
    return apiRequest<Friendship>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/${friendshipId}/reject`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Get my friends list
  async getMyFriends(
    token: string,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },

  // Unfriend a user
  async unfriend(token: string, userId: number): Promise<void> {
    await apiRequest<void>(
      `${config.apiBaseUrl}/api/v1/user/friends/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Get another user's friends list
  async getUserFriends(
    token: string,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },

  // Check friendship status with a user
  async getFriendshipStatus(
    token: string,
    userId: number
  ): Promise<FriendshipStatusResponse> {
    return apiRequest<FriendshipStatusResponse>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/friendship-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },

  // Get mutual friends with a user
  async getMutualFriends(
    token: string,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },
};
