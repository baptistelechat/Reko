"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tmdbService } from "@/services/tmdb";
import { useAppStore } from "@/store/useAppStore";
import { MovieDetails } from "@/types";
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
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);

  const {
    addToWatchlist,
    addToFavorites,
    removeFromWatchlist,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useAppStore();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inWatchlist = isInWatchlist(movieId, "movie");
  const inFavorites = isInFavorites(movieId, "movie");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const movieData = await tmdbService.getMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        setError("Impossible de charger les détails du film");
        console.error("Error fetching movie details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const handleAddToWatchlist = () => {
    if (!movie) return;

    const watchlistItem = {
      id: movie.id,
      title: movie.title,
      type: "movie" as const,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      addedAt: new Date().toISOString(),
    };

    if (inWatchlist) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      addToWatchlist(watchlistItem);
    }
  };

  const handleAddToFavorites = () => {
    if (!movie) return;

    const favoriteItem = {
      id: movie.id,
      title: movie.title,
      type: "movie" as const,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      addedAt: new Date().toISOString(),
    };

    if (inFavorites) {
      removeFromFavorites(movie.id, "movie");
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const getImageUrl = (
    path: string | null,
    size: "w500" | "w780" | "original" = "w500"
  ) => {
    if (!path) return "/placeholder-poster.jpg";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ""}`;
  };

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto size-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-lg font-medium text-gray-700">
            Chargement des détails...
          </p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
          <div className="text-6xl text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">Film introuvable</h2>
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
      {/* Header avec image de fond */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${getImageUrl(
                movie.backdrop_path,
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
              <div className="shrink-0">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="h-72 w-48 rounded-lg object-cover shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-poster.jpg";
                  }}
                />
              </div>

              {/* Informations */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="mb-2 text-4xl font-bold">{movie.title}</h1>
                  {movie.tagline && (
                    <p className="text-xl text-gray-200 italic">
                      {movie.tagline}
                    </p>
                  )}
                </div>

                {/* Métadonnées */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} />
                    <span>{formatRating(movie.vote_average)}/5</span>
                    <span className="text-gray-300">
                      ({movie.vote_count} votes)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToWatchlist}
                    variant={inWatchlist ? "secondary" : "default"}
                    className="flex items-center gap-2"
                  >
                    {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                    {inWatchlist
                      ? "Dans la watchlist"
                      : "Ajouter à la watchlist"}
                  </Button>

                  <Button
                    onClick={handleAddToFavorites}
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

      {/* Contenu détaillé */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="space-y-8 lg:col-span-2">
            {/* Synopsis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Synopsis
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                  {movie.overview || "Aucun synopsis disponible."}
                </p>
              </Card>
            </motion.div>

            {/* Casting (si disponible) */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Users size={24} />
                    Casting principal
                  </h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {movie.credits.cast.slice(0, 6).map((actor) => (
                      <div key={actor.id} className="text-center">
                        <img
                          src={getImageUrl(actor.profile_path, "w500")}
                          alt={actor.name}
                          className="mx-auto mb-2 size-20 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-avatar.jpg";
                          }}
                        />
                        <p className="text-sm font-semibold">{actor.name}</p>
                        <p className="text-xs text-gray-600">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations techniques */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Informations
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600">
                      Titre original :
                    </span>
                    <p>{movie.original_title}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Statut :
                    </span>
                    <p>{movie.status}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Langue originale :
                    </span>
                    <p>{movie.original_language?.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Budget :
                    </span>
                    <p>
                      {movie.budget > 0
                        ? `$${movie.budget.toLocaleString()}`
                        : "Non communiqué"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Recettes :
                    </span>
                    <p>
                      {movie.revenue > 0
                        ? `$${movie.revenue.toLocaleString()}`
                        : "Non communiqué"}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Sociétés de production */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      Production
                    </h3>
                    <div className="space-y-2">
                      {movie.production_companies.slice(0, 3).map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center gap-3"
                        >
                          {company.logo_path && (
                            <img
                              src={getImageUrl(company.logo_path, "w500")}
                              alt={company.name}
                              className="size-8 object-contain"
                            />
                          )}
                          <span className="text-sm">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
