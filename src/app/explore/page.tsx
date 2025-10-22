"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { MOODS_ARRAY } from "@/constants/moods";
import { useAppStore } from "@/store/useAppStore";
import { ContentType, FREE_TIME_TO_DURATION, FreeTime, Mood } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Film, Tv } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MOODS = MOODS_ARRAY;

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

export default function ExplorePage() {
  const router = useRouter();
  const { setMood, setFreeTime, setContentType, fetchRecommendations } =
    useAppStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedFreeTime, setSelectedFreeTime] = useState<FreeTime | null>(
    null
  );
  const [selectedContentType, setSelectedContentType] =
    useState<ContentType | null>(null);
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  const [customDurationRange, setCustomDurationRange] = useState<number[]>([
    FREE_TIME_TO_DURATION["short"].min,
    FREE_TIME_TO_DURATION["short"].max,
  ]);

  const steps = ["Humeur", "Temps libre", "Type de contenu"];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (
      selectedMood &&
      (selectedFreeTime || isCustomDuration) &&
      selectedContentType
    ) {
      setMood(selectedMood);

      // Si c'est une durée personnalisée, on utilise la classification basée sur la plage
      if (isCustomDuration) {
        setFreeTime(classifyRange(customDurationRange));
      } else {
        setFreeTime(selectedFreeTime!);
      }

      setContentType(selectedContentType);

      await fetchRecommendations();
      router.push("/results");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedMood !== null;
      case 1:
        return selectedFreeTime !== null || isCustomDuration;
      case 2:
        return selectedContentType !== null;
      default:
        return false;
    }
  };

  const renderMoodStep = () => (
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
        {MOODS.map((mood) => {
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
                onClick={() => setSelectedMood(mood.id)}
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

  const renderFreeTimeStep = () => (
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
              onClick={() => {
                setSelectedFreeTime(option.id);
                setIsCustomDuration(false);
                setCustomDurationRange([
                  FREE_TIME_TO_DURATION[option.id].min,
                  Math.min(FREE_TIME_TO_DURATION[option.id].max, 300),
                ]);
              }}
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
        onClick={() => {
          setIsCustomDuration(true);
          setSelectedFreeTime(null);
        }}
      >
        <h4 className="font-semibold text-center">
          {isCustomDuration
            ? "Durée personnalisée sélectionnée"
            : "Durée personnalisée"}
        </h4>
        <div className="space-y-2">
          <Slider
            value={customDurationRange}
            onValueChange={(val) => {
              const range = val as number[];
              setCustomDurationRange(range);
              setSelectedFreeTime(null);
              setIsCustomDuration(true);
            }}
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

  const renderContentTypeStep = () => (
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
                className={`p-8 cursor-pointer transition-all duration-200 ${
                  selectedContentType === type.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedContentType(type.id)}
              >
                <div className="flex flex-col items-center space-y-4">
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderMoodStep();
      case 1:
        return renderFreeTimeStep();
      case 2:
        return renderContentTypeStep();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header avec progression */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Exploration</h1>
            <p className="text-gray-600">
              Étape {currentStep + 1} sur {totalSteps}
            </p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            className="bg-linear-to-r from-primary to-orange-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Indicateurs d'étapes */}
        <div className="flex justify-center space-x-8 mb-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center space-x-2 ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span className="hidden md:block font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-linear-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90"
          >
            {currentStep === totalSteps - 1 ? "Découvrir" : "Suivant"}
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

const classifyRange = (range: number[]): FreeTime => {
  const [min, max] = range;
  const center = (min + max) / 2;
  if (center <= 120) return "short";
  if (center <= 180) return "medium";
  return "long";
};
