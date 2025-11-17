"use client";

import { Button } from "@/components/ui/button";
import { STEPS } from "@/constants/steps";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProgressHeaderProps {
  onBack?: () => void;
}

export const ProgressHeader = ({ onBack }: ProgressHeaderProps) => {
  const router = useRouter();
  const {
    currentStep,
    selectedMood,
    selectedFreeTime,
    selectedContentType,
    isCustomDuration,
    setCurrentStep,
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const header = document.getElementById("explore-header");
    if (header && typeof header.scrollIntoView === "function") {
      header.scrollIntoView({ behavior: "smooth", block: "start" });
      header.focus();
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);
  return (
    <div id="explore-header" tabIndex={-1} className="mx-auto mb-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Retour
        </Button>
        <div className="text-center">
<h1 className="text-2xl text-gray-900">Exploration</h1>
          <p className="text-gray-600">
            Étape {currentStep + 1} sur {totalSteps}
          </p>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Barre de progression */}
      <div className="mb-8 h-2 w-full rounded-full bg-gray-200">
        <motion.div
          className="from-primary h-2 rounded-full bg-linear-to-r to-orange-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Indicateurs d'étapes */}
      <div className="mb-8 flex justify-center space-x-8">
        {STEPS.map((step, index) => {
          // Permettre de cliquer sur toutes les étapes précédentes et les étapes suivantes si toutes les étapes intermédiaires sont valides
          let isClickable = false;
          if (index <= currentStep) {
            // Étapes précédentes et actuelle : toujours cliquables
            isClickable = true;
          } else if (index > currentStep) {
            // Étapes futures : vérifier que toutes les étapes intermédiaires sont valides
            let allIntermediateStepsValid = true;
            for (let i = currentStep; i < index; i++) {
              if (!isStepValid(i)) {
                allIntermediateStepsValid = false;
                break;
              }
            }
            isClickable = allIntermediateStepsValid;
          }
          const canClick = isClickable;

          return (
            <div
              key={step}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              } ${canClick ? "hover:text-primary/80 cursor-pointer" : ""}`}
              onClick={() => canClick && handleStepClick(index)}
            >
              <div
                className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                  index <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span className="hidden font-medium md:block">
                {step}
                {}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
