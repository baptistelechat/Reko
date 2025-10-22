"use client";

import { Card } from "@/components/ui/card";
import { ContentType } from "@/types";
import { motion } from "framer-motion";
import { Film, Tv } from "lucide-react";

const CONTENT_TYPES = [
  {
    id: "movie" as ContentType,
    label: "Films",
    icon: Film,
    description: "Histoires complètes en une séance",
  },
  {
    id: "tv" as ContentType,
    label: "Séries",
    icon: Tv,
    description: "Aventures à suivre épisode par épisode",
  },
];

interface ContentTypeStepProps {
  selectedContentType: ContentType | null;
  onContentTypeSelect: (contentType: ContentType) => void;
}

export const ContentTypeStep = ({
  selectedContentType,
  onContentTypeSelect,
}: ContentTypeStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Que voulez-vous regarder ?
        </h2>
        <p className="text-gray-600">Choisissez entre films et séries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-8 cursor-pointer transition-all duration-200 h-full ${
                  selectedContentType === type.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:shadow-lg"
                }`}
                onClick={() => onContentTypeSelect(type.id)}
              >
                <div className="flex flex-col items-center space-y-4 h-full justify-center">
                  <div className="p-4 rounded-full bg-linear-to-r from-primary to-orange-600 text-white">
                    <Icon size={32} />
                  </div>
                  <h3 className="font-semibold text-xl">{type.label}</h3>
                  <p className="text-gray-600 text-center">
                    {type.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};