import { createContext, useContext, ReactNode } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

interface DarkModeContextType {
  dark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({ dark: true, toggle: () => {} });

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const { dark, toggle } = useDarkMode();
  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkModeContext() {
  return useContext(DarkModeContext);
}
