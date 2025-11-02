"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import {
  MovieDetails,
  TVShowDetails,
  WatchProvider,
  WatchProvidersResponse,
} from "@/types";
import { getProviderUrl } from "@/utils/getProviderUrl";
import { motion } from "framer-motion";
import { ExternalLink, Popcorn } from "lucide-react";
import { useEffect, useState } from "react";
import ContentTitle from "../ContentTitle";

interface ProviderSectionProps {
  title: string;
  providers: WatchProvider[];
}

function ProviderSection({ title, providers }: ProviderSectionProps) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-gray-600">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => {
          const providerUrl = getProviderUrl(provider.provider_id);

          const content = (
            <>
              <img
                src={tmdbService.getCompanyLogoUrl(provider.logo_path)}
                alt={provider.provider_name}
                className="h-6 w-6 rounded object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <span className="text-sm font-medium text-gray-700">
                {provider.provider_name}
              </span>
            </>
          );

          if (providerUrl) {
            return (
              <a
                key={provider.provider_id}
                href={providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                title={`Ouvrir ${provider.provider_name}`}
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={provider.provider_id}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ContentWatchProvidersProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

export default function ContentWatchProviders({
  type,
  data,
}: ContentWatchProvidersProps) {
  const [watchProviders, setWatchProviders] =
    useState<WatchProvidersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        setLoading(true);
        let response: WatchProvidersResponse;

        if (type === "movie") {
          response = await tmdbService.getMovieWatchProviders(data.id);
        } else {
          response = await tmdbService.getTVWatchProviders(data.id);
        }

        setWatchProviders(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des plateformes:", error);
        setWatchProviders(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchProviders();
  }, [type, data.id]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="mb-4 h-6 w-1/2 rounded bg-gray-200"></div>
            <div className="space-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const frenchProviders = watchProviders?.results?.FR;

  if (
    !frenchProviders ||
    (!frenchProviders.flatrate && !frenchProviders.buy && !frenchProviders.rent)
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="p-6">
        <ContentTitle icon={Popcorn} title="Disponible en France" />

        <div className="space-y-4">
          {frenchProviders.flatrate && frenchProviders.flatrate.length > 0 && (
            <ProviderSection
              title="Streaming (Abonnement)"
              providers={frenchProviders.flatrate}
            />
          )}

          {frenchProviders.rent && frenchProviders.rent.length > 0 && (
            <ProviderSection
              title="Location"
              providers={frenchProviders.rent}
            />
          )}

          {frenchProviders.buy && frenchProviders.buy.length > 0 && (
            <ProviderSection title="Achat" providers={frenchProviders.buy} />
          )}

          {frenchProviders.link && (
            <div className="border-t border-gray-200 pt-2">
              <a
                href={frenchProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
                Voir plus d'options sur TMDB
              </a>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
