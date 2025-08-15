'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatsCard } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useUsersCount,
  useCountryAnalytics,
  useCurrencyAnalytics,
  useUserAnalytics
} from '@/lib/hooks';
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Globe,
  CreditCard,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  // State to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication immediately (only on client)
  useEffect(() => {
    if (!isMounted) return;
    
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      console.log('No authentication found, redirecting to login...');
      window.location.href = '/login';
    }
  }, [isMounted]);

  // Use real hooks for data
  const { totalUsers, isLoading: isLoadingUsers, error: usersError, fetchUsersCount } = useUsersCount();
  const { countryAnalytics, isLoading: isLoadingCountries, error: countriesError, fetchCountryAnalytics } = useCountryAnalytics();
  const { currencyAnalytics, isLoading: isLoadingCurrencies, error: currenciesError, fetchCurrencyAnalytics } = useCurrencyAnalytics();
  const { analytics: userAnalytics, isLoading: isLoadingAnalytics, error: analyticsError, fetchAnalytics } = useUserAnalytics();

  // Fetch data on component mount
  useEffect(() => {
    if (!isMounted) return;
    
    const fetchAllData = async () => {
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      // Only fetch if we have both token and user data
      if (token && user) {
        try {
          // Verify user data is valid JSON
          JSON.parse(user);
          
          // Fetch all dashboard data
          await Promise.all([
            fetchUsersCount(),
            fetchCountryAnalytics(5), // Limit to 5 countries
            fetchCurrencyAnalytics(3), // Limit to 3 currencies
            fetchAnalytics()
          ]);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          // If token is invalid or user data is corrupted, redirect to login
          if (error instanceof Error && error.message.includes('Authentication required')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      } else {
        // No authentication, redirect to login
        console.log('No authentication found, redirecting to login...');
        window.location.href = '/login';
      }
    };

    fetchAllData();
  }, [fetchUsersCount, fetchCountryAnalytics, fetchCurrencyAnalytics, fetchAnalytics, isMounted]);

  // Calculate growth rate for display
  const growthRate = userAnalytics?.totalUsers ? 
    ((userAnalytics.totalUsers - (totalUsers || 0)) / (totalUsers || 1) * 100).toFixed(1) : '0';

  // Check if user is authenticated for rendering
  const isAuthenticated = () => {
    if (!isMounted) {
      return true; // Return true during SSR to prevent flash, will be checked on client
    }
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return token && user;
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">🔒</div>
          <h2 className="font-primary-semi-bold text-xl text-gray-800 mb-2">Authentication Required</h2>
          <p className="font-primary-regular text-gray-600 mb-4">
            Please login to access the dashboard
          </p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="font-primary-medium px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Helper function to render currency items
  const renderCurrencyItems = () => {
    if (isLoadingCurrencies) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="font-primary-regular ml-2 text-gray-600">Loading currencies...</span>
        </div>
      );
    }

    if (!currencyAnalytics || currencyAnalytics.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="font-primary-regular text-gray-500">No currency data available</p>
        </div>
      );
    }

    return currencyAnalytics.slice(0, 3).map((currency, index) => {
      const totalCount = currencyAnalytics.reduce((sum, c) => sum + (c.count || 0), 0);
      const percentage = totalCount > 0 ? Math.round((currency.count / totalCount) * 100) : 0;
      
      return (
        <div key={currency.currencyCode || index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-primary-medium text-gray-900">
                {currency.currencyCode || 'Unknown'}
              </p>
              <p className="font-primary-regular text-sm text-gray-600">
                {percentage}% of users
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-primary-semi-bold text-gray-900">
              {currency.count || 0}
            </span>
            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  // Helper function to render country items
  const renderCountryItems = () => {
    if (isLoadingCountries) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="font-primary-regular ml-2 text-gray-600">Loading countries...</span>
        </div>
      );
    }

    if (!countryAnalytics || countryAnalytics.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="font-primary-regular text-gray-500">No country data available</p>
        </div>
      );
    }

    return countryAnalytics.slice(0, 5).map((country, index) => (
      <div key={country.countryCode || index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Globe className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-primary-medium text-gray-900">
              {country.countryCode || 'Unknown'}
            </p>
            <p className="font-primary-regular text-sm text-gray-600">Country Code</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-primary-semi-bold text-gray-900">
            {country.count || 0}
          </span>
          <p className="font-primary-regular text-xs text-gray-500">users</p>
        </div>
      </div>
    ));
  };

  // Stats data using real hooks
  const stats = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: isLoadingUsers ? '...' : totalUsers?.toString() || '0',
      description: 'Registered users',
      trend: { value: 12.5, isPositive: true },
      icon: Users,
    },
    {
      id: 'top-countries',
      title: 'Top Countries',
      value: isLoadingCountries ? '...' : countryAnalytics?.length?.toString() || '0',
      description: 'Different countries',
      trend: { value: 8.2, isPositive: true },
      icon: Globe,
    },
    {
      id: 'top-currencies',
      title: 'Top Currencies',
      value: isLoadingCurrencies ? '...' : currencyAnalytics?.length?.toString() || '0',
      description: 'Different currencies',
      trend: { value: 5.1, isPositive: true },
      icon: CreditCard,
    },
    {
      id: 'growth-rate',
      title: 'Growth Rate',
      value: isLoadingAnalytics ? '...' : `${growthRate}%`,
      description: 'Year over year',
      trend: { value: Math.abs(parseFloat(growthRate)), isPositive: parseFloat(growthRate) > 0 },
      icon: TrendingUp,
    }
  ];

  // Loading state
  if (isLoadingUsers || isLoadingCountries || isLoadingCurrencies || isLoadingAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="font-primary-medium text-gray-600">Loading dashboard...</span>
            </div>
          </div>
        </DashboardLayout>
      </div>
    );
  }

  // Error state
  if (usersError || countriesError || currenciesError || analyticsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <h2 className="font-primary-semi-bold text-lg text-gray-800 mb-2">Error Loading Dashboard</h2>
              <p className="font-primary-regular text-gray-600 mb-4">
                {usersError || countriesError || currenciesError || analyticsError}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="font-primary-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </DashboardLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-primary-bold text-4xl md:text-5xl lg:text-6xl text-gray-900">Dashboard</h1>
            <p className="font-primary-regular text-gray-600 mt-2">Welcome to your admin dashboard!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                trend={stat.trend}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Currency Analytics */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-primary-semi-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Top Currencies
                </CardTitle>
                <CardDescription className="font-primary-regular">
                  User distribution by currency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {renderCurrencyItems()}
                </div>
              </CardContent>
            </Card>

            {/* Country Analytics */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-primary-semi-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Top Countries
                </CardTitle>
                <CardDescription className="font-primary-regular">
                  User distribution by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {renderCountryItems()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
