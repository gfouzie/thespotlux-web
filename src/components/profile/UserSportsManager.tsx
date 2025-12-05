"use client";

import { useState, useEffect, useCallback } from "react";
import { userSportsApi, UserSport, UserSportCreateRequest } from "@/api/userSports";
import { sportsApi } from "@/api/sports";
import Button from "@/components/common/Button";
import Select from "@/components/common/Select";
import Alert from "@/components/common/Alert";
import { Trophy, Trash } from "iconoir-react";

interface UserSportsManagerProps {
  onSportsUpdate?: () => void;
}

export default function UserSportsManager({ onSportsUpdate }: UserSportsManagerProps) {
  const [userSports, setUserSports] = useState<UserSport[]>([]);
  const [availableSports, setAvailableSports] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sports, sportsDict] = await Promise.all([
        userSportsApi.getUserSports(),
        sportsApi.getSports(),
      ]);

      setUserSports(sports);
      setAvailableSports(Object.values(sportsDict));

      // Set default selection to first available sport not already added
      const userSportNames = sports.map((s) => s.sport);
      const firstAvailable = Object.values(sportsDict).find(
        (s) => !userSportNames.includes(s)
      );
      if (firstAvailable) {
        setSelectedSport(firstAvailable);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSport) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const request: UserSportCreateRequest = {
        sport: selectedSport,
        isPrimary: isPrimary,
      };

      await userSportsApi.addUserSport(request);
      setSuccess(`${selectedSport} added successfully!`);

      // Reset form
      setIsPrimary(false);

      // Reload sports
      await loadData();
      onSportsUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add sport");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSport = async (sport: string) => {
    if (!confirm(`Are you sure you want to remove ${sport} from your profile?`))
      return;

    try {
      setError(null);
      await userSportsApi.deleteUserSport(sport);
      setSuccess(`${sport} removed successfully!`);
      await loadData();
      onSportsUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove sport");
    }
  };

  const handleSetPrimary = async (sport: string) => {
    try {
      setError(null);
      await userSportsApi.setPrimarySport(sport);
      setSuccess(`${sport} set as primary sport!`);
      await loadData();
      onSportsUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set primary sport");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card-col rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-text-col/60">Loading sports...</p>
        </div>
      </div>
    );
  }

  const userSportNames = userSports.map((s) => s.sport);
  const availableToAdd = availableSports.filter(
    (s) => !userSportNames.includes(s)
  );

  return (
    <div className="bg-card-col rounded-lg p-6">
      <h3 className="text-xl font-semibold text-text-col mb-4">My Sports</h3>

      {error && (
        <Alert variant="error" onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} className="mb-4">
          {success}
        </Alert>
      )}

      {/* Current Sports List */}
      {userSports?.length > 0 ? (
        <div className="space-y-2 mb-6">
          {userSports?.map((userSport) => (
            <div
              key={userSport.sport}
              className="flex items-center justify-between p-3 bg-bg-col/30 rounded border border-bg-col"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-text-col/60" />
                <div>
                  <p className="text-text-col font-medium capitalize">
                    {userSport.sport}
                  </p>
                  {userSport?.isPrimary && (
                    <p className="text-xs text-accent-col">Primary Sport</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!userSport?.isPrimary && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSetPrimary(userSport?.sport)}
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteSport(userSport?.sport)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-6 bg-bg-col/30 rounded border border-bg-col">
          <Trophy className="w-12 h-12 text-text-col/20 mx-auto mb-2" />
          <p className="text-text-col/60">No sports added yet</p>
        </div>
      )}

      {/* Add Sport Form */}
      {availableToAdd?.length > 0 ? (
        <form onSubmit={handleAddSport} className="space-y-4">
          <div className="border-t border-bg-col/50 pt-4">
            <h4 className="text-sm font-medium text-text-col mb-3">
              Add New Sport
            </h4>

            <div className="space-y-3">
              <Select
                label="Sport"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                options={availableToAdd.map((sport) => ({
                  value: sport,
                  label: sport.charAt(0).toUpperCase() + sport.slice(1),
                }))}
                required
              />

              <label className="flex items-center gap-2 text-sm text-text-col">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded border-text-col/30 text-accent-col focus:ring-accent-col"
                />
                Set as primary sport
              </label>

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!selectedSport}
              >
                Add Sport
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="border-t border-bg-col/50 pt-4">
          <p className="text-sm text-text-col/60 text-center">
            You&apos;ve added all available sports!
          </p>
        </div>
      )}
    </div>
  );
}
