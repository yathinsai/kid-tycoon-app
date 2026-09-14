import { createContext, useContext, useState, ReactNode } from "react";

interface WealthContextType {
  wealth: number;
  addWealth: (amount: number) => void;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

export const WealthProvider = ({ children }: { children: ReactNode }) => {
  const [wealth, setWealth] = useState(20);

  const addWealth = (amount: number) => {
    setWealth((prev) => Math.round((prev + amount) * 100) / 100);
  };

  return (
    <WealthContext.Provider value={{ wealth, addWealth }}>
      {children}
    </WealthContext.Provider>
  );
};

export const useWealth = () => {
  const ctx = useContext(WealthContext);
  if (!ctx) throw new Error("useWealth must be used within WealthProvider");
  return ctx;
};
