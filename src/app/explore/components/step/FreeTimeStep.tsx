"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { FreeTime } from "@/types";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const FREE_TIME_OPTIONS = [
  {
    id: "short" as FreeTime,
    label: "Court",
    duration: "< 2h",
    description: "Un épisode ou un film court",
  },
  {
    id: "medium" as FreeTime,
    label: "Moyen",
    duration: "2-3h",
    description: "Un bon film ou quelques épisodes",
  },
  {
    id: "long" as FreeTime,
    label: "Long",
    duration: "> 3h",
    description: "Une soirée complète ou un marathon",
  },
];

interface FreeTimeStepProps {
  selectedFreeTime: FreeTime | null;
  isCustomDuration: boolean;
  customDurationRange: number[];
  onFreeTimeSelect: (freeTime: FreeTime) => void;
  onCustomDurationToggle: () => void;
  onCustomDurationChange: (range: number[]) => void;
}

export const FreeTimeStep = ({
  selectedFreeTime,
  isCustomDuration,
  customDurationRange,
  onFreeTimeSelect,
  onCustomDurationToggle,
  onCustomDurationChange,
}: FreeTimeStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Combien de temps avez-vous ?
        </h2>
        <p className="text-gray-600">Sélectionnez la durée qui vous convient</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FREE_TIME_OPTIONS.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`p-6 cursor-pointer transition-all duration-200 ${
                selectedFreeTime === option.id
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:shadow-lg"
              }`}
              onClick={() => onFreeTimeSelect(option.id)}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-orange-600 text-white">
                  <Clock size={24} />
                </div>
                <h3 className="font-semibold text-lg">{option.label}</h3>
                <Badge variant="secondary">{option.duration}</Badge>
                <p className="text-sm text-gray-600 text-center">
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
        className={`rounded-lg p-6 space-y-4 bg-gray-50 ${
          isCustomDuration ? "outline-2 outline-primary" : ""
        }`}
        onClick={onCustomDurationToggle}
      >
        <h4 className="font-semibold text-center">
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
