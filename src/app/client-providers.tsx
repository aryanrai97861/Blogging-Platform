'use client';

import { TRPCProvider } from './providers';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </ThemeProvider>
  );
}
