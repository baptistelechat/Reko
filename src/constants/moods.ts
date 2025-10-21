import { Mood } from "@/types";
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

export interface MoodConfig {
  id: Mood;
  label: string;
  emoji: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  bgColor: string;
  description: string;
}

export const MOODS_CONFIG: Record<Mood, MoodConfig> = {
  happy: {
    id: "happy",
    label: "Joyeux",
    emoji: "😊",
    icon: Sun,
    color: "bg-yellow-500",
    bgColor: "bg-yellow-100 text-yellow-800",
    description: "Envie de rire et de bonne humeur",
  },
  sad: {
    id: "sad",
    label: "Mélancolique",
    emoji: "😢",
    icon: Moon,
    color: "bg-blue-500",
    bgColor: "bg-blue-100 text-blue-800",
    description: "Besoin d'émotions profondes",
  },
  excited: {
    id: "excited",
    label: "Aventureux",
    emoji: "🚀",
    icon: Zap,
    color: "bg-orange-600",
    bgColor: "bg-green-100 text-green-800",
    description: "Soif d'action et d'aventure",
  },
  romantic: {
    id: "romantic",
    label: "Romantique",
    emoji: "💕",
    icon: Heart,
    color: "bg-pink-500",
    bgColor: "bg-pink-100 text-pink-800",
    description: "Envie d'amour et de tendresse",
  },
  chill: {
    id: "chill",
    label: "Détendu",
    emoji: "😴",
    icon: Coffee,
    color: "bg-green-500",
    bgColor: "bg-purple-100 text-purple-800",
    description: "Moment de relaxation",
  },
  thriller: {
    id: "thriller",
    label: "Frissons",
    emoji: "😱",
    icon: Skull,
    color: "bg-red-600",
    bgColor: "bg-red-100 text-red-800",
    description: "Sensations fortes et suspense",
  },
};

// Export pour compatibilité avec l'ancienne structure
export const MOODS_ARRAY = Object.values(MOODS_CONFIG);
