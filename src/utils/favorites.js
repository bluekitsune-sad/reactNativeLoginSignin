import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { StorageService } from "../services";

const FavoritesContext = createContext(null);

/**
 * Local favorites for mock merchants (SCREEN_INVENTORY 27). Stores merchant
 * ids in AsyncStorage under the shared "favoriteMerchantIds" key; the list
 * is global (ids are mall-scoped by construction) and screens filter to the
 * selected mall. Presentation only — no sync or account backup.
 */
export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    StorageService.getFavoriteIds()
      .then((ids) => {
        if (!cancelled) {
          setFavoriteIds(ids);
          setHydrated(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHydrated(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = useCallback((merchantId) => {
    if (!merchantId) {
      return;
    }
    setFavoriteIds((previous) => {
      const next = previous.includes(merchantId)
        ? previous.filter((id) => id !== merchantId)
        : [...previous, merchantId];
      StorageService.setFavoriteIds(next).catch(() => {});
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (merchantId) => Boolean(merchantId) && favoriteIds.includes(merchantId),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, hydrated }),
    [favoriteIds, isFavorite, toggleFavorite, hydrated],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a <FavoritesProvider> (see src/navigators)");
  }
  return context;
};

export default useFavorites;
