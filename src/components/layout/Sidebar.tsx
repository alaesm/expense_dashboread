'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLogout, useAdminProfile } from '@/lib/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
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
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum distance for swipe detection
  const minSwipeDistance = 50;
  
  // Auto-collapse on mobile and expand on desktop
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  // Touch event handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Close sidebar on left swipe, open on right swipe (only on mobile)
    if (isMobile) {
      if (isLeftSwipe && !isCollapsed) {
        setIsCollapsed(true);
      } else if (isRightSwipe && isCollapsed) {
        setIsCollapsed(false);
      }
    }
  };
  
  // Use hooks for logout and profile
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { profile, fetchProfile, isLoading: isLoadingProfile } = useAdminProfile();
  
  // State to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch profile on component mount (only on client)
  useEffect(() => {
    if (!isMounted) return;
    
    // Only fetch profile if user is authenticated and we have a valid token
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
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
  }, [fetchProfile, isMounted]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user data from localStorage as fallback (only on client)
  const getStoredUser = () => {
    if (!isMounted) {
      return null; // Return null during server-side rendering
    }
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  };

  const storedUser = getStoredUser();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsCollapsed(true);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      
      <div 
        className={cn(
          "relative flex flex-col transition-all duration-300 ease-in-out shadow-xl",
          // Responsive width classes
          isCollapsed 
            ? "w-16 sm:w-16" 
            : "w-72 sm:w-64 md:w-72",
          // Mobile specific styles
          isMobile && "fixed left-0 top-0 bottom-0 z-50",
          // Desktop styles
          !isMobile && "h-screen"
        )} 
        style={{ 
          background: 'linear-gradient(180deg, #FBFBFB 0%, #ACACAC 100%)'
        }}
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile ? onTouchMove : undefined}
        onTouchEnd={isMobile ? onTouchEnd : undefined}
      >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm border-r border-white/30"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between border-b border-white/20",
          isMobile ? "h-16 px-4" : "h-20 px-6"
        )}>
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
              <div className={cn(
                "rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg",
                isMobile ? "h-8 w-8" : "h-10 w-10"
              )}>
                <span className={cn(
                  "font-primary-bold text-white",
                  isMobile ? "text-sm" : "text-lg"
                )}>ES</span>
              </div>
              <div className={cn(isMobile && "hidden sm:block")}>
                <span className={cn(
                  "font-primary-bold text-gray-800",
                  isMobile ? "text-lg" : "text-xl"
                )}>Expense</span>
                <p className="font-primary-regular text-xs text-gray-600">Admin Portal</p>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-full">
              <div className={cn(
                "rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg",
                isMobile ? "h-8 w-8" : "h-10 w-10"
              )}>
                <span className={cn(
                  "font-primary-bold text-white",
                  isMobile ? "text-sm" : "text-lg"
                )}>ES</span>
              </div>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "text-gray-600 hover:text-gray-800 hover:bg-white/30",
              isMobile ? "h-6 w-6" : "h-8 w-8"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
            ) : (
              <ChevronLeft className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto pb-4",
          isMobile ? "px-2" : "px-4"
        )}>
          <div className="space-y-1 sm:space-y-2">
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
                      "w-full justify-start relative overflow-hidden group",
                      isCollapsed ? (isMobile ? "px-2" : "px-3") : (isMobile ? "px-3" : "px-4"),
                      isMobile ? "h-10" : "h-12",
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
                      "shrink-0", 
                      isMobile ? "h-4 w-4" : "h-5 w-5",
                      !isCollapsed && (isMobile ? "mr-2" : "mr-3"),
                      isActive ? "text-blue-600" : "text-gray-600"
                    )} />
                    
                    {!isCollapsed && (
                        <span className={cn(
                          "font-primary-medium truncate",
                          isMobile ? "text-sm" : "text-base"
                        )}>{item.title}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="font-primary-regular absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                        {item.title}
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Separator className="my-4 sm:my-6 bg-white/20" />

          <div className="space-y-1 sm:space-y-2">
            {bottomNavigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start relative overflow-hidden group",
                      isCollapsed ? (isMobile ? "px-2" : "px-3") : (isMobile ? "px-3" : "px-4"),
                      isMobile ? "h-10" : "h-12",
                      isActive 
                        ? "bg-white/40 text-blue-700 shadow-lg backdrop-blur-sm border border-white/30" 
                        : "text-gray-700 hover:bg-white/20 hover:text-gray-900"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
                    )}
                    
                    <Icon className={cn(
                      "shrink-0", 
                      isMobile ? "h-4 w-4" : "h-5 w-5",
                      !isCollapsed && (isMobile ? "mr-2" : "mr-3"),
                      isActive ? "text-blue-600" : "text-gray-600"
                    )} />
                    
                    {!isCollapsed && (
                      <span className={cn(
                        "font-primary-medium truncate",
                        isMobile ? "text-sm" : "text-base"
                      )}>{item.title}</span>
                    )}
                    
                    {isCollapsed && (
                      <div className="font-primary-regular absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
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
        <div className={cn(
          "border-t border-white/20",
          isMobile ? "p-2" : "p-4"
        )}>
          {!isCollapsed ? (
            <div className="space-y-2">
              {/* Profile Card */}
              <Link href="/dashboard/profile">
                <div className={cn(
                  "flex items-center gap-3 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-colors cursor-pointer group",
                  isMobile ? "p-2" : "p-3"
                )}>
                  <div className={cn(
                    "rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg",
                    isMobile ? "h-8 w-8" : "h-10 w-10"
                  )}>
                    {isLoadingProfile ? (
                      <Loader2 className={cn(
                        "text-white animate-spin",
                        isMobile ? "h-3 w-3" : "h-4 w-4"
                      )} />
                    ) : (
                      <span className={cn(
                        "font-primary-bold text-white",
                        isMobile ? "text-xs" : "text-sm"
                      )}>
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
                    <p className={cn(
                      "font-primary-medium text-gray-800 truncate group-hover:text-blue-700 transition-colors",
                      isMobile ? "text-sm" : "text-base"
                    )}>
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
                    <ChevronRight className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                  </div>
                </div>
              </Link>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50/50",
                  isMobile ? "h-8 text-sm" : "h-10"
                )}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className={cn(
                    "animate-spin",
                    isMobile ? "h-3 w-3 mr-2" : "h-4 w-4 mr-3"
                  )} />
                ) : (
                  <LogOut className={cn(
                    isMobile ? "h-3 w-3 mr-2" : "h-4 w-4 mr-3"
                  )} />
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
                  <div className={cn(
                    "rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow",
                    isMobile ? "h-8 w-8" : "h-10 w-10"
                  )}>
                    {isLoadingProfile ? (
                      <Loader2 className={cn(
                        "text-white animate-spin",
                        isMobile ? "h-3 w-3" : "h-4 w-4"
                      )} />
                    ) : (
                      <span className={cn(
                        "font-primary-bold text-white",
                        isMobile ? "text-xs" : "text-sm"
                      )}>
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
                  <div className="font-primary-regular absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
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
                className={cn(
                  "text-gray-600 hover:text-red-600 hover:bg-red-50 relative group",
                  isMobile ? "h-6 w-6" : "h-8 w-8"
                )}
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Logout"
              >
                {isLoggingOut ? (
                  <Loader2 className={cn(
                    "animate-spin",
                    isMobile ? "h-3 w-3" : "h-4 w-4"
                  )} />
                ) : (
                  <LogOut className={cn(
                    isMobile ? "h-3 w-3" : "h-4 w-4"
                  )} />
                )}
                {/* Logout Tooltip */}
                <div className="font-primary-regular absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                  Sign Out
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
