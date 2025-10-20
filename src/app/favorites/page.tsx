"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { ContentType } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Film,
  Heart,
  Search,
  Star,
  Trash2,
  Tv,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, removeFromFavorites } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<"added" | "rating" | "title" | "date">(
    "added"
  );

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

  const formatAddedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filtrage et tri
  const filteredAndSortedFavorites = favorites
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "added":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case "rating":
          return b.vote_average - a.vote_average;
        case "title":
          return a.title.localeCompare(b.title);
        case "date":
          return (
            new Date(b.release_date || "").getTime() -
            new Date(a.release_date || "").getTime()
          );
        default:
          return 0;
      }
    });

  const handleRemove = (id: number, type: ContentType) => {
    removeFromFavorites(id, type);
  };

  const getTypeLabel = (type: "movie" | "tv") => {
    return type === "movie" ? "Film" : "Série";
  };

  const getTypeIcon = (type: "movie" | "tv") => {
    return type === "movie" ? Film : Tv;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-orange-500/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Accueil
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Heart className="fill-red-500 text-red-500" size={24} />
              Mes Favoris
            </h1>
            <p className="text-gray-600">
              {favorites.length} coup{favorites.length > 1 ? "s" : ""} de cœur
            </p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Rechercher dans mes favoris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                Tout
              </Button>
              <Button
                variant={filterType === "movie" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("movie")}
                className="flex items-center gap-1"
              >
                <Film size={16} />
                Films
              </Button>
              <Button
                variant={filterType === "tv" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("tv")}
                className="flex items-center gap-1"
              >
                <Tv size={16} />
                Séries
              </Button>
            </div>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "added" | "rating" | "title" | "date"
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
            >
              <option value="added">Ajouté récemment</option>
              <option value="rating">Note</option>
              <option value="title">Titre</option>
              <option value="date">Date de sortie</option>
            </select>
          </div>

          {/* Statistiques */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span>
              {
                filteredAndSortedFavorites.filter(
                  (item) => item.type === "movie"
                ).length
              }{" "}
              films
            </span>
            <span>
              {
                filteredAndSortedFavorites.filter((item) => item.type === "tv")
                  .length
              }{" "}
              séries
            </span>
            <span>
              Note moyenne:{" "}
              {filteredAndSortedFavorites.length > 0
                ? (
                    filteredAndSortedFavorites.reduce(
                      (acc, item) => acc + item.vote_average,
                      0
                    ) /
                    filteredAndSortedFavorites.length /
                    2
                  ).toFixed(1)
                : "0"}
              /5
            </span>
          </div>
        </div>

        {/* Liste */}
        {filteredAndSortedFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💖</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {favorites.length === 0
                ? "Aucun favori pour le moment"
                : "Aucun résultat trouvé"}
            </h2>
            <p className="text-gray-500 mb-6">
              {favorites.length === 0
                ? "Ajoutez vos films et séries préférés en explorant notre catalogue"
                : "Essayez avec d'autres termes de recherche ou filtres"}
            </p>
            <Button
              onClick={() => router.push("/explore")}
              className="bg-primary hover:bg-primary/90"
            >
              Découvrir du contenu
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <AnimatePresence>
              {filteredAndSortedFavorites.map((item, index) => {
                const TypeIcon = getTypeIcon(item.type);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-100">
                      {/* Poster */}
                      <div className="relative aspect-2/3 overflow-hidden">
                        <img
                          src={getImageUrl(item.poster_path)}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-poster.jpg";
                          }}
                        />

                        {/* Overlay avec action de suppression */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemove(item.id, item.type)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>

                        {/* Badge type */}
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="bg-black/70 text-white border-none flex items-center gap-1"
                          >
                            <TypeIcon size={12} />
                            {getTypeLabel(item.type)}
                          </Badge>
                        </div>

                        {/* Note */}
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star
                              size={12}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            {formatRating(item.vote_average)}
                          </div>
                        </div>

                        {/* Icône favori */}
                        <div className="absolute bottom-2 right-2">
                          <Heart
                            className="fill-red-500 text-red-500"
                            size={20}
                          />
                        </div>

                        {/* Date d'ajout */}
                        <div className="absolute bottom-2 left-2">
                          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                            Ajouté le {formatAddedDate(item.addedAt)}
                          </div>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {item.release_date
                              ? formatDate(item.release_date)
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Actions en bas */}
        {favorites.length > 0 && (
          <div className="mt-12 text-center space-y-4">
            <div className="space-x-4">
              <Button
                onClick={() => router.push("/watchlist")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Tv size={20} />
                Ma Watchlist
              </Button>
              <Button
                onClick={() => router.push("/explore")}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Search size={20} />
                Découvrir plus
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
