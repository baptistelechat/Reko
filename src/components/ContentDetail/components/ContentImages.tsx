"use client";

import { Card } from "@/components/ui/card";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import tmdbService from "@/services/tmdb";
import { MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";
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

            <Tabs defaultValue="posters" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posters">
                  Affiches ({images.posters?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="backdrops">
                  Arrière-plans ({images.backdrops?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posters" className="mt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {images.posters?.map((image, index) => (
                    <ImageZoom
                      key={`${image.file_path}-${index}`}
                      backdropClassName={cn(
                        '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                      )}
                    >
                      <div className="aspect-2/3">
                        <img
                          src={tmdbService.getPosterUrl(image.file_path)}
                          alt="Affiche"
                          className="h-full w-full cursor-zoom-in object-cover"
                          loading="lazy"
                        />
                      </div>
                    </ImageZoom>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="backdrops" className="mt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {images.backdrops?.map((image, index) => (
                    <ImageZoom
                      key={`${image.file_path}-${index}`}
                      backdropClassName={cn(
                        '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                      )}
                    >
                      <div className="aspect-video">
                        <img
                          src={tmdbService.getBackdropUrl(image.file_path)}
                          alt="Arrière-plan"
                          className="h-full w-full cursor-zoom-in object-cover"
                          loading="lazy"
                        />
                      </div>
                    </ImageZoom>
                  ))}
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
