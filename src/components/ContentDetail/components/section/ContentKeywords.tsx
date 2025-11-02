"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import ContentTitle from "../ContentTitle";

type ContentKeywordsProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

type KeywordData = {
  id: number;
  name: string;
};

type KeywordsResponse = {
  keywords?: KeywordData[]; // Pour les films
  results?: KeywordData[]; // Pour les séries TV
};

export default function ContentKeywords({ type, data }: ContentKeywordsProps) {
  const [keywords, setKeywords] = useState<KeywordsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setIsLoading(true);
        const result =
          type === "movie"
            ? await tmdbService.getMovieKeywords(data.id)
            : await tmdbService.getTVKeywords(data.id);
        setKeywords(result);
      } catch (error) {
        console.error("Error fetching keywords:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.id) fetchKeywords();
  }, [data?.id, type]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 rounded bg-gray-200"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 rounded-full bg-gray-200"
                ></div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Récupérer les mots-clés selon le type de contenu
  const keywordsList =
    type === "movie" ? keywords?.keywords || [] : keywords?.results || [];

  if (!keywordsList.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="p-6">
        <ContentTitle icon={Tag} title={`Mots-clés (${keywordsList.length})`} />

        <div className="flex flex-wrap gap-2">
          {keywordsList.map((keyword) => (
            <span
              key={keyword.id}
              className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-200"
            >
              {keyword.name}
            </span>
          ))}
        </div>

        {/* Information supplémentaire */}
        <div className="mt-4 text-xs text-gray-500">
          Ces mots-clés aident à catégoriser et découvrir du contenu similaire
        </div>
      </Card>
    </motion.div>
  );
}
