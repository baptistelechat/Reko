import { FreeTime } from "@/types";
import { Clock10, Clock2, Clock4, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface FreeTimeOption {
  id: FreeTime;
  label: string;
  duration: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const FREE_TIME_OPTIONS: FreeTimeOption[] = [
  {
    id: "short" as FreeTime,
    label: "Court",
    duration: "< 2h",
    description: "Un épisode ou un film court",
    icon: Clock2,
  },
  {
    id: "medium" as FreeTime,
    label: "Moyen",
    duration: "2-3h",
    description: "Un bon film ou quelques épisodes",
    icon: Clock4,
  },
  {
    id: "long" as FreeTime,
    label: "Long",
    duration: "> 3h",
    description: "Une soirée complète ou un marathon",
    icon: Clock10,
  },
];
