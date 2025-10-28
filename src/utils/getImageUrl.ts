export const getImageUrl = (
  path: string | null,
  size: "w300" | "w500" | "w780" | "original" = "w500"
) => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
};
