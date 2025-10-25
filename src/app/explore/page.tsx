"use client";

import { ProgressHeader } from "@/app/explore/components/ProgressHeader";
import { ContentTypeStep } from "@/app/explore/components/step/ContentTypeStep";
import { FreeTimeStep } from "@/app/explore/components/step/FreeTimeStep";
import { MoodStep } from "@/app/explore/components/step/MoodStep";
import { StepNavigation } from "@/app/explore/components/StepNavigation";
import { STEPS } from "@/constants/steps";
import { useAppStore } from "@/store/useAppStore";
import { FreeTime, Mood } from "@/types";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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

  const {
    currentStep,
    selectedMood,
    selectedFreeTime,
    selectedContentType,
    isCustomDuration,
    customDurationRange,
    setCurrentStep,
    setSelectedMood,
    setMood,
    setFreeTime,
    setContentType,
    fetchRecommendations,
  } = useAppStore();

  const totalSteps = STEPS.length;

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
  }, [searchParams, totalSteps, setSelectedMood, setCurrentStep]);

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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <MoodStep />;
      case 1:
        return <FreeTimeStep />;
      case 2:
        return <ContentTypeStep />;
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
        steps={STEPS}
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
