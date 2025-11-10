"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { useAppStore } from "@/store/useAppStore";
import { Movie, TVShow } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Eye,
  EyeOff,
  Heart,
  RefreshCw,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ResultHeader from "./components/ResultHeader";

export default function ResultsPage() {
  const router = useRouter();
  const {
    preferences,
    currentRecommendations: recommendations,
    fetchRecommendations,
    isLoading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
  } = useAppStore();

  useEffect(() => {
    if (!preferences.mood) {
      router.push("/explore");
    }
  }, [preferences, router]);

  const handleRefresh = async () => {
    await fetchRecommendations();
  };

  const handleNewSearch = () => {
    router.push("/explore");
  };

  const handleAddToWatchlist = (content: Movie | TVShow) => {
    const watchlistItem = {
      id: content.id,
      title: "title" in content ? content.title : content.name,
      type: "title" in content ? ("movie" as const) : ("tv" as const),
      poster_path: content.poster_path,
      release_date:
        "release_date" in content
          ? content.release_date
          : content.first_air_date,
      vote_average: content.vote_average,
      addedAt: new Date().toISOString(),
    };
    addToWatchlist(watchlistItem);
  };

  const handleAddToFavorites = (content: Movie | TVShow) => {
    const favoriteItem = {
      id: content.id,
      title: "title" in content ? content.title : content.name,
      type: "title" in content ? ("movie" as const) : ("tv" as const),
      poster_path: content.poster_path,
      release_date:
        "release_date" in content
          ? content.release_date
          : content.first_air_date,
      vote_average: content.vote_average,
      addedAt: new Date().toISOString(),
    };
    addToFavorites(favoriteItem);
  };

  const handleToggleWatchlist = (content: Movie | TVShow) => {
    const type = "title" in content ? ("movie" as const) : ("tv" as const);
    if (isInWatchlist(content.id, type)) {
      removeFromWatchlist(content.id, type);
    } else {
      handleAddToWatchlist(content);
    }
  };

  const handleToggleFavorites = (content: Movie | TVShow) => {
    const type = "title" in content ? ("movie" as const) : ("tv" as const);
    if (isInFavorites(content.id, type)) {
      removeFromFavorites(content.id, type);
    } else {
      handleAddToFavorites(content);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
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
            Recherche de recommandations...
          </p>
          <p className="text-sm text-gray-500">
            Nous analysons vos préférences
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
          <div className="text-6xl text-red-500">⚠️</div>
<h2 className="text-2xl text-gray-900">
            Oups ! Une erreur est survenue
          </h2>
          <p className="text-gray-600">{error}</p>
          <div className="space-x-4">
            <Button
              onClick={handleRefresh}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw size={20} className="mr-2" />
              Réessayer
            </Button>
            <Button variant="outline" onClick={() => router.push("/explore")}>
              <ArrowLeft size={20} className="mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-primary/5 min-h-screen bg-linear-to-br to-orange-600/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ResultHeader />
        {/* Résultats */}
        {recommendations.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl text-gray-400">🎬</div>
<h2 className="mb-2 text-xl text-gray-700">
              Aucune recommandation trouvée
            </h2>
            <p className="mb-6 text-gray-500">
              Essayez avec d'autres préférences
            </p>
            <Button
              onClick={handleNewSearch}
              className="bg-primary hover:bg-primary/90"
            >
              Nouvelle recherche
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {recommendations.map((content, index) => {
              const title = "title" in content ? content.title : content.name;
              const releaseDate =
                "release_date" in content
                  ? content.release_date
                  : content.first_air_date;
              const isMovie = "title" in content;

              return (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="flex h-[520px] flex-col overflow-hidden bg-white pt-0 pb-2 shadow-lg transition-all duration-300 hover:shadow-xl">
                    {/* Poster */}
                    <div
                      className="relative h-80 cursor-pointer overflow-hidden bg-linear-to-r from-violet-300 to-orange-300"
                      onClick={() =>
                        router.push(
                          `/${isMovie ? "movie" : "tv"}/${content.id}`
                        )
                      }
                    >
                      {content.poster_path && (
                        <img
                          src={tmdbService.getPosterUrl(content.poster_path)}
                          alt={tmdbService.getContentTitle(content)}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}

                      {/* Overlay avec actions */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWatchlist(content);
                            }}
                            className="bg-white/90 text-gray-900 hover:bg-white"
                          >
                            {isInWatchlist(
                              content.id,
                              "title" in content ? "movie" : "tv"
                            ) ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorites(content);
                            }}
                            className="bg-white/90 text-gray-900 hover:bg-white"
                          >
                            <Heart
                              size={16}
                              className={
                                isInFavorites(
                                  content.id,
                                  "title" in content ? "movie" : "tv"
                                )
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Badge type */}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="secondary"
                          className="border-none bg-black/70 text-white"
                        >
                          {isMovie ? "Film" : "Série"}
                        </Badge>
                      </div>

                      {/* Note */}
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {formatRating(content.vote_average)}
                        </div>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="shrink-0 space-y-2 p-4">
<h3
                        className="group-hover:text-primary line-clamp-1 cursor-pointer text-sm text-gray-900 transition-colors"
                        onClick={() =>
                          router.push(
                            `/${isMovie ? "movie" : "tv"}/${content.id}`
                          )
                        }
                      >
                        {title}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {releaseDate ? formatDate(releaseDate) : "N/A"}
                        </div>

                        {content.genre_ids && content.genre_ids.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {content.genre_ids.length} genre
                            {content.genre_ids.length > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>

                      {/* Description courte */}
                      {content.overview && (
                        <p className="line-clamp-5 text-xs text-gray-600">
                          {content.overview}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Actions en bas */}
        {recommendations.length > 0 && (
          <div className="mt-12 space-y-4 text-center">
            <p className="text-gray-600">
              {recommendations.length} recommandation
              {recommendations.length > 1 ? "s" : ""} trouvée
              {recommendations.length > 1 ? "s" : ""}
            </p>
            <div className="space-x-4">
              <Button
                onClick={() => router.push("/watchlist")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye size={20} />
                Ma Watchlist
              </Button>
              <Button
                onClick={() => router.push("/favorites")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Heart size={20} />
                Mes Favoris
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
