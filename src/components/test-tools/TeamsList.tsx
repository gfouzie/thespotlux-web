"use client";

import React, { useState, useEffect } from "react";
import { teamsApi } from "@/api/teams";
import { Team } from "@/types/team";
import TeamCard from "@/components/team/TeamCard";

const TeamsList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sports = [
    "all",
    "basketball",
    "soccer",
    "football",
    "baseball",
    "hockey",
    "volleyball",
    "tennis",
    "golf",
  ];

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (!teams || teams.length === 0) {
      setFilteredTeams([]);
      return;
    }

    if (selectedSport === "all") {
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(teams.filter((team) => team.sport === selectedSport));
    }
  }, [selectedSport, teams]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teams = await teamsApi.getAllTeams();
      setTeams(teams);
      setFilteredTeams(teams);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTeams();
  };

  return (
    <div className="bg-component-col rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-col">Teams List</h2>
          <p className="text-text-col/60 text-sm mt-1">
            {filteredTeams?.length || 0} team{filteredTeams?.length !== 1 ? "s" : ""}{" "}
            {selectedSport !== "all" && `in ${selectedSport}`}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-accent-col text-text-col rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Sport Filter */}
      <div className="mb-6">
        <label
          htmlFor="sport-filter"
          className="block text-sm font-medium text-text-col mb-2"
        >
          Filter by Sport
        </label>
        <select
          id="sport-filter"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="w-full max-w-xs px-3 py-2 bg-bg-col text-text-col border border-component-col rounded-md focus:outline-none focus:ring-2 focus:ring-accent-col capitalize"
        >
          {sports.map((sport) => (
            <option key={sport} value={sport} className="capitalize">
              {sport === "all" ? "All Sports" : sport}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md mb-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Teams Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent-col border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !filteredTeams || filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-col/60">
            {selectedSport === "all"
              ? "No teams found. Create your first team above!"
              : `No teams found for ${selectedSport}. Try a different sport or create one!`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={() => console.log("Team clicked:", team)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsList;
