"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import LoadingState from "@/components/common/LoadingState";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [state.isLoading, state.isAuthenticated, router, redirectTo]);

  if (state.isLoading) {
    return <LoadingState />;
  }

  if (!state.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({
  children,
  redirectTo = "/",
}: PublicRouteProps) => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isLoading && state.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [state.isLoading, state.isAuthenticated, router, redirectTo]);

  if (state.isLoading) {
    return <LoadingState />;
  }

  if (state.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
