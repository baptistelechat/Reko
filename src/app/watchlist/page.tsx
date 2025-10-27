"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Film,
  Search,
  Star,
  Trash2,
  Tv,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WatchlistPage() {
  const router = useRouter();
  const { watchlist, removeFromWatchlist } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<"added" | "rating" | "title" | "year">(
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
  const filteredAndSortedWatchlist = watchlist
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
        case "year":
          return (
            new Date(b.release_date || "").getTime() -
            new Date(a.release_date || "").getTime()
          );
        default:
          return 0;
      }
    });

  const handleRemove = (id: number, type: "movie" | "tv") => {
    removeFromWatchlist(id, type);
  };

  const getTypeLabel = (type: "movie" | "tv") => {
    return type === "movie" ? "Film" : "Série";
  };

  const getTypeIcon = (type: "movie" | "tv") => {
    return type === "movie" ? Film : Tv;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Accueil
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Ma Watchlist</h1>
          <p className="text-gray-600">
            {watchlist.length} élément{watchlist.length > 1 ? "s" : ""} à
            regarder
          </p>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Filtres et recherche */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
            />
            <Input
              placeholder="Rechercher dans ma watchlist..."
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
              setSortBy(e.target.value as "added" | "rating" | "title" | "year")
            }
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="added">Ajouté récemment</option>
            <option value="rating">Note</option>
            <option value="title">Titre</option>
            <option value="year">Année</option>
          </select>
        </div>

        {/* Statistiques */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>
            {
              filteredAndSortedWatchlist.filter((item) => item.type === "movie")
                .length
            }{" "}
            films
          </span>
          <span>
            {
              filteredAndSortedWatchlist.filter((item) => item.type === "tv")
                .length
            }{" "}
            séries
          </span>
          <span>
            Note moyenne:{" "}
            {filteredAndSortedWatchlist.length > 0
              ? (
                  filteredAndSortedWatchlist.reduce(
                    (acc, item) => acc + item.vote_average,
                    0
                  ) /
                  filteredAndSortedWatchlist.length /
                  2
                ).toFixed(1)
              : "0"}
            /5
          </span>
        </div>
      </div>

      {/* Liste */}
      {filteredAndSortedWatchlist.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">📺</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            {watchlist.length === 0
              ? "Votre watchlist est vide"
              : "Aucun résultat trouvé"}
          </h2>
          <p className="mb-6 text-gray-500">
            {watchlist.length === 0
              ? "Découvrez de nouveaux films et séries à ajouter à votre liste"
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
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <AnimatePresence>
            {filteredAndSortedWatchlist.map((item, index) => {
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
                  <Card className="overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    {/* Poster */}
                    <div
                      className="relative aspect-2/3 cursor-pointer overflow-hidden"
                      onClick={() => router.push(`/${item.type}/${item.id}`)}
                    >
                      <img
                        src={getImageUrl(item.poster_path)}
                        alt={item.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-poster.jpg";
                        }}
                      />

                      {/* Overlay avec action de suppression */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id, item.type);
                          }}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {/* Badge type */}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 border-none bg-black/70 text-white"
                        >
                          <TypeIcon size={12} />
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>

                      {/* Note */}
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {formatRating(item.vote_average)}
                        </div>
                      </div>

                      {/* Date d'ajout */}
                      <div className="absolute bottom-2 left-2">
                        <div className="rounded bg-black/70 px-2 py-1 text-xs text-white">
                          Ajouté le {formatAddedDate(item.addedAt)}
                        </div>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 p-4">
                      <h3
                        className="group-hover:text-primary line-clamp-2 cursor-pointer text-sm font-semibold text-gray-900 transition-colors"
                        onClick={() => router.push(`/${item.type}/${item.id}`)}
                      >
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
      {watchlist.length > 0 && (
        <div className="mt-12 space-y-4 text-center">
          <div className="space-x-4">
            <Button
              onClick={() => router.push("/favorites")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Star size={20} />
              Mes Favoris
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
  );
}
