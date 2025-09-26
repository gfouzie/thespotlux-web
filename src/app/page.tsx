"use client";

import LandingPage from "@/components/landing";
import Dashboard from "@/components/dashboard";
import LoadingState from "@/components/common/LoadingState";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingState />;
  }

  return state.isAuthenticated ? <Dashboard /> : <LandingPage />;
}
