"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-col text-text-col">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-col border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-col text-text-col">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-col border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (state.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
