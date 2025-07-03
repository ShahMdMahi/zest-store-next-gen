"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
// import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // // Remove the unused 'mounted' state variable
  // const [_, setMounted] = useState(false);

  // // Only show the theme UI after the component is mounted on client
  // // This prevents hydration mismatch
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
