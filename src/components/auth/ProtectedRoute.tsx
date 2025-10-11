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
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [authState.isLoading, authState.isAuthenticated, router, redirectTo]);

  if (authState.isLoading) {
    return <LoadingState />;
  }

  if (!authState.isAuthenticated) {
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
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && authState.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [authState.isLoading, authState.isAuthenticated, router, redirectTo]);

  if (authState.isLoading) {
    return <LoadingState />;
  }

  if (authState.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
