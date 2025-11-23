import { useTheme } from '@/hooks/use-theme';
import React from 'react';
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // This hook applies the theme class to the document
  return <>{children}</>;
}