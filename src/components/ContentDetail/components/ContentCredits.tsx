"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { Credits, MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Users, Camera, Mic, Edit, Palette } from "lucide-react";
import { useEffect, useState } from "react";

type ContentCreditsProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

export default function ContentCredits({ type, data }: ContentCreditsProps) {
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cast" | "crew">("cast");

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setIsLoading(true);
        const result =
          type === "movie"
            ? await tmdbService.getMovieCredits(data.id)
            : await tmdbService.getTVShowCredits(data.id);
        setCredits(result);
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.id) fetchCredits();
  }, [data?.id, type]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!credits || (!credits.cast?.length && !credits.crew?.length)) {
    return null;
  }

  // Grouper l'équipe technique par département
  const crewByDepartment = credits.crew?.reduce((acc, member) => {
    const dept = member.department || "Autre";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, typeof credits.crew>) || {};

  // Icônes pour les départements
  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case "directing":
        return <Camera className="h-4 w-4" />;
      case "sound":
        return <Mic className="h-4 w-4" />;
      case "editing":
        return <Edit className="h-4 w-4" />;
      case "art":
      case "costume & make-up":
        return <Palette className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Distribution et équipe
          </h3>
          
          {/* Onglets */}
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("cast")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "cast"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Distribution ({credits.cast?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("crew")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "crew"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Équipe technique ({credits.crew?.length || 0})
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "cast" && credits.cast && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {credits.cast.slice(0, 18).map((actor) => (
              <div key={actor.id} className="text-center">
                <div className="mb-2 aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
                  {actor.profile_path ? (
                    <img
                      src={tmdbService.getProfileUrl(actor.profile_path)}
                      alt={actor.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {actor.name}
                </h4>
                {actor.character && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {actor.character}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "crew" && Object.keys(crewByDepartment).length > 0 && (
          <div className="space-y-6">
            {Object.entries(crewByDepartment)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([department, members]) => (
                <div key={department}>
                  <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
                    {getDepartmentIcon(department)}
                    {department}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {members.slice(0, 9).map((member, index) => (
                      <div
                        key={`${member.id}-${index}`}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                      >
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                          {member.profile_path ? (
                            <img
                              src={tmdbService.getProfileUrl(member.profile_path)}
                              alt={member.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Users className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.name}
                          </p>
                          {member.job && (
                            <p className="text-xs text-gray-600 truncate">
                              {member.job}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}