import {
  ContentType,
  Credits,
  FREE_TIME_TO_DURATION,
  FreeTime,
  Genre,
  Mood,
  MOOD_TO_GENRES,
  Movie,
  MovieDetails,
  TMDBResponse,
  TVShow,
  TVShowDetails,
  WatchProvidersResponse,
} from "@/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

class TMDBService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
    if (!this.apiKey) {
      console.warn("TMDB API key is not configured");
    }
  }

  // Fonction utilitaire pour générer les URLs d'images TMDB
  private getImageUrl(
    path: string | null,
    size: "w92" | "w300" | "w500" | "w780" | "original" = "w500"
  ): string {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
  }

  private async fetchFromTMDB<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    // Utilisation de l'en-tête Authorization au lieu du paramètre api_key
    url.searchParams.append("language", "fr-FR");

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("TMDB API error details:", errorData);
        throw new Error(
          `TMDB API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching from TMDB:", error);
      throw error;
    }
  }

  // Obtenir les genres pour les films
  async getMovieGenres(): Promise<Genre[]> {
    const response = await this.fetchFromTMDB<{ genres: Genre[] }>(
      "/genre/movie/list"
    );
    return response.genres;
  }

  // Obtenir les genres pour les séries TV
  async getTVGenres(): Promise<Genre[]> {
    const response = await this.fetchFromTMDB<{ genres: Genre[] }>(
      "/genre/tv/list"
    );
    return response.genres;
  }

  // Rechercher des films populaires
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>("/movie/popular", {
      page: page.toString(),
    });
  }

  // Rechercher des séries TV populaires
  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>("/tv/popular", {
      page: page.toString(),
    });
  }

  // Découvrir des films avec des filtres
  async discoverMovies(
    params: {
      genres?: number[];
      minRuntime?: number;
      maxRuntime?: number;
      sortBy?: string;
      page?: number;
    } = {}
  ): Promise<TMDBResponse<Movie>> {
    const queryParams: Record<string, string> = {
      sort_by: params.sortBy || "popularity.desc",
      page: (params.page || 1).toString(),
    };

    if (params.genres && params.genres.length > 0) {
      queryParams.with_genres = params.genres.join(",");
    }

    if (params.minRuntime) {
      queryParams["with_runtime.gte"] = params.minRuntime.toString();
    }

    if (params.maxRuntime) {
      queryParams["with_runtime.lte"] = params.maxRuntime.toString();
    }

    return this.fetchFromTMDB<TMDBResponse<Movie>>(
      "/discover/movie",
      queryParams
    );
  }

  // Découvrir des séries TV avec des filtres
  async discoverTVShows(
    params: {
      genres?: number[];
      sortBy?: string;
      page?: number;
    } = {}
  ): Promise<TMDBResponse<TVShow>> {
    const queryParams: Record<string, string> = {
      sort_by: params.sortBy || "popularity.desc",
      page: (params.page || 1).toString(),
    };

    if (params.genres && params.genres.length > 0) {
      queryParams.with_genres = params.genres.join(",");
    }

    return this.fetchFromTMDB<TMDBResponse<TVShow>>(
      "/discover/tv",
      queryParams
    );
  }

  // Obtenir les détails d'un film avec crédits
  async getMovieDetails(
    movieId: number,
    includeCredits: boolean = false
  ): Promise<MovieDetails> {
    const params: Record<string, string> = {};
    if (includeCredits) {
      params.append_to_response = "credits";
    }
    return this.fetchFromTMDB<MovieDetails>(`/movie/${movieId}`, params);
  }

  // Obtenir les détails d'une série TV avec crédits
  async getTVShowDetails(
    tvId: number,
    includeCredits: boolean = false
  ): Promise<TVShowDetails> {
    const params: Record<string, string> = {};
    if (includeCredits) {
      params.append_to_response = "credits";
    }
    return this.fetchFromTMDB<TVShowDetails>(`/tv/${tvId}`, params);
  }

  // Obtenir les crédits d'un film
  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchFromTMDB<Credits>(`/movie/${movieId}/credits`);
  }

  // Obtenir les crédits d'une série TV
  async getTVShowCredits(tvId: number): Promise<Credits> {
    return this.fetchFromTMDB<Credits>(`/tv/${tvId}/credits`);
  }

  // Obtenir des films similaires
  async getSimilarMovies(
    movieId: number,
    page: number = 1
  ): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(
      `/movie/${movieId}/similar`,
      {
        page: page.toString(),
      }
    );
  }

  // Obtenir des séries TV similaires
  async getSimilarTVShows(
    tvId: number,
    page: number = 1
  ): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${tvId}/similar`, {
      page: page.toString(),
    });
  }

  // Obtenir des recommandations pour un film
  async getMovieRecommendations(
    movieId: number,
    page: number = 1
  ): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(
      `/movie/${movieId}/recommendations`,
      {
        page: page.toString(),
      }
    );
  }

  // Obtenir des recommandations pour une série TV
  async getTVShowRecommendations(
    tvId: number,
    page: number = 1
  ): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(
      `/tv/${tvId}/recommendations`,
      {
        page: page.toString(),
      }
    );
  }

  // Rechercher du contenu
  async searchMulti(
    query: string,
    page: number = 1
  ): Promise<TMDBResponse<Movie | TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<Movie | TVShow>>("/search/multi", {
      query,
      page: page.toString(),
    });
  }

  // Rechercher des films
  async searchMovies(
    query: string,
    page: number = 1
  ): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>("/search/movie", {
      query,
      page: page.toString(),
    });
  }

  // Rechercher des séries TV
  async searchTVShows(
    query: string,
    page: number = 1
  ): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>("/search/tv", {
      query,
      page: page.toString(),
    });
  }

  // Obtenir des recommandations basées sur les préférences utilisateur
  async getRecommendations(
    mood: Mood,
    freeTime: FreeTime,
    contentType: ContentType,
    page: number = 1
  ): Promise<TMDBResponse<Movie | TVShow>> {
    const genres = MOOD_TO_GENRES[mood];
    const duration = FREE_TIME_TO_DURATION[freeTime];

    if (contentType === "movie") {
      return this.discoverMovies({
        genres,
        minRuntime: duration.min,
        maxRuntime: duration.max === 999 ? undefined : duration.max,
        sortBy: "vote_average.desc",
        page,
      });
    } else {
      return this.discoverTVShows({
        genres,
        sortBy: "vote_average.desc",
        page,
      });
    }
  }

  // Obtenir les films/séries tendances
  async getTrending(
    mediaType: "movie" | "tv" | "all" = "all",
    timeWindow: "day" | "week" = "week"
  ): Promise<TMDBResponse<Movie | TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<Movie | TVShow>>(
      `/trending/${mediaType}/${timeWindow}`
    );
  }

  // Obtenir les films les mieux notés
  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>("/movie/top_rated", {
      page: page.toString(),
    });
  }

  // Obtenir les séries TV les mieux notées
  async getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>("/tv/top_rated", {
      page: page.toString(),
    });
  }

  // Obtenir les films à venir
  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>("/movie/upcoming", {
      page: page.toString(),
    });
  }

  // Obtenir les films actuellement au cinéma
  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>("/movie/now_playing", {
      page: page.toString(),
    });
  }

  // Obtenir les séries TV diffusées aujourd'hui
  async getTVShowsAiringToday(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>("/tv/airing_today", {
      page: page.toString(),
    });
  }

  // Obtenir les séries TV diffusées cette semaine
  async getTVShowsOnTheAir(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>("/tv/on_the_air", {
      page: page.toString(),
    });
  }

  // Obtenir les plateformes de streaming pour un film
  async getMovieWatchProviders(
    movieId: number
  ): Promise<WatchProvidersResponse> {
    return this.fetchFromTMDB<WatchProvidersResponse>(
      `/movie/${movieId}/watch/providers`
    );
  }

  // Obtenir les plateformes de streaming pour une série TV
  async getTVWatchProviders(tvId: number): Promise<WatchProvidersResponse> {
    return this.fetchFromTMDB<WatchProvidersResponse>(
      `/tv/${tvId}/watch/providers`
    );
  }

  // Lister le catalogue des plateformes par type de média (movie/tv)
  async getWatchProvidersCatalog(
    mediaType: "movie" | "tv" = "movie",
    region: string = "FR"
  ): Promise<Array<{ provider_name: string; logo_path: string | null }>> {
    const res = await this.fetchFromTMDB<{
      results: Array<{ provider_name: string; logo_path: string | null }>;
    }>(`/watch/providers/${mediaType}`, { watch_region: region });
    return res.results || [];
  }

  // Obtenir les images d'un film
  async getMovieImages(movieId: number): Promise<{
    backdrops: Array<{
      aspect_ratio: number;
      file_path: string;
      height: number;
      width: number;
      vote_average: number;
      vote_count: number;
    }>;
    posters: Array<{
      aspect_ratio: number;
      file_path: string;
      height: number;
      width: number;
      vote_average: number;
      vote_count: number;
    }>;
  }> {
    return this.fetchFromTMDB(`/movie/${movieId}/images`);
  }

  // Obtenir les images d'une série TV
  async getTVImages(tvId: number): Promise<{
    backdrops: Array<{
      aspect_ratio: number;
      file_path: string;
      height: number;
      width: number;
      vote_average: number;
      vote_count: number;
    }>;
    posters: Array<{
      aspect_ratio: number;
      file_path: string;
      height: number;
      width: number;
      vote_average: number;
      vote_count: number;
    }>;
  }> {
    return this.fetchFromTMDB(`/tv/${tvId}/images`);
  }

  // Obtenir les vidéos d'un film
  async getMovieVideos(movieId: number): Promise<{
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
      published_at: string;
    }>;
  }> {
    return this.fetchFromTMDB(`/movie/${movieId}/videos`);
  }

  // Obtenir les vidéos d'une série TV
  async getTVVideos(tvId: number): Promise<{
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
      published_at: string;
    }>;
  }> {
    return this.fetchFromTMDB(`/tv/${tvId}/videos`);
  }

  // Obtenir les mots-clés d'un film
  async getMovieKeywords(movieId: number): Promise<{
    keywords: Array<{
      id: number;
      name: string;
    }>;
  }> {
    return this.fetchFromTMDB(`/movie/${movieId}/keywords`);
  }

  // Obtenir les mots-clés d'une série TV
  async getTVKeywords(tvId: number): Promise<{
    results: Array<{
      id: number;
      name: string;
    }>;
  }> {
    return this.fetchFromTMDB(`/tv/${tvId}/keywords`);
  }

  // Obtenir les liens externes d'un film
  async getMovieExternalIds(movieId: number): Promise<{
    imdb_id: string | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
    wikidata_id: string | null;
  }> {
    return this.fetchFromTMDB(`/movie/${movieId}/external_ids`);
  }

  // Obtenir les liens externes d'une série TV
  async getTVExternalIds(tvId: number): Promise<{
    imdb_id: string | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
    wikidata_id: string | null;
  }> {
    return this.fetchFromTMDB(`/tv/${tvId}/external_ids`);
  }

  getPosterUrl(path: string | null): string {
    return this.getImageUrl(path, "w500");
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, "w780");
  }

  getProfileUrl(path: string | null): string {
    return this.getImageUrl(path, "w300");
  }

  getCompanyLogoUrl(path: string | null): string {
    return this.getImageUrl(path, "w92");
  }

  // Obtenir le titre d'un contenu (film ou série)
  getContentTitle(content: Movie | TVShow): string {
    return "title" in content ? content.title : content.name;
  }

  // Obtenir la date de sortie d'un contenu
  getContentReleaseDate(content: Movie | TVShow): string {
    return "release_date" in content
      ? content.release_date
      : content.first_air_date;
  }

  // Formater la durée en heures et minutes
  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}min`;
    }

    return remainingMinutes === 0
      ? `${hours}h`
      : `${hours}h ${remainingMinutes}min`;
  }

  // Formater la note
  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  // Obtenir l'année de sortie
  getReleaseYear(date: string): string {
    return new Date(date).getFullYear().toString();
  }

  // Vérifier si l'API key est configurée
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Instance singleton
export const tmdbService = new TMDBService();
export default tmdbService;
