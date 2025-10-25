"use client";

import { Button } from "@/components/ui/button";
import { STEPS } from "@/constants/steps";
import { useAppStore } from "@/store/useAppStore";
import { FreeTime } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const classifyRange = (range: number[]): FreeTime => {
  const [min, max] = range;
  const center = (min + max) / 2;
  if (center <= 120) return "short";
  if (center <= 180) return "medium";
  return "long";
};

export const StepNavigation = () => {
  const router = useRouter();
  const {
    currentStep,
    selectedMood,
    selectedFreeTime,
    selectedContentType,
    isCustomDuration,
    customDurationRange,
    setCurrentStep,
    setMood,
    setFreeTime,
    setContentType,
    fetchRecommendations,
  } = useAppStore();

  const totalSteps = STEPS.length;

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
  return (
    <div className="mx-auto mt-12 max-w-4xl">
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
          className="from-primary hover:from-primary/90 flex items-center gap-2 bg-linear-to-r to-orange-600 hover:to-orange-600/90"
        >
          {currentStep === totalSteps - 1 ? "Découvrir" : "Suivant"}
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};
