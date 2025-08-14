'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon, AlertCircle } from 'lucide-react';
import { useLogin } from '@/lib/hooks';

export default function LoginPage() {
  const {
    email,
    password,
    rememberMe,
    showPassword,
    isLoading,
    error,
    setEmail,
    setPassword,
    setRememberMe,
    togglePasswordVisibility,
    handleSubmit,
    clearError
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-300">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="space-y-6 text-center pb-8">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <CardTitle className="font-primary-semi-bold text-2xl md:text-3xl lg:text-4xl text-gray-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="font-primary-regular text-gray-600 mt-2">
              Sign in to your admin dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="font-primary-regular text-sm text-red-700 flex-1">{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none focus:text-red-700 font-primary-medium w-6 h-6 flex items-center justify-center transition-colors duration-200"
                aria-label="Close error message"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-primary-medium text-sm text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-primary-regular pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-primary-medium text-sm text-gray-700">
                Password
              </Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-primary-regular pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors duration-200 z-20"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-start">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <Label htmlFor="remember" className="font-primary-regular text-sm text-gray-600 cursor-pointer">
                  Remember me
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-white font-primary-semi-bold border-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-primary-medium">Signing in...</span>
                </div>
              ) : (
                <span className="font-primary-semi-bold">Sign In</span>
              )}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <p className="font-primary-regular text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-800 font-primary-medium underline bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
                onClick={() => {
                  // Handle contact administrator
                  alert('Please contact your system administrator to get access.');
                }}
              >
                Contact Administrator
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
      </div>
    </div>
  );
}
