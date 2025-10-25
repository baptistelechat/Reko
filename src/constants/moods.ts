import { FreeTime, Mood } from "@/types";
import {
  Coffee,
  Heart,
  LucideProps,
  Moon,
  Skull,
  Sun,
  Zap,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import colors from "tailwindcss/colors";

// Types basés sur les couleurs officielles Tailwind CSS
type TailwindColor = keyof typeof colors;

// Helper function pour générer les couleurs
const createColorConfig = (baseColor: TailwindColor) => ({
  color: `bg-${baseColor}-500` as const,
  bgColor: `bg-${baseColor}-100 text-${baseColor}-800` as const,
  colorFreeTime: {
    short: `bg-${baseColor}-500` as const,
    medium: `bg-${baseColor}-700` as const,
    long: `bg-${baseColor}-950` as const,
  } as Record<FreeTime, string>,
});

export interface MoodConfig {
  id: Mood;
  label: string;
  emoji: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  bgColor: string;
  colorFreeTime: Record<FreeTime, string>;
  description: string;
}

export const MOODS_CONFIG: Record<Mood, MoodConfig> = {
  happy: {
    id: "happy",
    label: "Joyeux",
    emoji: "😊",
    icon: Sun,
    ...createColorConfig("yellow"),
    description: "Envie de rire et de bonne humeur",
  },
  sad: {
    id: "sad",
    label: "Mélancolique",
    emoji: "😢",
    icon: Moon,
    ...createColorConfig("blue"),
    description: "Besoin d'émotions profondes",
  },
  excited: {
    id: "excited",
    label: "Aventureux",
    emoji: "🚀",
    icon: Zap,
    ...createColorConfig("green"),
    description: "Soif d'action et d'aventure",
  },
  romantic: {
    id: "romantic",
    label: "Romantique",
    emoji: "💕",
    icon: Heart,
    ...createColorConfig("pink"),
    description: "Envie d'amour et de tendresse",
  },
  chill: {
    id: "chill",
    label: "Détendu",
    emoji: "😴",
    icon: Coffee,
    ...createColorConfig("purple"),
    description: "Moment de relaxation",
  },
  thriller: {
    id: "thriller",
    label: "Frissons",
    emoji: "😱",
    icon: Skull,
    ...createColorConfig("red"),
    description: "Sensations fortes et suspense",
  },
};

// Export pour compatibilité avec l'ancienne structure
export const MOODS_ARRAY = Object.values(MOODS_CONFIG);
