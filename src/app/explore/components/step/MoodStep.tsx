"use client";

import { Card } from "@/components/ui/card";
import { MOODS_ARRAY } from "@/constants/moods";
import { Mood } from "@/types";
import { motion } from "framer-motion";

interface MoodStepProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
}

export const MoodStep = ({ selectedMood, onMoodSelect }: MoodStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Comment vous sentez-vous ?
        </h2>
        <p className="text-gray-600">
          Choisissez l'humeur qui correspond à votre état d'esprit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOODS_ARRAY.map((mood) => {
          const Icon = mood.icon;
          return (
            <motion.div
              key={mood.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  selectedMood === mood.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:shadow-lg"
                }`}
                onClick={() => onMoodSelect(mood.id)}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-full ${mood.color} text-white`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg">{mood.label}</h3>
                  <p className="text-sm text-gray-600 text-center">
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