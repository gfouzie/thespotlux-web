"use client";

import Link from "next/link";
import { User } from "@/api/user";
import FriendButton from "@/components/friends/FriendButton";

interface UserListItemProps {
  user: User;
  isOwnProfile: boolean;
  onStatusChange?: () => void;
}

export default function UserListItem({
  user,
  isOwnProfile,
  onStatusChange,
}: UserListItemProps) {
  return (
    <div className="p-4 bg-bg-col/30 rounded border border-bg-col hover:bg-bg-col/50 transition-colors flex justify-between items-center">
      <Link
        href={`/profile/${user.username}`}
        className="flex items-center gap-3 flex-1"
      >
        <div className="w-12 h-12 rounded-full bg-bg-col overflow-hidden flex-shrink-0">
          {user.profileImageUrl && (
            <img
              src={user.profileImageUrl}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-text-col">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-text-col/60">@{user.username}</div>
        </div>
      </Link>
      {!isOwnProfile && (
        <FriendButton userId={user.id} onStatusChange={onStatusChange} />
      )}
    </div>
  );
}
