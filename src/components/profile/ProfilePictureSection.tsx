"use client";

import React, { useState, useRef } from "react";
import { Camera, Trash, UploadSquare, Xmark } from "iconoir-react";
import { uploadApi } from "@/api/upload";
import { useAuth } from "@/contexts/AuthContext";

interface ProfilePictureSectionProps {
  profileImageUrl: string;
  onImageUpdate: (newUrl: string) => void;
  isEditMode: boolean;
}

const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  profileImageUrl,
  onImageUpdate,
  isEditMode,
}) => {
  const { isAuthenticated } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !isAuthenticated) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 10MB. Please choose a smaller image.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const response = await uploadApi.uploadProfilePicture(
        file
      );

      onImageUpdate(response.profileImageUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload profile picture"
      );
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) return;

    try {
      setUploading(true);
      setError(null);

      await uploadApi.deleteProfilePicture();

      onImageUpdate("https://profileimageurl.com");
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete profile picture"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-card-col rounded-lg p-6">
      <h2 className="text-xl font-semibold text-text-col mb-4">
        Profile Picture
      </h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture Display */}
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-component-col bg-component-col">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/160?text=No+Image";
              }}
            />
          </div>

          {/* Edit Overlay (only in edit mode) */}
          {isEditMode && !uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleUploadClick}
                className="p-3 bg-accent-col rounded-full hover:opacity-80 transition-opacity"
                aria-label="Upload new picture"
              >
                <Camera className="w-6 h-6 text-text-col" />
              </button>
            </div>
          )}

          {/* Uploading Spinner */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-accent-col border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Action Buttons (only in edit mode) */}
        {isEditMode && (
          <div className="flex items-center space-x-3">
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-col text-text-col rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadSquare className="w-4 h-4" />
                <span>Upload New</span>
              </button>

            {profileImageUrl && profileImageUrl !== "https://profileimageurl.com" && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-component-col text-text-col rounded-md hover:bg-red-500/20 hover:border-red-500 border border-component-col transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash className="w-4 h-4" />
                <span>Remove</span>
              </button>
            )}
          </div>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {/* Error Message */}
        {error && (
          <div className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* File Requirements */}
        {isEditMode && (
          <div className="w-full p-3 bg-component-col/30 rounded-md">
            <p className="text-xs text-text-col opacity-70 text-center">
              Accepted formats: JPEG, PNG, GIF, WebP
              <br />
              Maximum size: 10MB
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-col rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-col">
                Delete Profile Picture
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-text-col opacity-70 hover:opacity-100"
              >
                <Xmark className="w-5 h-5" />
              </button>
            </div>

            <p className="text-text-col opacity-70 mb-6">
              Are you sure you want to delete your profile picture? This action
              cannot be undone.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-component-col text-text-col rounded-md hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {uploading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureSection;

