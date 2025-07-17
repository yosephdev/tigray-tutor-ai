'use client';
import { useAuth } from './AuthProvider';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md px-4">
          {showSignUp ? <SignUpForm /> : <LoginForm />}
          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => setShowSignUp(!showSignUp)}
            >
              {showSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}