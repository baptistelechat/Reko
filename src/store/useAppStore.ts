import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppState, 
  WatchlistItem, 
  ContentType,
  Mood,
  FreeTime 
} from '@/types';
import { tmdbService } from '@/services/tmdb';

interface AppStore extends AppState {
  // Actions pour les préférences
  setMood: (mood: Mood | null) => void;
  setFreeTime: (freeTime: FreeTime | null) => void;
  setContentType: (contentType: ContentType | null) => void;
  resetPreferences: () => void;
  
  // Actions pour les recommandations
  fetchRecommendations: () => Promise<void>;
  clearRecommendations: () => void;
  
  // Actions pour la watchlist
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number, type: ContentType) => void;
  isInWatchlist: (id: number, type: ContentType) => boolean;
  
  // Actions pour les favoris
  addToFavorites: (item: WatchlistItem) => void;
  removeFromFavorites: (id: number, type: ContentType) => void;
  isInFavorites: (id: number, type: ContentType) => boolean;
  
  // Actions pour l'état de l'application
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState: AppState = {
  preferences: {
    mood: null,
    freeTime: null,
    contentType: null
  },
  watchlist: [],
  favorites: [],
  currentRecommendations: [],
  isLoading: false,
  error: null
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions pour les préférences
      setMood: (mood) => 
        set((state) => ({
          preferences: { ...state.preferences, mood }
        })),

      setFreeTime: (freeTime) => 
        set((state) => ({
          preferences: { ...state.preferences, freeTime }
        })),

      setContentType: (contentType) => 
        set((state) => ({
          preferences: { ...state.preferences, contentType }
        })),

      resetPreferences: () => 
        set(() => ({
          preferences: initialState.preferences,
          currentRecommendations: [],
          error: null
        })),

      // Actions pour les recommandations
      fetchRecommendations: async () => {
        const { preferences } = get();
        const { mood, freeTime, contentType } = preferences;

        if (!mood || !freeTime || !contentType) {
          set({ error: 'Toutes les préférences doivent être définies' });
          return;
        }

        if (!tmdbService.isConfigured()) {
          set({ error: 'La clé API TMDB n\'est pas configurée' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await tmdbService.getRecommendations(
            mood,
            freeTime,
            contentType
          );
          
          set({ 
            currentRecommendations: response.results,
            isLoading: false 
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des recommandations:', error);
          set({ 
            error: 'Erreur lors de la récupération des recommandations',
            isLoading: false 
          });
        }
      },

      clearRecommendations: () => 
        set({ currentRecommendations: [] }),

      // Actions pour la watchlist
      addToWatchlist: (item) => 
        set((state) => {
          const exists = state.watchlist.some(
            (w) => w.id === item.id && w.type === item.type
          );
          
          if (exists) return state;
          
          return {
            watchlist: [...state.watchlist, item]
          };
        }),

      removeFromWatchlist: (id, type) => 
        set((state) => ({
          watchlist: state.watchlist.filter(
            (item) => !(item.id === id && item.type === type)
          )
        })),

      isInWatchlist: (id, type) => {
        const { watchlist } = get();
        return watchlist.some((item) => item.id === id && item.type === type);
      },

      // Actions pour les favoris
      addToFavorites: (item) => 
        set((state) => {
          const exists = state.favorites.some(
            (f) => f.id === item.id && f.type === item.type
          );
          
          if (exists) return state;
          
          return {
            favorites: [...state.favorites, item]
          };
        }),

      removeFromFavorites: (id, type) => 
        set((state) => ({
          favorites: state.favorites.filter(
            (item) => !(item.id === id && item.type === type)
          )
        })),

      isInFavorites: (id, type) => {
        const { favorites } = get();
        return favorites.some((item) => item.id === id && item.type === type);
      },

      // Actions pour l'état de l'application
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'reko-app-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        favorites: state.favorites,
        preferences: state.preferences
      })
    }
  )
);

// Hooks utilitaires
export const usePreferences = () => useAppStore((state) => state.preferences);
export const useWatchlist = () => useAppStore((state) => state.watchlist);
export const useFavorites = () => useAppStore((state) => state.favorites);
export const useRecommendations = () => useAppStore((state) => state.currentRecommendations);
export const useAppLoading = () => useAppStore((state) => state.isLoading);
export const useAppError = () => useAppStore((state) => state.error);