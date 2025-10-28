// Mapping des IDs de plateformes vers leurs URLs officielles
export const getProviderUrl = (providerId: number): string | null => {
  const providerUrls: Record<number, string> = {
    8: "https://www.netflix.com/fr/", // Netflix
    119: "https://www.primevideo.com/", // Amazon Prime Video
    337: "https://www.disneyplus.com/fr-fr", // Disney Plus
    35: "https://www.rakuten.tv/fr", // Rakuten TV
    68: "https://www.microsoft.com/fr-fr/store/movies-and-tv", // Microsoft Store
    2: "https://tv.apple.com/fr", // Apple TV
    3: "https://play.google.com/store/movies", // Google Play Movies
    192: "https://www.youtube.com/", // YouTube
    40: "https://www.sky.com/", // Sky
    384: "https://www.hbomax.com/", // HBO Max
    531: "https://www.paramountplus.com/", // Paramount Plus
    350: "https://www.apple.com/fr/apple-tv-plus/", // Apple TV+
    // Ajoutez d'autres plateformes selon vos besoins
  };

  return providerUrls[providerId] || null;
};
