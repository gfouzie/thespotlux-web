"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, ProfileUpdateRequest } from "@/api/profile";
import { profileApi } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";

interface AboutSectionProps {
  isEditMode: boolean;
}

interface EditableFieldProps {
  field: keyof {
    firstName: string;
    lastName: string;
    birthday: string;
    height: string;
    weight: string;
  };
  label: string;
  placeholder?: string;
  value: string;
  onChange: (
    field: keyof {
      firstName: string;
      lastName: string;
      birthday: string;
      height: string;
      weight: string;
    },
    value: string
  ) => void;
  isEditMode: boolean;
  profileValue: string | number | null;
  type?: "text" | "date" | "number";
}

const EditableField: React.FC<EditableFieldProps> = ({
  field,
  label,
  placeholder = `Enter ${label.toLowerCase()}`,
  value,
  onChange,
  isEditMode,
  profileValue,
  type = "text",
}) => (
  <div className="flex items-center space-x-3">
    <div className="flex-1">
      <label className="text-sm font-medium text-text-col">{label}</label>
      {isEditMode ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full px-3 py-2 mt-1 border border-component-col rounded-md bg-card-col text-text-col focus:outline-none focus:ring-2 focus:ring-accent-col focus:border-transparent"
          placeholder={placeholder}
        />
      ) : (
        <p className="text-text-col mt-1">
          {profileValue || `No ${label.toLowerCase()} set`}
        </p>
      )}
    </div>
  </div>
);

const AboutSection: React.FC<AboutSectionProps> = ({ isEditMode }) => {
  const { authState } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    firstName: string;
    lastName: string;
    birthday: string;
    height: string;
    weight: string;
  }>({
    firstName: "",
    lastName: "",
    birthday: "",
    height: "",
    weight: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!authState.accessToken) return;

      try {
        setLoading(true);
        const data = await profileApi.getProfile(authState.accessToken);
        setProfile(data);
        // Initialize edit values with current profile data
        setEditValues({
          firstName: data.firstName,
          lastName: data.lastName,
          birthday: data.birthday || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authState.accessToken]);

  // Check for changes whenever edit values change
  useEffect(() => {
    if (!profile) return;

    const hasChanges =
      editValues.firstName !== profile.firstName ||
      editValues.lastName !== profile.lastName ||
      editValues.birthday !== (profile.birthday || "") ||
      editValues.height !== (profile.height?.toString() || "") ||
      editValues.weight !== (profile.weight?.toString() || "");

    setHasChanges(hasChanges);
  }, [editValues, profile]);

  const handleInputChange = (field: keyof typeof editValues, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!authState.accessToken || !profile || !hasChanges) return;

    try {
      setSaving(true);

      // Prepare update data
      const updateData: ProfileUpdateRequest = {
        firstName: editValues.firstName || null,
        lastName: editValues.lastName || null,
        birthday: editValues.birthday || null,
        height: editValues.height ? parseInt(editValues.height) : null,
        weight: editValues.weight ? parseInt(editValues.weight) : null,
      };

      // Call API to update
      await profileApi.updateProfile(authState.accessToken, updateData);

      // Fetch updated profile after successful update
      const updatedProfile = await profileApi.getProfile(authState.accessToken);

      // Update local state
      setProfile(updatedProfile);
      setHasChanges(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;

    // Reset to original values
    setEditValues({
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthday: profile.birthday || "",
      height: profile.height?.toString() || "",
      weight: profile.weight?.toString() || "",
    });
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="bg-card-col rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-accent-col border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card-col rounded-lg p-6">
        <p className="text-text-col opacity-70">
          Failed to load profile: {error}
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-card-col rounded-lg p-6">
        <p className="text-text-col opacity-70">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card-col rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-col">About</h2>
        {isEditMode && hasChanges && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-text-col opacity-70 hover:opacity-100 transition-opacity"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 text-sm bg-accent-col text-text-col rounded-md hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <EditableField
          field="firstName"
          label="First Name"
          value={editValues.firstName}
          onChange={handleInputChange}
          isEditMode={isEditMode}
          profileValue={profile.firstName}
        />
        <EditableField
          field="lastName"
          label="Last Name"
          value={editValues.lastName}
          onChange={handleInputChange}
          isEditMode={isEditMode}
          profileValue={profile.lastName}
        />
        <EditableField
          field="birthday"
          label="Birthday"
          value={editValues.birthday}
          onChange={handleInputChange}
          isEditMode={isEditMode}
          profileValue={profile.birthday}
          type="date"
        />
        <EditableField
          field="height"
          label="Height (cm)"
          value={editValues.height}
          onChange={handleInputChange}
          isEditMode={isEditMode}
          profileValue={profile.height}
          type="number"
        />
        <EditableField
          field="weight"
          label="Weight (kg)"
          value={editValues.weight}
          onChange={handleInputChange}
          isEditMode={isEditMode}
          profileValue={profile.weight}
          type="number"
        />
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-text-col">
              Username
            </label>
            <p className="text-text-col mt-1">{profile.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-text-col">Email</label>
            <p className="text-text-col mt-1">{profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
