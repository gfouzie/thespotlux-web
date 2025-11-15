"use client";

import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { promptsApi, type Prompt, type PromptCreate } from "@/api/prompts";
import { sportsApi } from "@/api/sports";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import Alert from "@/components/common/Alert";

export default function PromptsPage() {
  const { isLoading: userLoading, isSuperuser } = useUser();
  const { authState } = useAuth();
  const router = useRouter();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    description: "",
  });

  const loadPrompts = useCallback(async () => {
    if (!authState.accessToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await promptsApi.getPrompts(authState.accessToken);
      setPrompts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load prompts");
    } finally {
      setIsLoading(false);
    }
  }, [authState.accessToken]);

  const loadSports = useCallback(async () => {
    try {
      const sportsDict = await sportsApi.getSports();
      // Convert the dictionary values to an array (e.g., ["soccer", "basketball", ...])
      const sportValues = Object.values(sportsDict);
      setSports(sportValues);

      // Set default sport for form if not already set
      if (sportValues.length > 0 && !formData.sport) {
        setFormData(prev => ({ ...prev, sport: sportValues[0] }));
      }
    } catch (err) {
      console.error("Failed to load sports:", err);
      // Don't set error state since this is non-critical
    }
  }, [formData.sport]);

  useEffect(() => {
    if (!userLoading && !isSuperuser) {
      router.push("/");
    }
  }, [userLoading, isSuperuser, router]);

  useEffect(() => {
    if (authState.accessToken && isSuperuser) {
      loadPrompts();
      loadSports();
    }
  }, [authState.accessToken, isSuperuser, loadPrompts, loadSports]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.accessToken) return;

    try {
      setError(null);
      const promptData: PromptCreate = {
        name: formData.name,
        sport: formData.sport,
        description: formData.description || undefined,
      };
      await promptsApi.createPrompt(authState.accessToken, promptData);
      setFormData({ name: "", sport: sports[0] || "", description: "" });
      setShowCreateForm(false);
      await loadPrompts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create prompt");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.accessToken || editingId === null) return;

    try {
      setError(null);
      await promptsApi.updatePrompt(authState.accessToken, editingId, {
        name: formData.name,
        sport: formData.sport,
        description: formData.description || undefined,
      });
      setFormData({ name: "", sport: sports[0] || "", description: "" });
      setEditingId(null);
      await loadPrompts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update prompt");
    }
  };

  const handleDelete = async (id: number) => {
    if (!authState.accessToken) return;
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      setError(null);
      await promptsApi.deletePrompt(authState.accessToken, id);
      await loadPrompts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete prompt");
    }
  };

  const startEdit = (prompt: Prompt) => {
    setFormData({
      name: prompt.name,
      sport: prompt.sport,
      description: prompt.description || "",
    });
    setEditingId(prompt.id);
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setFormData({ name: "", sport: sports[0] || "", description: "" });
    setEditingId(null);
    setShowCreateForm(false);
  };

  if (userLoading) {
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-text-col">Prompts Management</h1>
          {!showCreateForm && !editingId && (
            <Button onClick={() => setShowCreateForm(true)}>
              Create New Prompt
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        {(showCreateForm || editingId !== null) && (
          <form
            onSubmit={editingId !== null ? handleUpdate : handleCreate}
            className="mb-6 p-4 bg-bg-col/30 rounded border border-bg-col"
          >
            <h2 className="text-lg font-semibold text-text-col mb-4">
              {editingId !== null ? "Edit Prompt" : "Create New Prompt"}
            </h2>
            <div className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Select
                label="Sport"
                value={formData.sport}
                onChange={(e) =>
                  setFormData({ ...formData, sport: e.target.value })
                }
                options={
                  sports.length === 0
                    ? [{ value: "", label: "Loading sports..." }]
                    : sports.map((sport) => ({
                        value: sport,
                        label: sport.charAt(0).toUpperCase() + sport.slice(1),
                      }))
                }
                required
              />

              <Textarea
                label="Description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId !== null ? "Update" : "Create"}
                </Button>
                <Button type="button" onClick={cancelEdit} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="text-center text-text-col">Loading prompts...</div>
        ) : prompts.length === 0 ? (
          <div className="text-center text-text-col">
            No prompts found. Create your first prompt!
          </div>
        ) : (
          <div className="space-y-2">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-4 bg-bg-col/30 rounded border border-bg-col hover:bg-bg-col/50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-col">{prompt.name}</h3>
                    <p className="text-sm text-text-col/70">
                      Sport: {prompt.sport.charAt(0).toUpperCase() + prompt.sport.slice(1)}
                    </p>
                    {prompt.description && (
                      <p className="text-sm text-text-col mt-1">{prompt.description}</p>
                    )}
                    <p className="text-xs text-text-col/50 mt-2">
                      Created: {new Date(prompt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(prompt)}
                      variant="secondary"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(prompt.id)}
                      variant="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
