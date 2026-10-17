import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { MALLS } from "../mock/malls";
import { StorageService } from "../services";

const MallContext = createContext(null);

const resolveMall = (mallOrSlug) => {
  if (!mallOrSlug) {
    return null;
  }
  const slug = typeof mallOrSlug === "string" ? mallOrSlug : mallOrSlug.slug;
  return MALLS.find((mall) => mall.slug === slug) ?? null;
};

export const MallProvider = ({ children }) => {
  const [selectedMall, setSelectedMall] = useState(MALLS[0]);

  useEffect(() => {
    let cancelled = false;
    StorageService.getSelectedMallSlug()
      .then((slug) => {
        if (cancelled) {
          return;
        }
        const stored = resolveMall(slug);
        if (stored) {
          setSelectedMall(stored);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selectMall = useCallback((mallOrSlug) => {
    // Always re-resolve from the mock catalog so screens never hold a
    // stale or mutated copy of a previous mall (PRD 5.2).
    const next = resolveMall(mallOrSlug);
    if (!next) {
      return;
    }
    setSelectedMall(next);
    StorageService.setSelectedMallSlug(next.slug).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      selectedMall,
      selectedMallSlug: selectedMall.slug,
      selectMall,
    }),
    [selectedMall, selectMall],
  );

  return <MallContext.Provider value={value}>{children}</MallContext.Provider>;
};

const useMallManagement = () => {
  const context = useContext(MallContext);
  if (!context) {
    throw new Error("useMallManagement must be used within a <MallProvider> (see src/navigators)");
  }
  return context;
};

export default useMallManagement;
