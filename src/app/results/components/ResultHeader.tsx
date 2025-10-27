"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTENT_OPTIONS } from "@/constants/contentType";
import { FREE_TIME_OPTIONS } from "@/constants/freeTime";
import { MOODS_CONFIG } from "@/constants/moods";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { classifyRange } from "@/utils/classifyRange";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const ResultHeader = () => {
  const router = useRouter();
  const {
    preferences,
    fetchRecommendations,
    isCustomDuration,
    customDurationRange,
  } = useAppStore();

  const handleNewSearch = () => {
    router.push("/explore");
  };
  const handleRefresh = async () => {
    await fetchRecommendations();
  };

  const getContentTypeLabel = (type: string) => {
    return type === "movie" ? "Films" : "Séries";
  };

  // Fonction pour formater l'affichage du temps libre
  const getFreeTimeDisplay = () => {
    if (isCustomDuration && customDurationRange) {
      // Affichage pour durée personnalisée
      const [min, max] = customDurationRange;
      const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0
          ? `${hours}h${mins > 0 ? ` ${mins}min` : ""}`
          : `${mins}min`;
      };

      const classifiedType = classifyRange(customDurationRange);
      const option = FREE_TIME_OPTIONS.find((opt) => opt.id === classifiedType);
      const IconComponent = option?.icon;

      return {
        label: `${formatTime(min)} — ${formatTime(max)}`,
        icon: IconComponent,
      };
    } else {
      // Affichage pour durée prédéfinie
      const option = FREE_TIME_OPTIONS.find(
        (opt) => opt.id === preferences.freeTime
      );
      return {
        label: option
          ? `${option.label} (${option.duration})`
          : preferences.freeTime,
        icon: option?.icon,
      };
    }
  };

  const freeTimeDisplay = getFreeTimeDisplay();
  const moodConfig = MOODS_CONFIG[preferences.mood!];
  const MoodIcon = moodConfig?.icon;
  const ContentTypeIcon = CONTENT_OPTIONS.find(
    (opt) => opt.id === preferences.contentType
  )?.icon;

  return (
    <div className="mb-8 flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={handleNewSearch}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Nouvelle recherche
      </Button>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Vos recommandations
        </h1>
        <div className="mt-1 flex items-center justify-center gap-2">
          <Badge className={cn("flex gap-0.5", moodConfig?.bgColor || "")}>
            {MoodIcon && <MoodIcon size={16} className="mr-0.5" />}
            {moodConfig?.label || preferences.mood}
          </Badge>
          <Badge className={cn("flex gap-0.5", moodConfig?.bgColor || "")}>
            {freeTimeDisplay.icon && (
              <freeTimeDisplay.icon size={16} className="mr-0.5" />
            )}
            {freeTimeDisplay.label}
          </Badge>
          <Badge className={cn("flex gap-0.5", moodConfig?.bgColor || "")}>
            {ContentTypeIcon && (
              <ContentTypeIcon size={16} className="mr-0.5" />
            )}
            {getContentTypeLabel(preferences.contentType!)}
          </Badge>
        </div>
      </div>

      <Button
        onClick={handleRefresh}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw size={20} />
        Actualiser
      </Button>
    </div>
  );
};

export default ResultHeader;
