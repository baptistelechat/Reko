"use client";

import { Card } from "@/components/ui/card";
import { MOODS_ARRAY } from "@/constants/moods";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export const MoodStep = () => {
  const { selectedMood, setSelectedMood } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
<h2 className="text-3xl text-gray-900">
          Comment vous sentez-vous ?
        </h2>
        <p className="text-gray-600">
          Choisissez l'humeur qui correspond à votre état d'esprit
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOODS_ARRAY.map((mood) => {
          const Icon = mood.icon;
          return (
            <motion.div
              key={mood.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer p-6 transition-all duration-200 ${
                  selectedMood === mood.id
                    ? "ring-primary bg-primary/5 ring-2"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedMood(mood.id)}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`rounded-full p-3 ${mood.color} text-white`}>
                    <Icon size={24} />
                  </div>
<h3 className="text-lg">{mood.label}</h3>
                  <p className="text-center text-sm text-gray-600">
                    {mood.description}
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
