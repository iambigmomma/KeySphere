'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  KeyIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                KeySphere
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </Link>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Operational</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Secure API Key
                <br />
                Management Platform
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Empower your applications with secure, scalable API key management. 
                Monitor usage, set limits, and maintain control over your API access.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/docs"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Documentation
                </Link>
              </div>
            </div>
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Animated Key Visual */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl transform rotate-6 animate-float-slow" />
                <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <KeyIcon className="w-8 h-8 text-indigo-600" />
                      <div>
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-4/6 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for API key management
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you manage and secure your API access
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure by Default',
    description: 'Enterprise-grade security with automatic key rotation and revocation capabilities.'
  },
  {
    icon: ChartBarIcon,
    title: 'Usage Analytics',
    description: 'Real-time monitoring and detailed analytics for all your API keys.'
  },
  {
    icon: ClockIcon,
    title: 'Rate Limiting',
    description: 'Set custom rate limits and quotas for each API key.'
  },
  // Add more features as needed
];
