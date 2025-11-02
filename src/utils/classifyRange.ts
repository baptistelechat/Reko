import { FreeTime } from "@/types";

// Fonction pour classifier une plage de durée personnalisée
export const classifyRange = (range: number[]): FreeTime => {
  const [min, max] = range;
  const center = (min + max) / 2;
  if (center <= 120) return "short";
  if (center <= 180) return "medium";
  return "long";
};
