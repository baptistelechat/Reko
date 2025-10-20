"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { Movie, TVShow } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Plus,
  RefreshCw,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResultsPage() {
  const router = useRouter();
  const {
    currentRecommendations: recommendations,
    isLoading,
    error,
    preferences,
    fetchRecommendations,
    addToWatchlist,
    addToFavorites,
    isInWatchlist,
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

  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder-poster.jpg";
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1);
  };

  const getMoodLabel = (mood: string) => {
    const moodLabels = {
      happy: "Joyeux",
      sad: "Mélancolique",
      excited: "Excité",
      romantic: "Romantique",
      chill: "Détendu",
    };
    return moodLabels[mood as keyof typeof moodLabels] || mood;
  };

  const getContentTypeLabel = (type: string) => {
    return type === "movie" ? "Films" : "Séries";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
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
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-orange-600/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/explore")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Nouvelle recherche
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Vos recommandations
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="secondary">
                {getMoodLabel(preferences.mood!)}
              </Badge>
              <Badge variant="secondary">
                {getContentTypeLabel(preferences.contentType!)}
              </Badge>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Actualiser
          </Button>
        </div>

        {/* Résultats */}
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune recommandation trouvée
            </h2>
            <p className="text-gray-500 mb-6">
              Essayez avec d'autres préférences
            </p>
            <Button
              onClick={() => router.push("/explore")}
              className="bg-primary hover:bg-primary/90"
            >
              Nouvelle recherche
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
                  <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Poster */}
                    <div className="relative aspect-2/3 overflow-hidden">
                      <img
                        src={getImageUrl(content.poster_path)}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-poster.jpg";
                        }}
                      />

                      {/* Overlay avec actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAddToWatchlist(content)}
                            disabled={isInWatchlist(
                              content.id,
                              "title" in content ? "movie" : "tv"
                            )}
                            className="bg-white/90 hover:bg-white text-gray-900"
                          >
                            {isInWatchlist(
                              content.id,
                              "title" in content ? "movie" : "tv"
                            ) ? (
                              <Eye size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAddToFavorites(content)}
                            disabled={isInFavorites(
                              content.id,
                              "title" in content ? "movie" : "tv"
                            )}
                            className="bg-white/90 hover:bg-white text-gray-900"
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
                          className="bg-black/70 text-white border-none"
                        >
                          {isMovie ? "Film" : "Série"}
                        </Badge>
                      </div>

                      {/* Note */}
                      <div className="absolute top-2 right-2">
                        <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {formatRating(content.vote_average)}
                        </div>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
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
                        <p className="text-xs text-gray-600 line-clamp-3">
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
          <div className="mt-12 text-center space-y-4">
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
