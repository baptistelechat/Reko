// Types pour l'application REKO
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  popularity: number;
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Types pour les crédits (casting)
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Credits {
  cast: CastMember[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  credits?: Credits;
}

export interface TVShowDetails extends TVShow {
  created_by: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  genres: Genre[];
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }[];
  status: string;
  tagline: string;
  type: string;
  credits?: Credits;
}

// Types pour l'application
export type ContentType = 'movie' | 'tv';

export type Mood = 
  | 'happy' 
  | 'sad' 
  | 'excited' 
  | 'romantic' 
  | 'chill'
  | 'thriller';

export type FreeTime = 'short' | 'medium' | 'long';

export interface UserPreferences {
  mood: Mood | null;
  freeTime: FreeTime | null;
  contentType: ContentType | null;
}

export interface WatchlistItem {
  id: number;
  type: ContentType;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: string;
}

export interface AppState {
  preferences: UserPreferences;
  watchlist: WatchlistItem[];
  favorites: WatchlistItem[];
  currentRecommendations: (Movie | TVShow)[];
  isLoading: boolean;
  error: string | null;
}

// Mapping des moods vers les genres TMDB
export const MOOD_TO_GENRES: Record<Mood, number[]> = {
  happy: [35, 10751, 16], // Comedy, Family, Animation
  sad: [18, 10749], // Drama, Romance
  excited: [28, 12, 53], // Action, Adventure, Thriller
  romantic: [10749, 35], // Romance, Comedy
  chill: [99, 10402, 10770], // Documentary, Music, TV Movie
  thriller: [27, 53, 9648] // Horror, Thriller, Mystery
};

// Mapping du temps libre vers la durée
export const FREE_TIME_TO_DURATION: Record<FreeTime, { min: number; max: number }> = {
  'short': { min: 0, max: 120 },
  'medium': { min: 120, max: 180 },
  'long': { min: 180, max: 999 }
};