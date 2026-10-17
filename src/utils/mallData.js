import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { MALLS } from "../mock/malls";
import { StorageService } from "../services";

const MallContext = createContext(null);

export const MallProvider = ({ children }) => {
  const [selectedMall, setSelectedMall] = useState(MALLS[0]);

  useEffect(() => {
    let cancelled = false;
    StorageService.getSelectedMallSlug()
      .then((slug) => {
        if (cancelled) {
          return;
        }
        const stored = MALLS.find((mall) => mall.slug === slug);
        if (stored) {
          setSelectedMall(stored);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selectMall = useCallback((mall) => {
    setSelectedMall(mall);
    StorageService.setSelectedMallSlug(mall.slug).catch(() => {});
  }, []);

  return (
    <MallContext.Provider value={{ selectedMall, selectMall }}>{children}</MallContext.Provider>
  );
};

const useMallManagement = () => {
  const context = useContext(MallContext);
  if (!context) {
    throw new Error("useMallManagement must be used within a <MallProvider> (see src/navigators)");
  }
  return context;
};

export default useMallManagement;
