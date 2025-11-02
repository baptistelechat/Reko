"use client";

import { Card } from "@/components/ui/card";
import { MovieDetails, TVShowDetails } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { motion } from "framer-motion";
import { List } from "lucide-react";
import ContentTitle from "../ContentTitle";

type ContentInfoProps = {
  type: "movie" | "tv";
  data: MovieDetails | TVShowDetails;
  getStatusLabel: (status: string) => string;
};

export default function ContentInfo({
  type,
  data,
  getStatusLabel,
}: ContentInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6">
        <ContentTitle icon={List} title="Informations" />

        <div className="space-y-3 text-sm">
          {type === "movie" ? (
            <>
              <div>
                <span className="font-semibold text-gray-600">
                  Titre original :
                </span>
                <p>{(data as MovieDetails).original_title}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Statut :</span>
                <p>{(data as MovieDetails).status}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Langue originale :
                </span>
                <p>{(data as MovieDetails).original_language?.toUpperCase()}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Budget :</span>
                <p>
                  {(data as MovieDetails).budget > 0
                    ? `$${(data as MovieDetails).budget.toLocaleString()}`
                    : "Non communiqué"}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Recettes :</span>
                <p>
                  {(data as MovieDetails).revenue > 0
                    ? `$${(data as MovieDetails).revenue.toLocaleString()}`
                    : "Non communiqué"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-semibold text-gray-600">
                  Titre original :
                </span>
                <p>{(data as TVShowDetails).original_name}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Statut :</span>
                <p>{getStatusLabel((data as TVShowDetails).status)}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Langue originale :
                </span>
                <p>
                  {(data as TVShowDetails).original_language?.toUpperCase()}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Première diffusion :
                </span>
                <p>
                  {(data as TVShowDetails).first_air_date &&
                    formatDate((data as TVShowDetails).first_air_date)}
                </p>
              </div>
              {(data as TVShowDetails).last_air_date && (
                <div>
                  <span className="font-semibold text-gray-600">
                    Dernière diffusion :
                  </span>
                  <p>{formatDate((data as TVShowDetails).last_air_date)}</p>
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-600">
                  Nombre d'épisodes :
                </span>
                <p>{(data as TVShowDetails).number_of_episodes}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Créé par :</span>
                <p>
                  {(data as TVShowDetails).created_by?.length > 0
                    ? (data as TVShowDetails).created_by
                        .map((creator) => creator.name)
                        .join(", ")
                    : "Non spécifié"}
                </p>
              </div>
              {(data as TVShowDetails).networks &&
                (data as TVShowDetails).networks.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-600">
                      Diffuseurs :
                    </span>
                    <p>
                      {(data as TVShowDetails).networks
                        .map((network) => network.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
