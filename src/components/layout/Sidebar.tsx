'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLogout, useAdminProfile } from '@/lib/hooks';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Search,
  Shield,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
 
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Admin',
    href: '/dashboard/admin',
    icon: Shield,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
];

const bottomNavigationItems = [
 
  {
    title: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Use hooks for logout and profile
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { profile, fetchProfile, isLoading: isLoadingProfile } = useAdminProfile();

  // Fetch profile on component mount
  useEffect(() => {
    // Only fetch profile if user is authenticated and we have a valid token
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    // Only fetch if we have both token and user data
    if (token && user) {
      try {
        // Verify user data is valid JSON
        JSON.parse(user);
        fetchProfile();
      } catch {
        // If user data is corrupted, clear it
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
  }, [fetchProfile]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user data from localStorage as fallback
  const getStoredUser = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const storedUser = getStoredUser();

  return (
    <div className={cn(
      "relative flex flex-col transition-all duration-300 ease-in-out shadow-xl",
      isCollapsed ? "w-16" : "w-72"
    )} style={{ 
      background: 'linear-gradient(180deg, #FBFBFB 0%, #ACACAC 100%)'
    }}>
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm border-r border-white/30"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/20">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="font-primary-bold text-white text-lg">D</span>
              </div>
              <div>
                <span className="font-primary-bold text-xl text-gray-800">Deni</span>
                <p className="font-primary-regular text-xs text-gray-600">Admin Portal</p>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-full">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="font-primary-bold text-white text-lg">D</span>
              </div>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-white/30"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Bar - Only when expanded */}
        {!isCollapsed && (
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search menu..."
                className="font-primary-regular w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              // Role-based access control: Admin section only visible to Super Administrators
              if (item.href === '/dashboard/admin') {
                const userRole = profile?.role || storedUser?.role;
                if (userRole !== 'super_admin') {
                  return null; // Hide Admin section for regular admins
                }
              }
              
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 relative overflow-hidden group",
                      isCollapsed ? "px-3" : "px-4",
                      isActive 
                        ? "bg-white/40 text-blue-700 shadow-lg backdrop-blur-sm border border-white/30" 
                        : "text-gray-700 hover:bg-white/20 hover:text-gray-900"
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
                    )}
                    
                    <Icon className={cn(
                      "h-5 w-5 shrink-0", 
                      !isCollapsed && "mr-3",
                      isActive ? "text-blue-600" : "text-gray-600"
                    )} />
                    
                    {!isCollapsed && (
                        <span className="font-primary-medium">{item.title}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="font-primary-regular absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Separator className="my-6 bg-white/20" />

          <div className="space-y-2">
            {bottomNavigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 relative overflow-hidden group",
                      isCollapsed ? "px-3" : "px-4",
                      isActive 
                        ? "bg-white/40 text-blue-700 shadow-lg backdrop-blur-sm border border-white/30" 
                        : "text-gray-700 hover:bg-white/20 hover:text-gray-900"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
                    )}
                    
                    <Icon className={cn(
                      "h-5 w-5 shrink-0", 
                      !isCollapsed && "mr-3",
                      isActive ? "text-blue-600" : "text-gray-600"
                    )} />
                    
                    {!isCollapsed && <span className="font-primary-medium">{item.title}</span>}
                    
                    {isCollapsed && (
                      <div className="font-primary-regular absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/20">
          {!isCollapsed ? (
            <div className="space-y-2">
              {/* Profile Card */}
              <Link href="/dashboard/profile">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-colors cursor-pointer group">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    {isLoadingProfile ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <span className="font-primary-bold text-white text-sm">
                        {profile?.name ? 
                          profile.name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2) :
                          storedUser?.name ? 
                            storedUser.name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2) :
                            'AD'
                        }
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-primary-medium text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                      {isLoadingProfile ? 'Loading...' : (profile?.name || storedUser?.name || 'Admin User')}
                    </p>
                    <p className="font-primary-regular text-xs text-gray-600 truncate">
                      {isLoadingProfile ? '...' : (profile?.email || storedUser?.email || 'admin@deni.com')}
                    </p>
                    <p className="font-primary-regular text-xs text-blue-600 opacity-75">
                      {profile?.role || storedUser?.role || 'Administrator'}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-gray-700 hover:text-red-600 hover:bg-red-50/50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 mr-3" />
                )}
                <span className="font-primary-medium">
                  {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Profile Avatar - Clickable */}
              <Link href="/dashboard/profile">
                <div className="relative group cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    {isLoadingProfile ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <span className="font-primary-bold text-white text-sm">
                        {profile?.name ? 
                          profile.name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2) :
                          storedUser?.name ? 
                            storedUser.name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2) :
                            'AD'
                        }
                      </span>
                    )}
                  </div>
                  {/* Profile Tooltip */}
                  <div className="font-primary-regular absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    <div className="font-primary-medium">
                      {isLoadingProfile ? 'Loading...' : (profile?.name || storedUser?.name || 'Admin User')}
                    </div>
                    <div className="text-gray-300">
                      {isLoadingProfile ? '...' : (profile?.email || storedUser?.email || 'admin@deni.com')}
                    </div>
                    <div className="text-blue-300 text-xs">
                      {profile?.role || storedUser?.role || 'Administrator'}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      Click to view profile
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50 relative group"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {/* Logout Tooltip */}
                <div className="font-primary-regular absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Sign Out
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
