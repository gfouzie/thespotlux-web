"use client";

import LandingPage from "@/components/landing";
import Dashboard from "@/components/dashboard";
import LoadingState from "@/components/common/LoadingState";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingState />;
  }

  if (state.isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <Dashboard />
      </AuthenticatedLayout>
    );
  }

  return (
    <UnauthenticatedLayout>
      <LandingPage />
    </UnauthenticatedLayout>
  );
}
