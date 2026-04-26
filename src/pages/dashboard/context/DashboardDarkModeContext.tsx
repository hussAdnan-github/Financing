import { createContext, useContext, useState, useEffect } from "react";

interface DarkModeContextType {
  dark: boolean;
  toggle: () => void;
}

const DashboardDarkModeContext = createContext<DarkModeContextType>({
  dark: false,
  toggle: () => {},
});

export function DashboardDarkModeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("dashboard-dark-mode");
    return stored !== null ? stored === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("dashboard-dark-mode", String(dark));
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return (
    <DashboardDarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DashboardDarkModeContext.Provider>
  );
}

export function useDashboardDarkMode() {
  return useContext(DashboardDarkModeContext);
}
