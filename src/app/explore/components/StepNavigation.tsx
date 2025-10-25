"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const StepNavigation = ({
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
}: StepNavigationProps) => {
  return (
    <div className="mx-auto mt-12 max-w-4xl">
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Précédent
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="from-primary hover:from-primary/90 flex items-center gap-2 bg-linear-to-r to-orange-600 hover:to-orange-600/90"
        >
          {currentStep === totalSteps - 1 ? "Découvrir" : "Suivant"}
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};
