"use client";

import ContentDetail from "@/components/ContentDetail";
import { useParams } from "next/navigation";

export default function TVShowDetailPage() {
  const params = useParams();
  const tvId = parseInt(params.id as string);
  return <ContentDetail type="tv" id={tvId} />;
}
