"use client";

import React, { useState, useEffect } from "react";
import { EditPencil } from "iconoir-react";
import { UserProfile } from "@/api/profile";
import { profileApi } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import FriendsListModal from "@/components/friends/FriendsListModal";
import EditProfileModal from "@/components/profile/EditProfileModal";

interface ProfilePictureSectionProps {
  profileImageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  userId: number;
  isOwnProfile?: boolean;
}

/**
 * Get user initials for placeholder
 */
const getUserInitials = (firstName: string | null, lastName: string | null): string => {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";

  if (first && last) {
    return (first[0] + last[0]).toUpperCase();
  } else if (first) {
    return first.substring(0, 2).toUpperCase();
  } else if (last) {
    return last.substring(0, 2).toUpperCase();
  }
  return "??";
};

/**
 * Get full name for display
 */
const getFullName = (firstName: string | null, lastName: string | null): string => {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";

  if (first && last) {
    return `${first} ${last}`;
  } else if (first) {
    return first;
  } else if (last) {
    return last;
  }
  return "User";
};

/**
 * Format birthday for display
 */
const formatBirthday = (birthday: string | null): string => {
  if (!birthday) return "Not set";

  try {
    const date = new Date(birthday);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return "Not set";
  }
};

/**
 * Format height in cm to feet and inches
 */
const formatHeight = (heightCm: number | null): string => {
  if (!heightCm) return "Not set";

  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return `${feet}'${inches}"`;
};

/**
 * Format weight in kg to lbs
 */
const formatWeight = (weightKg: number | null): string => {
  if (!weightKg) return "Not set";

  const lbs = Math.round(weightKg * 2.20462);
  return `${lbs} lbs`;
};

const formatHometown = (city: string | null, state: string | null, country: string | null): string => {
  const parts = [city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not set";
};

const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  profileImageUrl,
  firstName,
  lastName,
  userId,
  isOwnProfile = false,
}) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const initials = getUserInitials(firstName, lastName);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const data = await profileApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="bg-card-col rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-accent-col border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card-col rounded-lg p-6 relative">
        {/* Edit Icon */}
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer absolute top-4 right-4 p-2 text-text-col opacity-70 hover:opacity-100 hover:bg-component-col/50 rounded-full transition-all"
          >
            <EditPencil className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Left: Profile Picture and Friends Link */}
            <div className="flex flex-col flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-component-col mb-3">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent-col/20">
                    <span className="text-2xl font-semibold text-text-col">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowFriendsModal(true)}
                className="cursor-pointer text-sm text-accent-col hover:text-accent-col/80 transition-colors font-medium text-left"
              >
                View all friends
              </button>
            </div>

            {/* Middle: First Name and Last Name stacked */}
            <div className="flex flex-col justify-center">
              <div className="text-lg md:text-xl font-semibold text-text-col">
                {firstName}
              </div>
              <div className="text-xl md:text-3xl font-bold text-text-col">
                {lastName}
              </div>
            </div>
          </div>

          {/* Right: Stats vertically aligned */}
          <div className="flex flex-col gap-1 text-right mt-8">
            <div className="flex items-center justify-end">
              <span className="hidden md:flex text-sm text-text-col opacity-70">Born: </span>
              <span className="text-sm text-text-col">{formatBirthday(profile?.birthday || null)}</span>
            </div>
            <div className="flex items-center justify-end">
              <span className="hidden md:block text-sm text-text-col opacity-70">Height: </span>
              <span className="text-sm text-text-col">{formatHeight(profile?.height || null)}</span>
            </div>
            <div className="flex items-center justify-end">
              <span className="hidden md:block text-sm text-text-col opacity-70">Weight: </span>
              <span className="text-sm text-text-col">{formatWeight(profile?.weight || null)}</span>
            </div>
            <div className="flex items-center justify-end">
              <span className="hidden md:block text-sm text-text-col opacity-70">Hometown: </span>
              <span className="text-sm text-text-col">
                {formatHometown(profile?.hometownCity || null, profile?.hometownState || null, profile?.hometownCountry || null)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Friends List Modal */}
      <FriendsListModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        userId={userId}
        isOwnProfile={isOwnProfile}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default ProfilePictureSection;

