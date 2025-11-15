"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { friendshipsApi, type Friendship, type PaginatedUsersResponse } from "@/api/friendships";
import { UserProfile } from "@/api/profile";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";
import Input from "@/components/common/Input";
import Link from "next/link";

type TabType = "friends" | "received" | "sent";

export default function FriendsPage() {
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const loadFriends = useCallback(async () => {
    if (!authState.accessToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await friendshipsApi.getMyFriends(authState.accessToken, 1, 100);
      setFriends(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  }, [authState.accessToken]);

  const loadReceivedRequests = useCallback(async () => {
    if (!authState.accessToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await friendshipsApi.getReceivedRequests(authState.accessToken, 1, 100);
      setReceivedRequests(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  }, [authState.accessToken]);

  const loadSentRequests = useCallback(async () => {
    if (!authState.accessToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await friendshipsApi.getSentRequests(authState.accessToken, 1, 100);
      setSentRequests(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sent requests");
    } finally {
      setIsLoading(false);
    }
  }, [authState.accessToken]);

  useEffect(() => {
    if (authState.accessToken) {
      switch (activeTab) {
        case "friends":
          loadFriends();
          break;
        case "received":
          loadReceivedRequests();
          break;
        case "sent":
          loadSentRequests();
          break;
      }
    }
  }, [activeTab, authState.accessToken, loadFriends, loadReceivedRequests, loadSentRequests]);

  const handleAcceptRequest = async (friendshipId: number) => {
    if (!authState.accessToken) return;

    try {
      await friendshipsApi.acceptFriendRequest(authState.accessToken, friendshipId);
      await loadReceivedRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept request");
    }
  };

  const handleRejectRequest = async (friendshipId: number) => {
    if (!authState.accessToken) return;

    try {
      await friendshipsApi.rejectFriendRequest(authState.accessToken, friendshipId);
      await loadReceivedRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject request");
    }
  };

  const handleUnfriend = async (userId: number) => {
    if (!authState.accessToken) return;
    if (!confirm("Are you sure you want to unfriend this user?")) return;

    try {
      await friendshipsApi.unfriend(authState.accessToken, userId);
      await loadFriends();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unfriend user");
    }
  };

  const filteredFriends = friends.filter((friend) =>
    `${friend.firstName} ${friend.lastName} ${friend.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-text-col mb-6">Friends</h1>

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-bg-col">
          <button
            onClick={() => setActiveTab("friends")}
            className={`pb-2 px-4 ${
              activeTab === "friends"
                ? "border-b-2 border-accent-col text-text-col"
                : "text-text-col/60 hover:text-text-col"
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`pb-2 px-4 ${
              activeTab === "received"
                ? "border-b-2 border-accent-col text-text-col"
                : "text-text-col/60 hover:text-text-col"
            }`}
          >
            Requests ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`pb-2 px-4 ${
              activeTab === "sent"
                ? "border-b-2 border-accent-col text-text-col"
                : "text-text-col/60 hover:text-text-col"
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div>
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            {isLoading ? (
              <div className="text-center text-text-col">Loading friends...</div>
            ) : filteredFriends.length === 0 ? (
              <div className="text-center text-text-col/50">
                {searchQuery ? "No friends found matching your search" : "You have no friends yet"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 bg-bg-col/30 rounded border border-bg-col hover:bg-bg-col/50 flex justify-between items-center"
                  >
                    <Link
                      href={`/profile/${friend.username}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="w-12 h-12 rounded-full bg-bg-col overflow-hidden">
                        {friend.profileImageUrl && (
                          <img
                            src={friend.profileImageUrl}
                            alt={friend.username}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-col">
                          {friend.firstName} {friend.lastName}
                        </div>
                        <div className="text-sm text-text-col/60">@{friend.username}</div>
                      </div>
                    </Link>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUnfriend(friend.id)}
                    >
                      Unfriend
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Received Requests Tab */}
        {activeTab === "received" && (
          <div>
            {isLoading ? (
              <div className="text-center text-text-col">Loading requests...</div>
            ) : receivedRequests.length === 0 ? (
              <div className="text-center text-text-col/50">No pending friend requests</div>
            ) : (
              <div className="space-y-2">
                {receivedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-bg-col/30 rounded border border-bg-col flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-text-col">User ID: {request.requesterId}</div>
                      <div className="text-sm text-text-col/60">
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sent Requests Tab */}
        {activeTab === "sent" && (
          <div>
            {isLoading ? (
              <div className="text-center text-text-col">Loading sent requests...</div>
            ) : sentRequests.length === 0 ? (
              <div className="text-center text-text-col/50">No pending sent requests</div>
            ) : (
              <div className="space-y-2">
                {sentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-bg-col/30 rounded border border-bg-col flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-text-col">User ID: {request.addresseeId}</div>
                      <div className="text-sm text-text-col/60">
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-text-col/60">Pending</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
