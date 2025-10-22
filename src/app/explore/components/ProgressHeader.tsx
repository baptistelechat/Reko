"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onBack: () => void;
  onStepClick?: (stepIndex: number) => void;
  isStepValid?: (stepIndex: number) => boolean;
}

export const ProgressHeader = ({
  currentStep,
  totalSteps,
  steps,
  onBack,
  onStepClick,
  isStepValid,
}: ProgressHeaderProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
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
        {steps.map((step, index) => {
          // Permettre de cliquer sur toutes les étapes précédentes et les étapes suivantes si toutes les étapes intermédiaires sont valides
          let isClickable = false;
          if (onStepClick) {
            if (index <= currentStep) {
              // Étapes précédentes et actuelle : toujours cliquables
              isClickable = true;
            } else if (index > currentStep && isStepValid) {
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
          }
          const canClick = isClickable;
          
          return (
            <div
              key={step}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              } ${canClick ? "cursor-pointer hover:text-primary/80" : ""}`}
              onClick={() => canClick && onStepClick(index)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  index <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span className="hidden md:block font-medium">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};