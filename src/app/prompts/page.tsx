"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

export default function PromptsPage() {
  const { isLoading, isSuperuser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSuperuser) {
      router.push("/");
    }
  }, [isLoading, isSuperuser, router]);

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-text-col">Loading...</div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!isSuperuser) {
    return null;
  }

  return (
    <AuthenticatedLayout>
      <p>Prompt internal tool will go here</p>
    </AuthenticatedLayout>
  );
}
