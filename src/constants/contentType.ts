import { ContentType } from "@/types";
import { Film, Tv } from "lucide-react";

export const CONTENT_OPTIONS = [
  {
    id: "movie" as ContentType,
    label: "Films",
    icon: Film,
    description: "Histoires complètes en une séance",
  },
  {
    id: "tv" as ContentType,
    label: "Séries",
    icon: Tv,
    description: "Aventures à suivre épisode par épisode",
  },
];
