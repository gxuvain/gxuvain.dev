"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

function Provider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    return () => {
      setMounted(true);
    };
  }, []);

  if (!mounted)
    return <>{children}</>;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

export default Provider;
