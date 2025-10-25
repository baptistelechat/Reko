"use client";

import { ProgressHeader } from "@/app/explore/components/ProgressHeader";
import { ContentTypeStep } from "@/app/explore/components/step/ContentTypeStep";
import { FreeTimeStep } from "@/app/explore/components/step/FreeTimeStep";
import { MoodStep } from "@/app/explore/components/step/MoodStep";
import { StepNavigation } from "@/app/explore/components/StepNavigation";
import { useAppStore } from "@/store/useAppStore";
import { ContentType, FREE_TIME_TO_DURATION, FreeTime, Mood } from "@/types";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const classifyRange = (range: number[]): FreeTime => {
  const [min, max] = range;
  const center = (min + max) / 2;
  if (center <= 120) return "short";
  if (center <= 180) return "medium";
  return "long";
};

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Handle URL parameters on component mount
  useEffect(() => {
    const moodParam = searchParams.get("mood");
    const stepParam = searchParams.get("step");

    if (moodParam) {
      setSelectedMood(moodParam as Mood);
    }

    if (stepParam) {
      const stepIndex = parseInt(stepParam, 10);
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        setCurrentStep(stepIndex);
      }
    }
  }, [searchParams, totalSteps]);

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

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
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

  const canProceed = () => {
    return isStepValid(currentStep);
  };

  const handleFreeTimeSelect = (freeTime: FreeTime) => {
    setSelectedFreeTime(freeTime);
    setIsCustomDuration(false);
    setCustomDurationRange([
      FREE_TIME_TO_DURATION[freeTime].min,
      Math.min(FREE_TIME_TO_DURATION[freeTime].max, 300),
    ]);
  };

  const handleCustomDurationToggle = () => {
    setIsCustomDuration(true);
    setSelectedFreeTime(null);
  };

  const handleStepClick = (stepIndex: number) => {
    // Permettre de naviguer vers n'importe quelle étape si toutes les étapes intermédiaires sont valides
    if (stepIndex <= currentStep) {
      // Navigation vers les étapes précédentes : toujours autorisée
      setCurrentStep(stepIndex);
    } else if (stepIndex > currentStep) {
      // Navigation vers les étapes futures : vérifier que toutes les étapes intermédiaires sont valides
      let canNavigate = true;
      for (let i = currentStep; i < stepIndex; i++) {
        if (!isStepValid(i)) {
          canNavigate = false;
          break;
        }
      }
      if (canNavigate) {
        setCurrentStep(stepIndex);
      }
    }
  };

  const handleCustomDurationChange = (range: number[]) => {
    setCustomDurationRange(range);
    setSelectedFreeTime(null);
    setIsCustomDuration(true);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <MoodStep
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        );
      case 1:
        return (
          <FreeTimeStep
            selectedMood={selectedMood}
            selectedFreeTime={selectedFreeTime}
            isCustomDuration={isCustomDuration}
            customDurationRange={customDurationRange}
            onFreeTimeSelect={handleFreeTimeSelect}
            onCustomDurationToggle={handleCustomDurationToggle}
            onCustomDurationChange={handleCustomDurationChange}
          />
        );
      case 2:
        return (
          <ContentTypeStep
            selectedContentType={selectedContentType}
            onContentTypeSelect={setSelectedContentType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header avec progression */}
      <ProgressHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
        onBack={() => router.push("/")}
        onStepClick={handleStepClick}
        isStepValid={isStepValid}
      />

      {/* Contenu de l'étape */}
      <div className="mx-auto max-w-4xl">
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
      </div>

      {/* Navigation */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        canProceed={canProceed()}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
