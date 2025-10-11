"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoggedOutHeader from "@/components/header/LoggedOutHeader";
import Footer from "@/components/footer";
import LoadingState from "@/components/common/LoadingState";

interface UnauthenticatedLayoutProps {
  children: React.ReactNode;
}

const UnauthenticatedLayout = ({ children }: UnauthenticatedLayoutProps) => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push("/");
    }
  }, [state.isAuthenticated, router]);

  if (state.isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-bg-col text-text-col flex flex-col">
      <LoggedOutHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default UnauthenticatedLayout;
