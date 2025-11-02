"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Facebook,
  Film,
  Instagram,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import ContentTitle from "../ContentTitle";

type ContentExternalLinksProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

type ExternalIds = {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
};

export default function ContentExternalLinks({
  type,
  data,
}: ContentExternalLinksProps) {
  const [externalIds, setExternalIds] = useState<ExternalIds | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExternalIds = async () => {
      try {
        setIsLoading(true);
        const result =
          type === "movie"
            ? await tmdbService.getMovieExternalIds(data.id)
            : await tmdbService.getTVExternalIds(data.id);
        setExternalIds(result);
      } catch (error) {
        console.error("Error fetching external IDs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.id) fetchExternalIds();
  }, [data?.id, type]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 rounded bg-gray-200"></div>
            <div className="flex flex-wrap gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-24 rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!externalIds) {
    return null;
  }

  // Configuration des liens externes
  const externalLinks = [
    {
      id: "imdb",
      name: "IMDb",
      url: externalIds.imdb_id
        ? `https://www.imdb.com/title/${externalIds.imdb_id}`
        : null,
      icon: Film,
      color:
        "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200",
      description: "Internet Movie Database",
    },
    {
      id: "facebook",
      name: "Facebook",
      url: externalIds.facebook_id
        ? `https://www.facebook.com/${externalIds.facebook_id}`
        : null,
      icon: Facebook,
      color:
        "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200",
      description: "Page Facebook officielle",
    },
    {
      id: "instagram",
      name: "Instagram",
      url: externalIds.instagram_id
        ? `https://www.instagram.com/${externalIds.instagram_id}`
        : null,
      icon: Instagram,
      color:
        "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200",
      description: "Compte Instagram officiel",
    },
    {
      id: "twitter",
      name: "Twitter",
      url: externalIds.twitter_id
        ? `https://twitter.com/${externalIds.twitter_id}`
        : null,
      icon: Twitter,
      color: "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200",
      description: "Compte Twitter officiel",
    },
    {
      id: "wikidata",
      name: "Wikidata",
      url: externalIds.wikidata_id
        ? `https://www.wikidata.org/wiki/${externalIds.wikidata_id}`
        : null,
      icon: BookOpen,
      color:
        "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200",
      description: "Base de données Wikidata",
    },
  ].filter((link) => link.url); // Filtrer seulement les liens disponibles

  if (externalLinks.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="p-6">
        <ContentTitle icon={ExternalLink} title="Liens externes" />

        <div className="flex flex-wrap gap-3">
          {externalLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200 ${link.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{link.name}</span>
              </motion.a>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
