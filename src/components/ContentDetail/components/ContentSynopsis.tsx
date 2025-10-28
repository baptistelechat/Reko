"use client";

import { Card } from "@/components/ui/card";
import { ContentType, MovieDetails, TVShowDetails } from "@/types";
import { motion } from "framer-motion";

type ContentSynopsisProps = {
  type: ContentType;
  data: MovieDetails | TVShowDetails;
};

export default function ContentSynopsis({ type, data }: ContentSynopsisProps) {
  const overview =
    type === "movie"
      ? (data as MovieDetails).overview
      : (data as TVShowDetails).overview;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Synopsis</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          {overview || "Aucun synopsis disponible."}
        </p>
      </Card>
    </motion.div>
  );
}
