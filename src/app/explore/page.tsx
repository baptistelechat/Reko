"use client";

import { ProgressHeader } from "@/app/explore/components/ProgressHeader";
import { ContentTypeStep } from "@/app/explore/components/step/ContentTypeStep";
import { FreeTimeStep } from "@/app/explore/components/step/FreeTimeStep";
import { MoodStep } from "@/app/explore/components/step/MoodStep";
import { StepNavigation } from "@/app/explore/components/StepNavigation";
import { STEPS } from "@/constants/steps";
import { useAppStore } from "@/store/useAppStore";
import { Mood } from "@/types";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentStep, setCurrentStep, setSelectedMood } = useAppStore();

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
      <ProgressHeader onBack={() => router.push("/")} />

      {/* Contenu de l'étape */}
      <div className="mx-auto max-w-4xl">
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
      </div>

      {/* Navigation */}
      <StepNavigation />
    </div>
  );
}
