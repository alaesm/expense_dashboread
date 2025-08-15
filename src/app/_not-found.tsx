'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-300">
      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto text-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {/* 404 Icon */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mb-6">
                <FileQuestion className="w-12 h-12 text-white" />
              </div>
              
              {/* Large 404 Text */}
              <div className="font-primary-bold text-8xl md:text-9xl lg:text-[10rem] text-transparent bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text leading-none">
                404
              </div>
            </div>

            {/* Title and Description */}
            <div className="mb-8">
              <h1 className="font-primary-bold text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4">
                Page Not Found
              </h1>
              <p className="font-primary-regular text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
                The page you&apos;re looking for doesn&apos;t exist or has been moved. 
                Don&apos;t worry, let&apos;s get you back on track!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGoHome}
                className="w-full sm:w-auto h-12 px-8 text-white font-primary-semi-bold border-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 font-primary-semi-bold border-2 border-gray-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:border-gray-400 rounded-2xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="font-primary-regular text-sm text-gray-500 mb-3">
                Need help? Here are some quick links:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="font-primary-medium text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
                >
                  Dashboard
                </button>
                <span className="text-gray-400">•</span>
                <button 
                  onClick={() => router.push('/dashboard/users')}
                  className="font-primary-medium text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
                >
                  Users
                </button>
                <span className="text-gray-400">•</span>
                <button 
                  onClick={() => router.push('/dashboard/reports')}
                  className="font-primary-medium text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
                >
                  Reports
                </button>
                <span className="text-gray-400">•</span>
                <button 
                  onClick={() => router.push('/dashboard/help')}
                  className="font-primary-medium text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
                >
                  Help
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-blue-500/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-purple-300/30 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Search Animation */}
      <div className="fixed top-1/4 left-1/4 pointer-events-none">
        <div className="animate-pulse">
          <Search className="w-6 h-6 text-blue-400/40" />
        </div>
      </div>
      
      <div className="fixed bottom-1/4 right-1/4 pointer-events-none">
        <div className="animate-pulse delay-1000">
          <Search className="w-8 h-8 text-purple-400/40" />
        </div>
      </div>
    </div>
  );
}