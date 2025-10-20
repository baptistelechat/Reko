import { WatchlistItem, UserPreferences } from '@/types';

// Clés pour le localStorage
const STORAGE_KEYS = {
  WATCHLIST: 'reko-watchlist',
  FAVORITES: 'reko-favorites',
  PREFERENCES: 'reko-preferences'
} as const;

// Utilitaires pour la gestion du localStorage
export class LocalStorageManager {
  // Méthode générique pour sauvegarder des données
  private static setItem<T>(key: string, data: T): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde dans localStorage (${key}):`, error);
    }
  }

  // Méthode générique pour récupérer des données
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture du localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  // Méthode pour supprimer un élément
  private static removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression du localStorage (${key}):`, error);
    }
  }

  // Gestion de la watchlist
  static getWatchlist(): WatchlistItem[] {
    return this.getItem(STORAGE_KEYS.WATCHLIST, []);
  }

  static setWatchlist(watchlist: WatchlistItem[]): void {
    this.setItem(STORAGE_KEYS.WATCHLIST, watchlist);
  }

  static addToWatchlist(item: WatchlistItem): void {
    const watchlist = this.getWatchlist();
    const exists = watchlist.some(w => w.id === item.id && w.type === item.type);
    
    if (!exists) {
      const updatedWatchlist = [...watchlist, { ...item, addedAt: new Date().toISOString() }];
      this.setWatchlist(updatedWatchlist);
    }
  }

  static removeFromWatchlist(id: number, type: 'movie' | 'tv'): void {
    const watchlist = this.getWatchlist();
    const updatedWatchlist = watchlist.filter(item => !(item.id === id && item.type === type));
    this.setWatchlist(updatedWatchlist);
  }

  static isInWatchlist(id: number, type: 'movie' | 'tv'): boolean {
    const watchlist = this.getWatchlist();
    return watchlist.some(item => item.id === id && item.type === type);
  }

  // Gestion des favoris
  static getFavorites(): WatchlistItem[] {
    return this.getItem(STORAGE_KEYS.FAVORITES, []);
  }

  static setFavorites(favorites: WatchlistItem[]): void {
    this.setItem(STORAGE_KEYS.FAVORITES, favorites);
  }

  static addToFavorites(item: WatchlistItem): void {
    const favorites = this.getFavorites();
    const exists = favorites.some(f => f.id === item.id && f.type === item.type);
    
    if (!exists) {
      const updatedFavorites = [...favorites, { ...item, addedAt: new Date().toISOString() }];
      this.setFavorites(updatedFavorites);
    }
  }

  static removeFromFavorites(id: number, type: 'movie' | 'tv'): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(item => !(item.id === id && item.type === type));
    this.setFavorites(updatedFavorites);
  }

  static isInFavorites(id: number, type: 'movie' | 'tv'): boolean {
    const favorites = this.getFavorites();
    return favorites.some(item => item.id === id && item.type === type);
  }

  // Gestion des préférences utilisateur
  static getPreferences(): UserPreferences {
    return this.getItem(STORAGE_KEYS.PREFERENCES, {
      mood: null,
      freeTime: null,
      contentType: null
    });
  }

  static setPreferences(preferences: UserPreferences): void {
    this.setItem(STORAGE_KEYS.PREFERENCES, preferences);
  }

  static clearPreferences(): void {
    this.removeItem(STORAGE_KEYS.PREFERENCES);
  }

  // Utilitaires généraux
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  static exportData(): string {
    const data = {
      watchlist: this.getWatchlist(),
      favorites: this.getFavorites(),
      preferences: this.getPreferences(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.watchlist) {
        this.setWatchlist(data.watchlist);
      }
      
      if (data.favorites) {
        this.setFavorites(data.favorites);
      }
      
      if (data.preferences) {
        this.setPreferences(data.preferences);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation des données:', error);
      return false;
    }
  }

  // Obtenir la taille des données stockées
  static getStorageSize(): { [key: string]: number } {
    const sizes: { [key: string]: number } = {};
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      try {
        if (typeof window !== 'undefined') {
          const item = localStorage.getItem(key);
          sizes[name] = item ? new Blob([item]).size : 0;
        }
      } catch {
        sizes[name] = 0;
      }
    });
    
    return sizes;
  }
}

export default LocalStorageManager;