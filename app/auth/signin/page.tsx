'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="inline-flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                TigrayTutor
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <LoginForm />
        
        <div className="text-center mt-4">
          <Link href="/auth/signup">
            <Button variant="link">
              Don't have an account? Sign up
            </Button>
          </Link>
        </div>
        
        <div className="text-center mt-4">
          <Link href="/">
            <Button variant="ghost">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
