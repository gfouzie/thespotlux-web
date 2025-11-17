"use client";

import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import AboutSection from "@/components/profile/AboutSection";
import ProfilePictureSection from "@/components/profile/ProfilePictureSection";
import FriendsPreview from "@/components/friends/FriendsPreview";
import { profileApi } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";

const ProfilePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const [isEditMode, setIsEditMode] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const data = await profileApi.getProfile();
        setProfileImageUrl(data.profileImageUrl);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  const handleImageUpdate = (newUrl: string) => {
    setProfileImageUrl(newUrl);
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-bg-col py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-text-col">My Profile</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isEditMode
                    ? "bg-component-col text-text-col hover:opacity-80"
                    : "bg-accent-col text-text-col hover:opacity-80"
                }`}
              >
                <span>{isEditMode ? "Preview" : "Edit"}</span>
              </button>
            </div>
          </div>

          {/* Profile Sections */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-accent-col border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <ProfilePictureSection
                profileImageUrl={profileImageUrl}
                onImageUpdate={handleImageUpdate}
                isEditMode={isEditMode}
              />
              <AboutSection isEditMode={isEditMode} />
              {user && (
                <FriendsPreview userId={user.id} isOwnProfile={true} />
              )}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
