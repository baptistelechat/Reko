"use client";

import { Card } from "@/components/ui/card";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { Image as ImageIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

type ContentImagesProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
};

type ImageData = {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
};

type ImagesResponse = {
  backdrops: ImageData[];
  posters: ImageData[];
};

export default function ContentImages({ type, data }: ContentImagesProps) {
  const [images, setImages] = useState<ImagesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"backdrops" | "posters">("backdrops");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const result =
          type === "movie"
            ? await tmdbService.getMovieImages(data.id)
            : await tmdbService.getTVImages(data.id);
        setImages(result);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.id) fetchImages();
  }, [data?.id, type]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!images || (!images.backdrops?.length && !images.posters?.length)) {
    return null;
  }

  const currentImages = activeTab === "backdrops" ? images.backdrops : images.posters;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Images
            </h3>
            
            {/* Onglets */}
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("backdrops")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "backdrops"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Arrière-plans ({images.backdrops?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("posters")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "posters"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Affiches ({images.posters?.length || 0})
              </button>
            </div>
          </div>

          {/* Grille d'images */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {currentImages.slice(0, 12).map((image, index) => (
              <div
                key={`${image.file_path}-${index}`}
                className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-transform hover:scale-105"
                onClick={() => setSelectedImage(image.file_path)}
              >
                <div className={`aspect-${activeTab === "backdrops" ? "video" : "[2/3]"}`}>
                  <img
                    src={tmdbService.getImageUrl(image.file_path, "w500")}
                    alt={`${activeTab === "backdrops" ? "Arrière-plan" : "Affiche"} ${index + 1}`}
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  
                  {/* Overlay avec informations */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="rounded bg-black bg-opacity-75 px-2 py-1 text-xs text-white">
                        {image.width} × {image.height}
                        {image.vote_average > 0 && (
                          <span className="ml-2">
                            ⭐ {image.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Afficher plus d'images si disponible */}
          {currentImages.length > 12 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {currentImages.length - 12} image(s) supplémentaire(s) disponible(s)
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Modal pour l'image agrandie */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={tmdbService.getImageUrl(selectedImage, "original")}
              alt="Image agrandie"
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}