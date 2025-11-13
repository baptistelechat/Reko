import { tmdbService } from '@/services/tmdb';

type MediaType = 'movie' | 'tv';

const normalize = (s: string) => s.trim().toLowerCase();

const nameCandidates = (name: string) => {
  const n = normalize(name);
  if (n.includes('netflix')) return ['netflix'];
  if (n.includes('amazon') || n.includes('prime')) return ['amazon prime video', 'prime video'];
  if (n.includes('disney')) return ['disney+', 'disney plus'];
  if (n.includes('apple')) return ['apple tv', 'apple tv+'];
  if (n.includes('canal')) return ['canal+', 'canal plus', 'mycanal'];
  if (n.includes('crunchy')) return ['crunchyroll'];
  return [n];
};

export const getProviderLogoUrlByName = async (
  name: string,
  mediaType: MediaType = 'movie',
  region: string = 'FR'
): Promise<string> => {
  try {
    if (!tmdbService.isConfigured()) return '';
    const providers = await tmdbService.getWatchProvidersCatalog(mediaType, region);
    const candidates = nameCandidates(name);
    const match = providers.find((p) => candidates.some((c) => normalize(p.provider_name).includes(c)));
    return match ? tmdbService.getCompanyLogoUrl(match.logo_path) : '';
  } catch (e) {
    console.warn('getProviderLogoUrlByName failed:', e);
    return '';
  }
};

export default getProviderLogoUrlByName;
