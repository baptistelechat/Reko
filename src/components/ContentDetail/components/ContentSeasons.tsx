"use client";

import { Card } from "@/components/ui/card";
import { TVShowDetails } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getImageUrl } from "@/utils/getImageUrl";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";

type ContentSeasonsProps = {
  data: TVShowDetails;
};

export default function ContentSeasons({ data }: ContentSeasonsProps) {
  if (!data.seasons || data.seasons.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Tv size={24} />
          Saisons {data.number_of_seasons ? `(${data.number_of_seasons})` : ""}
        </h2>
        <div className="space-y-4">
          {data.seasons
            .filter((season) => season.season_number > 0)
            .slice(0, 5)
            .map((season) => (
              <div
                key={season.id}
                className="flex gap-4 rounded-lg bg-gray-50 p-4"
              >
                <div className="relative h-24 w-16 overflow-hidden rounded bg-linear-to-r from-violet-300 to-orange-300">
                  {season.poster_path && (
                    <img
                      src={getImageUrl(season.poster_path)}
                      alt={season.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{season.name}</h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {season.episode_count} épisode
                    {season.episode_count > 1 ? "s" : ""}
                    {season.air_date && ` • ${formatDate(season.air_date)}`}
                  </p>
                  {season.overview && (
                    <p className="line-clamp-2 text-sm text-gray-700">
                      {season.overview}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </Card>
    </motion.div>
  );
}
