"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
import { X } from "lucide-react";
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
            <div className="h-6 w-32 rounded bg-gray-200"></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-lg bg-gray-200"
                ></div>
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Images</h3>

            <Tabs defaultValue="backdrops" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="backdrops">
                  Arrière-plans ({images.backdrops?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="posters">
                  Affiches ({images.posters?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="backdrops" className="mt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {images.backdrops?.slice(0, 12).map((image, index) => (
                    <div
                      key={`${image.file_path}-${index}`}
                      className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-transform hover:scale-105"
                      onClick={() => setSelectedImage(image.file_path)}
                    >
                      <div className="aspect-video">
                        <img
                          src={tmdbService.getBackdropUrl(image.file_path)}
                          alt="Arrière-plan"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="posters" className="mt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {images.posters?.slice(0, 12).map((image, index) => (
                    <div
                      key={`${image.file_path}-${index}`}
                      className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-transform hover:scale-105"
                      onClick={() => setSelectedImage(image.file_path)}
                    >
                      <div className="aspect-2/3">
                        <img
                          src={tmdbService.getPosterUrl(image.file_path)}
                          alt="Affiche"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </motion.div>

      {/* Modal pour l'image agrandie */}
      {selectedImage && (
        <div
          className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
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
              src={tmdbService.getPosterUrl(selectedImage)}
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
