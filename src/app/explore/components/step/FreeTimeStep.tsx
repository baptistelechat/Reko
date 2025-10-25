"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { FREE_TIME_OPTIONS } from "@/constants/freeTime";
import { MOODS_ARRAY, MOODS_CONFIG } from "@/constants/moods";
import { FreeTime, Mood } from "@/types";
import { motion } from "framer-motion";

interface FreeTimeStepProps {
  selectedMood: Mood | null;
  selectedFreeTime: FreeTime | null;
  isCustomDuration: boolean;
  customDurationRange: number[];
  onFreeTimeSelect: (freeTime: FreeTime) => void;
  onCustomDurationToggle: () => void;
  onCustomDurationChange: (range: number[]) => void;
}

export const FreeTimeStep = ({
  selectedMood,
  selectedFreeTime,
  isCustomDuration,
  customDurationRange,
  onFreeTimeSelect,
  onCustomDurationToggle,
  onCustomDurationChange,
}: FreeTimeStepProps) => {

  const mood = MOODS_ARRAY.find((mood) => mood.id === selectedMood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Combien de temps avez-vous ?
        </h2>
        <p className="text-gray-600">Sélectionnez la durée qui vous convient</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {FREE_TIME_OPTIONS.map((option, index) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer p-6 transition-all duration-200 ${
                selectedFreeTime === option.id
                  ? "ring-primary bg-primary/5 ring-2"
                  : "hover:shadow-lg"
              }`}
              onClick={() => onFreeTimeSelect(option.id)}
            >
              <div className="flex flex-col items-center space-y-3">
                <div
                  className={`rounded-full p-3 text-white ${mood?.colorFreeTime[option.id]}`}
                >
                  <option.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold">{option.label}</h3>
                <Badge variant="secondary">{option.duration}</Badge>
                <p className="text-center text-sm text-gray-600">
                  {option.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className={`space-y-4 rounded-lg bg-gray-50 p-6 ${
          isCustomDuration ? "outline-primary outline-2" : ""
        }`}
        onClick={onCustomDurationToggle}
      >
        <h4 className="text-center font-semibold">
          {isCustomDuration
            ? "Durée personnalisée sélectionnée"
            : "Durée personnalisée"}
        </h4>
        <div className="space-y-2">
          <Slider
            value={customDurationRange}
            onValueChange={onCustomDurationChange}
            max={300}
            min={0}
            step={15}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0h</span>
            <span className="font-semibold">
              {Math.floor(customDurationRange[0] / 60)}h
              {customDurationRange[0] % 60 > 0
                ? ` ${customDurationRange[0] % 60}min`
                : ""}
              {" — "}
              {Math.floor(customDurationRange[1] / 60)}h
              {customDurationRange[1] % 60 > 0
                ? ` ${customDurationRange[1] % 60}min`
                : ""}
            </span>
            <span>5h</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
