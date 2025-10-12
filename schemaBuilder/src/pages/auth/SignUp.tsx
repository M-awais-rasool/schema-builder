import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log('Sign up attempt:', { fullName, email, password });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header Image */}
      <div className="lg:hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full animate-float opacity-30"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full animate-bounce-slow opacity-20"></div>
        </div>
        
        <div className="text-center relative z-10 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-purple-500/25 animate-glow">
            <svg className="w-12 h-12 text-white animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SchemaBuilder</h3>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white py-8 lg:py-0 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-purple-50/30"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-100 to-pink-100 rounded-full translate-x-32 -translate-y-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full -translate-x-48 translate-y-48 opacity-15"></div>
        
        <div className="max-w-md w-full space-y-8 animate-fade-in relative z-10">
          <div className="text-center animate-slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 animate-fade-in-delay">
              Create Your Account 🚀
            </h2>
            <p className="text-gray-600 text-lg animate-fade-in-delay">
              Start building your database visually
            </p>
          </div>

          <form className="mt-10 space-y-6 animate-slide-up-delay" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="animate-slide-in-left">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md bg-white/80 backdrop-blur-sm group-hover:bg-white"
                    placeholder="Enter your full name"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="animate-slide-in-left" style={{animationDelay: '0.1s'}}>
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
                    className="appearance-none relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md bg-white/80 backdrop-blur-sm group-hover:bg-white"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md bg-white/80 backdrop-blur-sm group-hover:bg-white"
                    placeholder="Create a password"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="animate-slide-in-left" style={{animationDelay: '0.3s'}}>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md bg-white/80 backdrop-blur-sm group-hover:bg-white"
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <div className="animate-slide-up-delay">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-6 text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 border-0 shadow-2xl shadow-purple-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 animate-gradient-x overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Create Account
                  <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </button>
            </div>

            <div className="text-center animate-fade-in-delay">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-purple-600 hover:text-purple-500 transition-all duration-300 hover:scale-105 relative group"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-md scale-0 group-hover:scale-100 transition-transform duration-200 origin-center -m-1 p-1"></div>
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
          <div className="absolute top-16 right-20 w-28 h-28 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full animate-float opacity-30"></div>
          <div className="absolute bottom-20 left-16 w-20 h-20 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full animate-bounce-slow opacity-25"></div>
          <div className="absolute top-1/3 right-10 w-14 h-14 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full animate-pulse-slow opacity-40"></div>
        </div>
        
        <div className="max-w-lg text-center animate-slide-in-right relative z-10">
          {/* Abstract geometric illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl transform -rotate-6 opacity-20 animate-float"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl transform rotate-3 opacity-15 animate-bounce-slow"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/50 animate-glow">
              <div className="space-y-8">
                {/* Schema Builder Icon Illustration */}
                <div className="mx-auto w-36 h-36 bg-gradient-to-r from-purple-500 via-pink-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25 animate-float">
                  <svg className="w-18 h-18 text-white animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                
                <div className="space-y-5 animate-slide-up-delay">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">Start Building Today</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Join thousands of developers who trust our platform to design and manage their database schemas efficiently.
                  </p>
                </div>

                {/* Enhanced progress indicators with animations */}
                <div className="flex justify-center space-x-6 animate-fade-in-delay">
                  <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-green-500/20 animate-bounce-slow">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300">Design</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-500/20 animate-bounce-slow" style={{animationDelay: '0.2s'}}>
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">Deploy</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/20 animate-bounce-slow" style={{animationDelay: '0.4s'}}>
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">Scale</span>
                  </div>
                </div>
                
                {/* Stats section */}
                <div className="grid grid-cols-3 gap-4 pt-6 animate-fade-in-delay">
                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">10K+</div>
                    <div className="text-xs text-gray-500 font-medium">Users</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">99%</div>
                    <div className="text-xs text-gray-500 font-medium">Uptime</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
                    <div className="text-xs text-gray-500 font-medium">Support</div>
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