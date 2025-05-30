import { IProduct } from "@/interface";

export const getRecentlyViewed = (userId: string | null): IProduct[] => {
  if (!userId) {
    return [];
  }

  const storageKey = `recentlyViewed_${userId}`;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch (error) {
    console.error(`Error loading ${storageKey} from localStorage:`, error);
    return [];
  }
};
