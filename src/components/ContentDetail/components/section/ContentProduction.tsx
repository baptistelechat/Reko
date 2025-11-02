"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import ContentTitle from "../ContentTitle";

type ContentProductionProps = {
  data: MovieDetails | TVShowDetails;
};

export default function ContentProduction({ data }: ContentProductionProps) {
  const productionCompanies = data.production_companies;

  if (!productionCompanies || productionCompanies.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-6">
        <ContentTitle icon={Building2} title="Production" />
        <div className="space-y-3">
          {productionCompanies.slice(0, 5).map((company) => (
            <div key={company.id} className="flex items-center gap-3">
              {company.logo_path && (
                <img
                  src={tmdbService.getCompanyLogoUrl(company.logo_path)}
                  alt={company.name}
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
              <span className="text-sm font-medium text-gray-700">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
