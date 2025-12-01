"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { userApi, type User } from "@/api/user";
import { friendshipsApi } from "@/api/friendships";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import SearchInput from "@/components/search/SearchInput";
import UserList from "@/components/search/UserList";
import Pagination from "@/components/search/Pagination";
import RequestsCard from "@/components/search/RequestsCard";
import Alert from "@/components/common/Alert";

type TabType = "all" | "friends";

export default function SearchPage() {
  const { isAuthenticated } = useAuth();
  const { user: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await userApi.getUsers(
        page,
        itemsPerPage,
        debouncedSearch || undefined
      );
      setUsers(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, page, itemsPerPage, debouncedSearch]);

  const loadFriends = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await friendshipsApi.getMyFriends(page, itemsPerPage);
      setUsers(response.data);
      setTotalCount(response.totalCount);
      setFriendsCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, page, itemsPerPage]);

  // Load friends count on mount
  useEffect(() => {
    const loadFriendsCount = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await friendshipsApi.getMyFriends(
          1,
          1 // Only need the count, not the data
        );
        setFriendsCount(response.totalCount);
      } catch (err) {
        console.error("Failed to load friends count:", err);
      }
    };

    loadFriendsCount();
  }, [isAuthenticated]);

  // Load users when search or page changes
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "all") {
        loadUsers();
      } else {
        loadFriends();
      }
    }
  }, [
    isAuthenticated,
    debouncedSearch,
    page,
    activeTab,
    loadUsers,
    loadFriends,
  ]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleStatusChange = async () => {
    // Reload the current list when friendship status changes
    if (activeTab === "all") {
      loadUsers();
    } else {
      loadFriends();
    }

    // Also reload friends count to keep it accurate
    if (isAuthenticated) {
      try {
        const response = await friendshipsApi.getMyFriends(1, 1);
        setFriendsCount(response.totalCount);
      } catch (err) {
        console.error("Failed to reload friends count:", err);
      }
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    setSearchQuery("");
    setDebouncedSearch("");
  };

  const getEmptyMessage = () => {
    if (activeTab === "friends") {
      return "You have no friends yet";
    }
    if (debouncedSearch) {
      return "No users found matching your search";
    }
    return "People you might know";
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-bg-col py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-text-col mb-6">Find People</h1>

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Center - Search & Users (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search Input (only show on "all" tab) */}
              {activeTab === "all" && (
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onDebouncedChange={setDebouncedSearch}
                />
              )}

              {/* Tabs */}
              <div className="flex gap-4 border-b border-bg-col">
                <button
                  onClick={() => handleTabChange("all")}
                  className={`cursor-pointer pb-2 px-4 ${
                    activeTab === "all"
                      ? "border-b-2 border-accent-col text-text-col"
                      : "text-text-col/60 hover:text-text-col"
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => handleTabChange("friends")}
                  className={`cursor-pointer pb-2 px-4 ${
                    activeTab === "friends"
                      ? "border-b-2 border-accent-col text-text-col"
                      : "text-text-col/60 hover:text-text-col"
                  }`}
                >
                  Friends ({friendsCount})
                </button>
              </div>

              {/* User List */}
              <div className="bg-component-col rounded border border-bg-col p-4">
                <UserList
                  users={users}
                  currentUserId={currentUser?.id || 0}
                  isLoading={isLoading}
                  emptyMessage={getEmptyMessage()}
                  onStatusChange={handleStatusChange}
                />
              </div>

              {/* Pagination */}
              {!isLoading && totalCount > 0 && (
                <Pagination
                  currentPage={page}
                  totalCount={totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setPage}
                />
              )}
            </div>

            {/* Right Sidebar - Friend Requests (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <RequestsCard />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
