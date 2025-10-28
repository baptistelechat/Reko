"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MovieDetails, TVShowDetails } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getImageUrl } from "@/utils/getImageUrl";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Heart,
  Plus,
  Share2,
  Star,
  Tv,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ContentHeaderProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
  title: string;
  backdrop: string | null;
  poster: string | null;
  genres: { id: number; name: string }[];
  voteAverage: number;
  voteCount: number;
  primaryDate: string | undefined;
  inWatchlist: boolean;
  inFavorites: boolean;
  onAddToWatchlist: () => void;
  onAddToFavorites: () => void;
  formatRating: (rating: number) => string;
  formatRuntime: (minutes: number) => string;
  formatEpisodeRuntime: (runtimes: number[]) => string;
  getStatusLabel: (status: string) => string;
};

export default function ContentHeader({
  type,
  data,
  title,
  backdrop,
  poster,
  genres,
  voteAverage,
  voteCount,
  primaryDate,
  inWatchlist,
  inFavorites,
  onAddToWatchlist,
  onAddToFavorites,
  formatRating,
  formatRuntime,
  formatEpisodeRuntime,
  getStatusLabel,
}: ContentHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="relative h-96 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: backdrop
          ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${getImageUrl(
              backdrop,
              "original"
            )})`
          : "linear-gradient(135deg, #8B5CF6, #1E293B)",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation */}
      <div className="relative z-10 p-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour
        </Button>
      </div>

      {/* Informations principales */}
      <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end gap-6 md:flex-row"
          >
            {/* Poster */}
            <div className="h-72 w-48 shrink-0 rounded-lg bg-linear-to-r from-violet-300 to-orange-300 shadow-2xl">
              {poster && (
                <img
                  src={getImageUrl(poster)}
                  alt={title || ""}
                  className="size-full rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
            </div>

            {/* Informations */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="mb-2 text-4xl font-bold">{title}</h1>
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
                    variant="secondary"
                    className="bg-white/20 text-white"
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
                  {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                  {inWatchlist ? "Dans la watchlist" : "Ajouter à la watchlist"}
                </Button>

                <Button
                  onClick={onAddToFavorites}
                  variant={inFavorites ? "secondary" : "outline"}
                  className="flex items-center gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <Heart
                    size={20}
                    className={inFavorites ? "fill-current" : ""}
                  />
                  {inFavorites ? "Favori" : "Favoris"}
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
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
