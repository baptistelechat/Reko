"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Calendar, Film, Play } from "lucide-react";
import { useEffect, useState } from "react";
import ContentTitle from "../ContentTitle";

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
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

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
    // Supprimer le filtre YouTube pour supporter plus de providers
    .sort((a, b) => {
      // Prioriser les vidéos officielles
      if (a.official && !b.official) return -1;
      if (!a.official && b.official) return 1;

      // Prioriser par type (Trailer > Teaser > Clip > etc.)
      const typeOrder = [
        "Trailer",
        "Teaser",
        "Clip",
        "Featurette",
        "Behind the Scenes",
      ];
      const aIndex = typeOrder.indexOf(a.type);
      const bIndex = typeOrder.indexOf(b.type);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // Trier par date de publication (plus récent en premier)
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    });

  const getVideoTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Trailer: "Bande-annonce",
      Teaser: "Teaser",
      Clip: "Extrait",
      Featurette: "Making-of",
      "Behind the Scenes": "Coulisses",
      Bloopers: "Bêtisier",
      "Opening Credits": "Générique d'ouverture",
    };
    return labels[type] || type;
  };

  const getVideoTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Trailer: "bg-red-100 text-red-800",
      Teaser: "bg-orange-100 text-orange-800",
      Clip: "bg-blue-100 text-blue-800",
      Featurette: "bg-green-100 text-green-800",
      "Behind the Scenes": "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getVideoThumbnail = (video: VideoData) => {
    switch (video.site) {
      case "YouTube":
        return `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`;
      case "Vimeo":
        return `https://vumbnail.com/${video.key}.jpg`;
      case "Dailymotion":
        return `https://www.dailymotion.com/thumbnail/video/${video.key}`;
      case "Facebook":
        return null; // Facebook ne fournit pas de thumbnails publiques
      case "Instagram":
        return null; // Instagram ne fournit pas de thumbnails publiques
      case "TikTok":
        return null; // TikTok ne fournit pas de thumbnails publiques
      case "Twitter":
        return null; // Twitter ne fournit pas de thumbnails publiques
      case "Twitch":
        return `https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/twitchvod/${video.key}/thumb/thumb0-320x240.jpg`;
      case "Wistia":
        return `https://embed-fastly.wistia.com/deliveries/${video.key}.jpg`;
      case "JWPlayer":
        return null; // JWPlayer nécessite une API key pour les thumbnails
      default:
        return null;
    }
  };

  const getVideoEmbedUrl = (video: VideoData) => {
    switch (video.site) {
      case "YouTube":
        return `https://www.youtube.com/embed/${video.key}?rel=0&modestbranding=1&fs=1`;
      case "Vimeo":
        return `https://player.vimeo.com/video/${video.key}?title=0&byline=0&portrait=0`;
      case "Dailymotion":
        return `https://www.dailymotion.com/embed/video/${video.key}?autoplay=0`;
      case "Facebook":
        return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${video.key}&show_text=0&width=560`;
      case "Instagram":
        return `https://www.instagram.com/p/${video.key}/embed/`;
      case "TikTok":
        return `https://www.tiktok.com/embed/v2/${video.key}`;
      case "Twitter":
        return `https://platform.twitter.com/embed/Tweet.html?id=${video.key}`;
      case "Twitch":
        return `https://player.twitch.tv/?video=${video.key}&parent=${window.location.hostname}`;
      case "Wistia":
        return `https://fast.wistia.net/embed/iframe/${video.key}`;
      case "JWPlayer":
        return `https://content.jwplatform.com/players/${video.key}.html`;
      default:
        return null;
    }
  };

  const canPlayInApp = (video: VideoData) => {
    return [
      "YouTube",
      "Vimeo",
      "Dailymotion",
      "Facebook",
      "Instagram",
      "TikTok",
      "Twitter",
      "Twitch",
      "Wistia",
      "JWPlayer",
    ].includes(video.site);
  };

  const openVideo = (video: VideoData) => {
    if (canPlayInApp(video)) {
      setSelectedVideo(video);
    } else {
      // Fallback vers l'ouverture externe avec URLs appropriées pour chaque provider
      let externalUrl = "";

      switch (video.site) {
        case "YouTube":
          externalUrl = `https://www.youtube.com/watch?v=${video.key}`;
          break;
        case "Vimeo":
          externalUrl = `https://vimeo.com/${video.key}`;
          break;
        case "Dailymotion":
          externalUrl = `https://www.dailymotion.com/video/${video.key}`;
          break;
        case "Facebook":
          externalUrl = `https://www.facebook.com/watch/?v=${video.key}`;
          break;
        case "Instagram":
          externalUrl = `https://www.instagram.com/p/${video.key}/`;
          break;
        case "TikTok":
          externalUrl = `https://www.tiktok.com/@user/video/${video.key}`;
          break;
        case "Twitter":
          externalUrl = `https://twitter.com/i/status/${video.key}`;
          break;
        case "Twitch":
          externalUrl = `https://www.twitch.tv/videos/${video.key}`;
          break;
        case "Wistia":
          externalUrl = `https://wistia.com/medias/${video.key}`;
          break;
        case "JWPlayer":
          externalUrl = `https://content.jwplatform.com/previews/${video.key}`;
          break;
        default:
          console.warn(`Provider non supporté: ${video.site}`);
          return;
      }

      window.open(externalUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="p-6">
        <ContentTitle icon={Film} title={`Vidéos (${sortedVideos.length})`} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sortedVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-primary/10 cursor-pointer overflow-hidden rounded-lg transition-transform"
              onClick={() => openVideo(video)}
            >
              {/* Thumbnail avec overlay de lecture */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                <img
                  src={getVideoThumbnail(video) ?? ""}
                  alt={video.name}
                  className="h-full w-full object-cover transition-all group-hover:scale-105 group-hover:opacity-90"
                />

                {/* Overlay de lecture */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity">
                  <div
                    className={`rounded-full p-3 text-white transition-transform group-hover:scale-110 ${
                      canPlayInApp(video) ? "bg-primary" : "bg-gray-600"
                    }`}
                  >
                    <Play className="size-6" />
                  </div>
                </div>

                {/* Badge du type de vidéo */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getVideoTypeColor(
                      video.type
                    )}`}
                  >
                    {getVideoTypeLabel(video.type)}
                  </span>
                </div>

                {/* Badge officiel */}
                {video.official && (
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    Officiel
                  </Badge>
                )}

                {/* Indicateur de provider */}
                <div className="absolute right-2 bottom-2">
                  <span className="rounded bg-black/70 px-2 py-1 text-xs text-white">
                    {video.site}
                  </span>
                </div>
              </div>

              {/* Informations de la vidéo */}
              <div className="p-4">
                <h4 className="mb-2 line-clamp-2 font-medium">{video.name}</h4>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(video.published_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal Video Player intégré */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl">
            {/* Titre de la vidéo */}
            <div className="mb-4 text-center">
<h3 className="text-xl text-white">
                {selectedVideo.name}
              </h3>
              <p className="text-sm text-gray-300">
                {getVideoTypeLabel(selectedVideo.type)}
                {selectedVideo.official && " • Officiel"}
                {" • "}
                {new Date(selectedVideo.published_at).toLocaleDateString(
                  "fr-FR"
                )}
              </p>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={getVideoEmbedUrl(selectedVideo)!}
                className="h-full w-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={selectedVideo.name}
              />
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-4 text-center text-sm text-gray-300"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
