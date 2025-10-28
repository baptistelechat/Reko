"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Play, ExternalLink, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

type ContentVideosProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

type VideoData = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
};

type VideosResponse = {
  results: VideoData[];
};

export default function ContentVideos({ type, data }: ContentVideosProps) {
  const [videos, setVideos] = useState<VideosResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const result =
          type === "movie"
            ? await tmdbService.getMovieVideos(data.id)
            : await tmdbService.getTVVideos(data.id);
        setVideos(result);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.id) fetchVideos();
  }, [data?.id, type]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-video rounded-lg bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!videos || !videos.results?.length) {
    return null;
  }

  // Filtrer et trier les vidéos par priorité
  const sortedVideos = videos.results
    .filter((video) => video.site === "YouTube") // Seulement YouTube pour l'intégration
    .sort((a, b) => {
      // Prioriser les vidéos officielles
      if (a.official && !b.official) return -1;
      if (!a.official && b.official) return 1;
      
      // Prioriser par type (Trailer > Teaser > Clip > etc.)
      const typeOrder = ["Trailer", "Teaser", "Clip", "Featurette", "Behind the Scenes"];
      const aIndex = typeOrder.indexOf(a.type);
      const bIndex = typeOrder.indexOf(b.type);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // Trier par date de publication (plus récent en premier)
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

  const getVideoTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "Trailer": "Bande-annonce",
      "Teaser": "Teaser",
      "Clip": "Extrait",
      "Featurette": "Making-of",
      "Behind the Scenes": "Coulisses",
      "Bloopers": "Bêtisier",
      "Opening Credits": "Générique d'ouverture",
    };
    return labels[type] || type;
  };

  const getVideoTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Trailer": "bg-red-100 text-red-800",
      "Teaser": "bg-orange-100 text-orange-800",
      "Clip": "bg-blue-100 text-blue-800",
      "Featurette": "bg-green-100 text-green-800",
      "Behind the Scenes": "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getYouTubeThumbnail = (key: string) => {
    return `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
  };

  const openVideo = (key: string) => {
    window.open(`https://www.youtube.com/watch?v=${key}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="p-6">
        <h3 className="mb-6 text-xl font-bold text-gray-900">
          Vidéos ({sortedVideos.length})
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sortedVideos.slice(0, 6).map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer overflow-hidden rounded-lg bg-gray-50 transition-transform hover:scale-105"
              onClick={() => openVideo(video.key)}
            >
              {/* Thumbnail avec overlay de lecture */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                <img
                  src={getYouTubeThumbnail(video.key)}
                  alt={video.name}
                  className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                  }}
                />
                
                {/* Overlay de lecture */}
                <div className="bg-opacity-30 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black transition-opacity">
                  <div className="rounded-full bg-red-600 p-3 text-white transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>

                {/* Badge du type de vidéo */}
                <div className="absolute top-2 left-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getVideoTypeColor(video.type)}`}>
                    {getVideoTypeLabel(video.type)}
                  </span>
                </div>

                {/* Badge officiel */}
                {video.official && (
                  <div className="absolute top-2 right-2">
                    <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
                      Officiel
                    </span>
                  </div>
                )}
              </div>

              {/* Informations de la vidéo */}
              <div className="p-4">
                <h4 className="mb-2 line-clamp-2 font-medium text-gray-900 group-hover:text-blue-600">
                  {video.name}
                </h4>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(video.published_at).toLocaleDateString("fr-FR")}
                  </div>
                  
                  <div className="flex items-center gap-1 text-red-600">
                    <ExternalLink className="h-4 w-4" />
                    YouTube
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Afficher plus de vidéos si disponible */}
        {sortedVideos.length > 6 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {sortedVideos.length - 6} vidéo(s) supplémentaire(s) disponible(s)
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}