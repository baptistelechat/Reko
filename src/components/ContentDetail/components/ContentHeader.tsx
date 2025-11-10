"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTENT_OPTIONS } from "@/constants/contentType";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Plus,
  Share2,
  Star,
  Tv,
} from "lucide-react";

type ContentHeaderProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
  inWatchlist: boolean;
  inFavorites: boolean;
  onAddToWatchlist: () => void;
  onAddToFavorites: () => void;
};

export default function ContentHeader({
  type,
  data,
  inWatchlist,
  inFavorites,
  onAddToWatchlist,
  onAddToFavorites,
}: ContentHeaderProps) {
  // Data extraction
  const title =
    type === "movie"
      ? (data as MovieDetails).title
      : (data as TVShowDetails).name;
  const backdrop = data.backdrop_path;
  const poster = data.poster_path;
  const genres = data.genres;
  const voteAverage = data.vote_average;
  const voteCount = data.vote_count;
  const primaryDate =
    type === "movie"
      ? (data as MovieDetails).release_date
      : (data as TVShowDetails).first_air_date;

  // Utility functions
  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ""}`;
  };

  const formatEpisodeRuntime = (runtimes: number[]) => {
    if (!runtimes || runtimes.length === 0) return "Non spécifié";
    const avgRuntime = Math.round(
      runtimes.reduce((a, b) => a + b, 0) / runtimes.length
    );
    return `~${avgRuntime} min/épisode`;
  };

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

  // Obtenir l'icône de contenu
  const ContentTypeIcon = CONTENT_OPTIONS.find((opt) => opt.id === type)?.icon;

  return (
    <div
      className="relative h-96 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: backdrop
          ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${tmdbService.getBackdropUrl(
              backdrop
            )})`
          : "linear-gradient(135deg, #8B5CF6, #1E293B)",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      {/* Informations principales */}
      <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end gap-6 md:flex-row"
          >
            {/* Poster */}
            <div className="relative h-72 w-48 shrink-0 rounded-lg bg-linear-to-r from-violet-300 to-orange-300 shadow-2xl">
              {poster ? (
                <img
                  src={tmdbService.getPosterUrl(poster)}
                  alt={title || ""}
                  className="size-full rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                ContentTypeIcon && (
                  <div className="absolute top-3 left-3 rounded-full bg-black/70 p-2 backdrop-blur-sm">
                    <ContentTypeIcon className="h-5 w-5 text-white" />
                  </div>
                )
              )}
            </div>

            {/* Informations */}
            <div className="flex-1 space-y-4">
              <div>
<h1 className="mb-2 text-4xl">{title}</h1>
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={16} />
                  <span>{formatRating(voteAverage)}/5</span>
                  <span className="text-gray-300">({voteCount} votes)</span>
                </div>
                {primaryDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(primaryDate)}</span>
                  </div>
                )}
                {type === "movie" && (data as MovieDetails).runtime ? (
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{formatRuntime((data as MovieDetails).runtime)}</span>
                  </div>
                ) : null}
                {type === "tv" && (data as TVShowDetails).episode_run_time ? (
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>
                      {formatEpisodeRuntime(
                        (data as TVShowDetails).episode_run_time
                      )}
                    </span>
                  </div>
                ) : null}
                {type === "tv" ? (
                  <div className="flex items-center gap-1">
                    <Tv size={16} />
                    <span>
                      {(data as TVShowDetails).number_of_seasons} saison
                      {(data as TVShowDetails).number_of_seasons > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="outline"
                    className="border border-white bg-transparent text-white"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Statut TV */}
              {type === "tv" && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      (data as TVShowDetails).status === "Ended"
                        ? "destructive"
                        : "default"
                    }
                    className={
                      (data as TVShowDetails).status === "Ended"
                        ? "bg-red-600"
                        : "bg-green-600"
                    }
                  >
                    {getStatusLabel((data as TVShowDetails).status)}
                  </Badge>
                  {(data as TVShowDetails).in_production && (
                    <Badge variant="secondary" className="bg-blue-600">
                      En production
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={onAddToWatchlist}
                  variant={inWatchlist ? "secondary" : "default"}
                  className="flex items-center gap-2"
                >
                  {inWatchlist ? <Eye size={20} /> : <Plus size={20} />}
                  {inWatchlist ? "Dans la watchlist" : "Ajouter à la watchlist"}
                </Button>

                <Button
                  onClick={onAddToFavorites}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Heart
                    size={20}
                    className={inFavorites ? "fill-red-500 text-red-500" : ""}
                  />
                  {inFavorites ? "Favori" : "Ajouter aux Favoris"}
                </Button>

                <Button variant="secondary">
                  <Share2 size={20} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
