"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tmdbService } from "@/services/tmdb";
import { useAppStore } from "@/store/useAppStore";
import { TVShowDetails } from "@/types";
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
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TVShowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tvId = parseInt(params.id as string);

  const {
    addToWatchlist,
    addToFavorites,
    removeFromWatchlist,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useAppStore();

  const [tvShow, setTVShow] = useState<TVShowDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inWatchlist = isInWatchlist(tvId, "tv");
  const inFavorites = isInFavorites(tvId, "tv");

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        setIsLoading(true);
        const tvData = await tmdbService.getTVShowDetails(tvId);
        setTVShow(tvData);
      } catch (err) {
        setError("Impossible de charger les détails de la série");
        console.error("Error fetching TV show details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (tvId) {
      fetchTVShowDetails();
    }
  }, [tvId]);

  const handleAddToWatchlist = () => {
    if (!tvShow) return;

    const watchlistItem = {
      id: tvShow.id,
      title: tvShow.name,
      type: "tv" as const,
      poster_path: tvShow.poster_path,
      release_date: tvShow.first_air_date,
      vote_average: tvShow.vote_average,
      addedAt: new Date().toISOString(),
    };

    if (inWatchlist) {
      removeFromWatchlist(tvShow.id, "tv");
    } else {
      addToWatchlist(watchlistItem);
    }
  };

  const handleAddToFavorites = () => {
    if (!tvShow) return;

    const favoriteItem = {
      id: tvShow.id,
      title: tvShow.name,
      type: "tv" as const,
      poster_path: tvShow.poster_path,
      release_date: tvShow.first_air_date,
      vote_average: tvShow.vote_average,
      addedAt: new Date().toISOString(),
    };

    if (inFavorites) {
      removeFromFavorites(tvShow.id, "tv");
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const getImageUrl = (
    path: string | null,
    size: "w500" | "w780" | "original" = "w500"
  ) => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatEpisodeRuntime = (runtimes: number[]) => {
    if (!runtimes || runtimes.length === 0) return "Non spécifié";
    const avgRuntime = Math.round(
      runtimes.reduce((a, b) => a + b, 0) / runtimes.length
    );
    return `~${avgRuntime} min/épisode`;
  };

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1);
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      "Returning Series": "En cours",
      Ended: "Terminée",
      Canceled: "Annulée",
      "In Production": "En production",
      Pilot: "Pilote",
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

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

  if (error || !tvShow) {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
          <div className="text-6xl text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Série introuvable
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
      {/* Header avec image de fond */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: tvShow.backdrop_path
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${getImageUrl(
                tvShow.backdrop_path,
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
                {tvShow.poster_path && (
                  <img
                    src={getImageUrl(tvShow.poster_path)}
                    alt={tvShow.name}
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
                  <h1 className="mb-2 text-4xl font-bold">{tvShow.name}</h1>
                  {tvShow.tagline && (
                    <p className="text-xl text-gray-200 italic">
                      {tvShow.tagline}
                    </p>
                  )}
                </div>

                {/* Métadonnées */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} />
                    <span>{formatRating(tvShow.vote_average)}/5</span>
                    <span className="text-gray-300">
                      ({tvShow.vote_count} votes)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(tvShow.first_air_date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{formatEpisodeRuntime(tvShow.episode_run_time)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tv size={16} />
                    <span>
                      {tvShow.number_of_seasons} saison
                      {tvShow.number_of_seasons > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Statut */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      tvShow.status === "Ended" ? "destructive" : "default"
                    }
                    className={
                      tvShow.status === "Ended" ? "bg-red-600" : "bg-green-600"
                    }
                  >
                    {getStatusLabel(tvShow.status)}
                  </Badge>
                  {tvShow.in_production && (
                    <Badge variant="secondary" className="bg-blue-600">
                      En production
                    </Badge>
                  )}
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
                  {tvShow.overview || "Aucun synopsis disponible."}
                </p>
              </Card>
            </motion.div>

            {/* Saisons */}
            {tvShow.seasons && tvShow.seasons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Tv size={24} />
                    Saisons ({tvShow.number_of_seasons})
                  </h2>
                  <div className="space-y-4">
                    {tvShow.seasons
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
                              {season.air_date &&
                                ` • ${formatDate(season.air_date)}`}
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
            )}

            {/* Casting (si disponible) */}
            {tvShow.credits?.cast && tvShow.credits.cast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Users size={24} />
                    Casting principal
                  </h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {tvShow.credits.cast.slice(0, 6).map((actor) => (
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
              transition={{ delay: 0.5 }}
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
                    <p>{tvShow.original_name}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Statut :
                    </span>
                    <p>{getStatusLabel(tvShow.status)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Langue originale :
                    </span>
                    <p>{tvShow.original_language?.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Première diffusion :
                    </span>
                    <p>{formatDate(tvShow.first_air_date)}</p>
                  </div>
                  {tvShow.last_air_date && (
                    <div>
                      <span className="font-semibold text-gray-600">
                        Dernière diffusion :
                      </span>
                      <p>{formatDate(tvShow.last_air_date)}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-gray-600">
                      Nombre d&apos;épisodes :
                    </span>
                    <p>{tvShow.number_of_episodes}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Réseaux de diffusion */}
            {tvShow.networks && tvShow.networks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">
                    Diffusion
                  </h3>
                  <div className="space-y-2">
                    {tvShow.networks.slice(0, 3).map((network) => (
                      <div key={network.id} className="flex items-center gap-3">
                        {network.logo_path && (
                          <img
                            src={getImageUrl(network.logo_path, "w500")}
                            alt={network.name}
                            className="size-8 object-contain"
                          />
                        )}
                        <span className="text-sm">{network.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Sociétés de production */}
            {tvShow.production_companies &&
              tvShow.production_companies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      Production
                    </h3>
                    <div className="space-y-2">
                      {tvShow.production_companies
                        .slice(0, 3)
                        .map((company) => (
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
