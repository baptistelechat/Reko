"use client";

import { Button } from "@/components/ui/button";
import { tmdbService } from "@/services/tmdb";
import { useAppStore } from "@/store/useAppStore";
import { MovieDetails, TVShowDetails } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ContentHeader from "./components/ContentHeader";
import ContentInfo from "./components/ContentInfo";
import ContentProduction from "./components/ContentProduction";
import ContentProviders from "./components/ContentProviders";
import ContentSeasons from "./components/ContentSeasons";
import ContentSynopsis from "./components/ContentSynopsis";
import ContentWatchProviders from "./components/ContentWatchProviders";
import ContentCredits from "./components/ContentCredits";
import ContentExternalLinks from "./components/ContentExternalLinks";
import ContentImages from "./components/ContentImages";
import ContentKeywords from "./components/ContentKeywords";
import ContentVideos from "./components/ContentVideos";

type ContentDetailProps = {
  type: "movie" | "tv";
  id: number;
};

export default function ContentDetail({ type, id }: ContentDetailProps) {
  const router = useRouter();
  const {
    addToWatchlist,
    addToFavorites,
    removeFromWatchlist,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useAppStore();

  const [data, setData] = useState<MovieDetails | TVShowDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inWatchlist = isInWatchlist(id, type);
  const inFavorites = isInFavorites(id, type);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const result =
          type === "movie"
            ? await tmdbService.getMovieDetails(id)
            : await tmdbService.getTVShowDetails(id);
        setData(result);
      } catch (err) {
        setError(
          type === "movie"
            ? "Impossible de charger les détails du film"
            : "Impossible de charger les détails de la série"
        );
        console.error("Error fetching details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id, type]);

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      "Returning Series": "En cours",
      Ended: "Terminée",
      Canceled: "Annulée",
      "In Production": "En production",
      Pilot: "Pilote",
    } as const;
    return (statusLabels as Record<string, string>)[status] || status;
  };

  // Data extraction for other components
  const title =
    type === "movie"
      ? (data as MovieDetails | null)?.title
      : (data as TVShowDetails | null)?.name;
  const poster =
    (data as MovieDetails | TVShowDetails | null)?.poster_path ?? null;
  const voteAverage =
    (data as MovieDetails | TVShowDetails | null)?.vote_average ?? 0;
  const primaryDate =
    type === "movie"
      ? (data as MovieDetails | null)?.release_date
      : (data as TVShowDetails | null)?.first_air_date;

  // Event handlers
  const handleAddToWatchlist = () => {
    if (!data) return;

    const common = {
      id,
      title: title || "",
      type,
      poster_path: poster || null,
      release_date: primaryDate || "",
      vote_average: voteAverage,
      addedAt: new Date().toISOString(),
    };

    if (inWatchlist) {
      removeFromWatchlist(id, type);
    } else {
      addToWatchlist(common);
    }
  };

  const handleAddToFavorites = () => {
    if (!data) return;

    const common = {
      id,
      title: title || "",
      type,
      poster_path: poster || null,
      release_date: primaryDate || "",
      vote_average: voteAverage,
      addedAt: new Date().toISOString(),
    };

    if (inFavorites) {
      removeFromFavorites(id, type);
    } else {
      addToFavorites(common);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-24 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto size-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-lg font-medium text-gray-700">
            Chargement des détails...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
          <div className="text-6xl text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === "movie" ? "Film introuvable" : "Série introuvable"}
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={() => router.back()}
            className="bg-primary hover:bg-primary/90"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="from-primary/5 min-h-screen bg-linear-to-br to-orange-600/5 pt-12">
      {/* Header Section */}
      <ContentHeader
        type={type}
        data={data}
        inWatchlist={inWatchlist}
        inFavorites={inFavorites}
        onAddToWatchlist={handleAddToWatchlist}
        onAddToFavorites={handleAddToFavorites}
      />

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Synopsis */}
            <ContentSynopsis type={type} data={data} />

            {/* Credits (Cast & Crew) */}
            <ContentCredits type={type} data={data} />

            {/* Videos (Trailers, Teasers, etc.) */}
            <ContentVideos type={type} data={data} />

            {/* Images (Posters & Backdrops) */}
            <ContentImages type={type} data={data} />

            {/* Seasons (TV only) */}
            {type === "tv" && <ContentSeasons data={data as TVShowDetails} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streaming Providers/Networks */}
            <ContentProviders type={type} data={data} />

            {/* Watch Providers (SVOD Platforms) */}
            <ContentWatchProviders type={type} data={data} />

            <ContentInfo
              type={type}
              data={data}
              getStatusLabel={getStatusLabel}
            />

            {/* Production Companies */}
            <ContentProduction data={data} />

            {/* Keywords */}
            <ContentKeywords type={type} data={data} />

            {/* External Links */}
            <ContentExternalLinks type={type} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
