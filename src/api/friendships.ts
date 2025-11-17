import { config } from "@/lib/config";
import { authRequest } from "./shared";
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
    request: FriendshipSendRequest
  ): Promise<FriendshipSendResponse> {
    return authRequest<FriendshipSendResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  },

  // Get received friend requests
  async getReceivedRequests(
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedFriendshipsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return authRequest<PaginatedFriendshipsResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/received?${params}`,
      {
        cache: "no-store",
      }
    );
  },

  // Get sent friend requests
  async getSentRequests(
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedFriendshipsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return authRequest<PaginatedFriendshipsResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/sent?${params}`,
      {
        cache: "no-store",
      }
    );
  },

  // Accept friend request
  async acceptFriendRequest(friendshipId: number): Promise<Friendship> {
    return authRequest<Friendship>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/${friendshipId}/accept`,
      {
        method: "PATCH",
      }
    );
  },

  // Reject friend request
  async rejectFriendRequest(friendshipId: number): Promise<Friendship> {
    return authRequest<Friendship>(
      `${config.apiBaseUrl}/api/v1/user/friends/requests/${friendshipId}/reject`,
      {
        method: "PATCH",
      }
    );
  },

  // Get my friends list
  async getMyFriends(
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return authRequest<PaginatedUsersResponse>(
      `${config.apiBaseUrl}/api/v1/user/friends?${params}`,
      {
        cache: "no-store",
      }
    );
  },

  // Unfriend a user
  async unfriend(userId: number): Promise<void> {
    await authRequest<void>(
      `${config.apiBaseUrl}/api/v1/user/friends/${userId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Get another user's friends list
  async getUserFriends(
    userId: number,
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return authRequest<PaginatedUsersResponse>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/friends?${params}`,
      {
        cache: "no-store",
      }
    );
  },

  // Check friendship status with a user
  async getFriendshipStatus(
    userId: number
  ): Promise<FriendshipStatusResponse> {
    return authRequest<FriendshipStatusResponse>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/friendship-status`,
      {
        cache: "no-store",
      }
    );
  },

  // Get mutual friends with a user
  async getMutualFriends(
    userId: number,
    page: number = 1,
    itemsPerPage: number = 20
  ): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    return authRequest<PaginatedUsersResponse>(
      `${config.apiBaseUrl}/api/v1/users/${userId}/mutual-friends?${params}`,
      {
        cache: "no-store",
      }
    );
  },
};
