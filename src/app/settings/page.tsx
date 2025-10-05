"use client";

import UserSettings from "@/components/settings/UserSettings";

const SettingsPage = () => {
  // Mock user data - in a real app, this would come from your auth context or API
  const mockUser = {
    id: 1,
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    username: "demo_user",
    email: "demo@example.com",
    first_name: "Demo",
    last_name: "User",
  };

  return <UserSettings user={mockUser} />;
};

export default SettingsPage;
