import React from 'react';
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-serif">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            error: {
              style: {
                background: '#f44336',
                color: '#fff',
              },
            },
          }} 
        />
      </body>
    </html>
  );
}
