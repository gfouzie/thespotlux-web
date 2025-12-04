"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/profile";
import { profileApi } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";

interface ReadOnlyFieldProps {
  label: string;
  value: string | number | null;
}

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-1">
      <label className="text-sm font-medium text-text-col">{label}</label>
      <p className="text-text-col mt-1">
        {value || `No ${label.toLowerCase()} set`}
      </p>
    </div>
  </div>
);

const AboutSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const data = await profileApi.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-text-col">About</h2>
      </div>
      <div className="space-y-4">
        <ReadOnlyField label="First Name" value={profile.firstName} />
        <ReadOnlyField label="Last Name" value={profile.lastName} />
        <ReadOnlyField label="Birthday" value={profile.birthday} />
        <ReadOnlyField label="Height (cm)" value={profile.height} />
        <ReadOnlyField label="Weight (kg)" value={profile.weight} />
        <ReadOnlyField label="Username" value={profile.username} />
        <ReadOnlyField label="Email" value={profile.email} />
      </div>
    </div>
  );
};

export default AboutSection;
