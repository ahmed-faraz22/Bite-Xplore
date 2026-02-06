import React, { createContext, useState } from "react";

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);
  const maxCompare = 2;

  const addToCompare = (product) => {
    const exists = compareItems.some((p) => p._id === product._id);
    if (exists) return;
    if (compareItems.length >= maxCompare) return;
    setCompareItems((prev) => [...prev, product]);
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((p) => p._id !== productId));
  };

  const isInCompare = (productId) => {
    return compareItems.some((p) => p._id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{ compareItems, addToCompare, removeFromCompare, isInCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};
