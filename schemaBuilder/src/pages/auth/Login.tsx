import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header Image */}
      <div className="lg:hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full animate-float opacity-30"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full animate-bounce-slow opacity-20"></div>
        </div>
        
        <div className="text-center relative z-10 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-indigo-500/25 animate-glow">
            <svg className="w-12 h-12 text-white animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SchemaBuilder</h3>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white py-8 lg:py-0 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-indigo-50/30"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-x-32 -translate-y-32 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-100 to-pink-100 rounded-full translate-x-48 translate-y-48 opacity-15"></div>
        
        <div className="max-w-md w-full space-y-8 animate-fade-in relative z-10">
          <div className="text-center animate-slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 animate-fade-in-delay">
              Welcome Back 👋
            </h2>
            <p className="text-gray-600 text-lg animate-fade-in-delay">
              Login to continue designing your database
            </p>
          </div>

          <form className="mt-10 space-y-6 animate-slide-up-delay" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="animate-slide-in-left">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:z-10 text-base transition-all duration-300 hover:border-indigo-300 hover:shadow-md bg-white/80 backdrop-blur-sm group-hover:bg-white"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:z-10 text-base transition-all duration-300 hover:border-indigo-300 hover:shadow-md bg-white/80 backdrop-blur-sm group-hover:bg-white"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end animate-fade-in-delay">
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                <span className="relative z-10">Forgot Password?</span>
                <div className="absolute inset-0 bg-indigo-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 origin-center"></div>
              </button>
            </div>

            <div className="animate-slide-up-delay">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-6 text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 border-0 shadow-2xl shadow-indigo-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/60 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 animate-gradient-x overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Sign In
                  <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </button>
            </div>

            <div className="text-center animate-fade-in-delay">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-all duration-300 hover:scale-105 relative group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md scale-0 group-hover:scale-100 transition-transform duration-200 origin-center -m-1 p-1"></div>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration (Desktop Only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full animate-float opacity-30"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full animate-bounce-slow opacity-25"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-br from-pink-200 to-indigo-200 rounded-full animate-pulse-slow opacity-40"></div>
        </div>
        
        <div className="max-w-lg text-center animate-slide-in-right relative z-10">
          {/* Abstract geometric illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl transform rotate-6 opacity-20 animate-float"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl transform -rotate-3 opacity-15 animate-bounce-slow"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/50 animate-glow">
              <div className="space-y-8">
                {/* Database Icon Illustration */}
                <div className="mx-auto w-36 h-36 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/25 animate-float">
                  <svg className="w-18 h-18 text-white animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                
                <div className="space-y-5 animate-slide-up-delay">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Visual Database Design</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Build, visualize, and manage your database schemas with our intuitive drag-and-drop interface.
                  </p>
                </div>

                {/* Animated feature dots */}
                <div className="flex justify-center space-x-3 animate-fade-in-delay">
                  <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full animate-bounce-slow shadow-lg shadow-indigo-500/50"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-bounce-slow shadow-lg shadow-purple-500/50" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full animate-bounce-slow shadow-lg shadow-pink-500/50" style={{animationDelay: '0.4s'}}></div>
                </div>
                
                {/* Additional decorative elements */}
                <div className="flex justify-center space-x-8 pt-4 animate-fade-in-delay">
                  <div className="flex flex-col items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500">Fast</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500">Reliable</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500">Intuitive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}