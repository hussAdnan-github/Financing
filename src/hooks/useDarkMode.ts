import { useState, useEffect } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("website-dark-mode");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("website-dark-mode", String(dark));
    if (dark) {
      document.documentElement.classList.add("website-dark");
    } else {
      document.documentElement.classList.remove("website-dark");
    }
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return { dark, toggle };
}
