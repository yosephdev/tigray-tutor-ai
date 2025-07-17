import React from 'react';
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-serif">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
              error: {
                style: {
                  background: 'hsl(var(--destructive))',
                  color: 'hsl(var(--destructive-foreground))',
                },
              },
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
