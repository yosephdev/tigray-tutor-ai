'use client';
import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Tigray TutorChat } from '@/components/Tigray TutorChat';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <header className="text-center mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                ትግራይ ተማሃራይ (Tigray Tutor)
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered learning for Tigrinya students
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </header>
          
          <Tigray TutorChat />
        </div>
      </div>
    </AuthGuard>
  );
}
