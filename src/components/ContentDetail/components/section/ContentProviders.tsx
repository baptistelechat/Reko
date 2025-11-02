"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";
import ContentTitle from "../ContentTitle";

type ContentProvidersProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

export default function ContentProviders({
  type,
  data,
}: ContentProvidersProps) {
  // Pour les séries TV, on utilise les networks
  if (type === "tv") {
    const networks = (data as TVShowDetails).networks;

    if (!networks || networks.length === 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <ContentTitle icon={Tv} title="Diffuseurs" />
          <div className="space-y-3">
            {networks.slice(0, 5).map((network) => (
              <div key={network.id} className="flex items-center gap-3">
                {network.logo_path && (
                  <img
                    src={tmdbService.getCompanyLogoUrl(network.logo_path)}
                    alt={network.name}
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {network.name}
                  </span>
                  {network.origin_country && (
                    <span className="text-xs text-gray-500">
                      {network.origin_country}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  return null;
}
