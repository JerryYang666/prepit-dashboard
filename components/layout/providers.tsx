"use client";
import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { PrepitUserSessionProvider } from "@/contexts/PrepitUserSessionContext";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PrepitUserSessionProvider>{children}</PrepitUserSessionProvider>
      </ThemeProvider>
    </>
  );
}
