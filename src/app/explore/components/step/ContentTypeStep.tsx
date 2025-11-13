"use client";

import { Card } from "@/components/ui/card";
import { CONTENT_OPTIONS } from "@/constants/contentType";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export const ContentTypeStep = () => {
  const { selectedContentType, setSelectedContentType } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
<h2 className="text-3xl text-gray-900">
          Que voulez-vous regarder ?
        </h2>
        <p className="text-gray-600">Choisissez entre films et séries</p>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        {CONTENT_OPTIONS.map((type) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`h-full cursor-pointer p-8 transition-all duration-200 ${
                  selectedContentType === type.id
                    ? "ring-primary bg-primary/5 ring-2"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedContentType(type.id)}
              >
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <div className="from-primary rounded-full bg-linear-to-r to-orange-600 p-4 text-white">
                    <Icon size={32} />
                  </div>
<h3 className="text-xl">{type.label}</h3>
                  <p className="text-center text-gray-600">
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
