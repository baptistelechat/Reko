"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import tmdbService from "@/services/tmdb";
import { Credits, MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Camera, Edit, Mic, Palette, Users } from "lucide-react";
import { useEffect, useState } from "react";

type ContentCreditsProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

export default function ContentCredits({ type, data }: ContentCreditsProps) {
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            <div className="h-6 w-32 rounded bg-gray-200"></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-2/3 rounded-lg bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-3 w-3/4 rounded bg-gray-200"></div>
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
  const crewByDepartment =
    credits.crew?.reduce((acc, member) => {
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

          <Tabs defaultValue="cast" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cast">
                Distribution ({credits.cast?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="crew">
                Équipe technique ({credits.crew?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cast" className="mt-6">
              {credits.cast && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                  {credits.cast.slice(0, 18).map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="mb-2 aspect-2/3 overflow-hidden rounded-lg bg-gray-100">
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
                      <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
                        {actor.name}
                      </h4>
                      {actor.character && (
                        <p className="line-clamp-2 text-xs text-gray-600">
                          {actor.character}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="crew" className="mt-6">
              {Object.keys(crewByDepartment).length > 0 && (
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
                                    src={tmdbService.getProfileUrl(
                                      member.profile_path
                                    )}
                                    alt={member.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Users className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {member.name}
                                </p>
                                {member.job && (
                                  <p className="truncate text-xs text-gray-600">
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
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </motion.div>
  );
}
