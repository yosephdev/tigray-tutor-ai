'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Globe, Users, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              TigrayTutor
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
          ትግራይ ተማሃራይ
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-8">
          TigrayTutor
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          AI-powered educational platform designed specifically for Tigrinya-speaking students, 
          providing personalized tutoring aligned with the Ethiopian curriculum.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-4">
                Continue Learning
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-16">
          Why Choose TigrayTutor?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="card-hover">
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Tigrinya-First Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Primary interface in Tigrinya language with seamless English translation support.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI-Powered Tutoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced AI provides personalized learning experiences tailored to each student.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Ethiopian Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Aligned with Ethiopian educational standards and curriculum requirements.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Offline-First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Works offline with low-bandwidth optimization for reliable access anywhere.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Interactive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Voice interaction, PDF lesson uploads, and interactive chat functionality.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your learning data is protected with enterprise-grade security and privacy.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Tigrinya students already learning with AI-powered tutoring.
          </p>
          {!user && (
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started Today
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">TigrayTutor</span>
              </div>
              <p className="text-gray-300">
                AI-powered learning for Tigrinya students, built with ❤️ for the Tigray educational community.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>AI Tutoring</li>
                <li>Tigrinya Translation</li>
                <li>Voice Interaction</li>
                <li>PDF Processing</li>
                <li>Offline Learning</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Community</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-300">
                <li>GitHub</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Email</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 TigrayTutor. Built for the Tigray educational community.</p>
            <p className="mt-2">Contact: <a href="mailto:contact@yoseph.dev" className="text-primary hover:underline">contact@yoseph.dev</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}