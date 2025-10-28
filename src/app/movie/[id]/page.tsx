"use client";

import ContentDetail from "@/components/ContentDetail";
import { useParams } from "next/navigation";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);
  return <ContentDetail type="movie" id={movieId} />;
}
