'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUsers } from '@/lib/hooks';
import { 
  Users, 
  Search, 
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  UserCheck,
  UserX
} from 'lucide-react';

export default function UsersPage() {
  const { users, isLoading, error, fetchUsers } = useUsers();
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      
      if (!token || !user) {
        console.log('No authentication found, redirecting to login...');
        window.location.href = '/login';
        return;
      }

     
      try {
        console.log('Fetching users data...');
        await fetchUsers();
        console.log('Users data fetched successfully');
      } catch (error) {
        console.error('Error fetching users:', error);
        
        if (error instanceof Error && error.message.includes('Authentication required')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };

    fetchData();
  }, [fetchUsers]);

// Debug logs
  console.log('Users page - users:', users);
  console.log('Users page - isLoading:', isLoading);
  console.log('Users page - error:', error);

  // Format date
  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return 'Not available';
    
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

 
  const filteredUsers = users ? users.filter(user => {
 
    const searchMatch = searchTerm === '' || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm) ||
      user.countryCode?.toLowerCase().includes(searchTerm.toLowerCase());

    
    let statusMatch = true;
    switch (filterStatus) {
      case 'active':
        statusMatch = user.isActive && !user.disabled;
        break;
      case 'disabled':
        statusMatch = user.disabled;
        break;
      case 'verified':
        statusMatch = user.emailVerified;
        break;
      case 'all':
      default:
        // statusMatch is already true, no need to reassign
        break;
    }

    return searchMatch && statusMatch;
  }) : [];

  // Check if user is authenticated for rendering
  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      return token && user;
    }
    return false;
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">🔒</div>
          <h2 className="font-primary-semi-bold text-xl text-gray-800 mb-2">Authentication Required</h2>
          <p className="font-primary-regular text-gray-600 mb-4">
            Please login to access the users page
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="font-primary-medium text-gray-600">Loading users...</span>
            </div>
          </div>
        </DashboardLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <h2 className="font-primary-semi-bold text-lg text-gray-800 mb-2">Error Loading Users</h2>
              <p className="font-primary-regular text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchUsers()} className="font-primary-medium">
                Retry
              </Button>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-primary-bold text-4xl md:text-5xl lg:text-6xl text-gray-900">Users</h1>
              <p className="font-primary-regular text-gray-600 mt-2">Manage and monitor user accounts</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Total Users</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {isLoading ? '...' : (users?.length || 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Active Users</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {isLoading ? '...' : (users?.filter(user => user.isActive && !user.disabled).length || 0)}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Disabled Users</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {isLoading ? '...' : (users?.filter(user => user.disabled).length || 0)}
                    </p>
                  </div>
                  <UserX className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Verified Users</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {isLoading ? '...' : (users?.filter(user => user.emailVerified).length || 0)}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="font-primary-regular w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="font-primary-medium"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                {/* Filter Results Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-primary-regular">
                    Showing {filteredUsers.length} of {users?.length || 0} users
                  </span>
                  {(searchTerm || filterStatus !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                      className="font-primary-medium text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterStatus === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('all')}
                      className="font-primary-medium"
                    >
                      All Users
                    </Button>
                    <Button
                      variant={filterStatus === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('active')}
                      className="font-primary-medium"
                    >
                      Active Only
                    </Button>
                    <Button
                      variant={filterStatus === 'disabled' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('disabled')}
                      className="font-primary-medium"
                    >
                      Disabled Only
                    </Button>
                    <Button
                      variant={filterStatus === 'verified' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('verified')}
                      className="font-primary-medium"
                    >
                      Verified Only
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-primary-semi-bold">All Users</CardTitle>
              <CardDescription className="font-primary-regular">
                Complete list of registered users
                {!isLoading && (() => {
                  if (!filteredUsers?.length) return <span className="ml-2 text-blue-600">(No users)</span>;
                  
                  const isFiltered = searchTerm || filterStatus !== 'all';
                  const countText = isFiltered ? 'found' : 'total';
                  
                  return (
                    <span className="ml-2 text-blue-600">
                      ({filteredUsers.length} users {countText})
                    </span>
                  );
                })()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                if (isLoading) {
                  return (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="font-primary-medium text-gray-600">Loading users...</span>
                      </div>
                    </div>
                  );
                }

                if (error) {
                  return (
                    <div className="text-center py-12">
                      <div className="text-red-500 mb-2">⚠️</div>
                      <h3 className="font-primary-semi-bold text-lg text-gray-900 mb-2">Error Loading Users</h3>
                      <p className="font-primary-regular text-gray-600 mb-4">{error}</p>
                      <button 
                        onClick={() => {
                          console.log('Retrying users fetch...');
                          fetchUsers();
                        }}
                        className="font-primary-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  );
                }

                if (!users || users.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-primary-semi-bold text-lg text-gray-900 mb-2">No users found</h3>
                      <p className="font-primary-regular text-gray-600 mb-4">
                        No users are currently registered in the system.
                      </p>
                    </div>
                  );
                }

                if (filteredUsers.length === 0 && (searchTerm || filterStatus !== 'all')) {
                  return (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-primary-semi-bold text-lg text-gray-900 mb-2">No matching users</h3>
                      <p className="font-primary-regular text-gray-600 mb-4">
                        No users match your current search or filter criteria.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setFilterStatus('all');
                        }}
                        className="font-primary-medium"
                      >
                        Clear filters
                      </Button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filteredUsers.map((user, index) => (
                      <div key={user.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.photoURL || "/placeholder-avatar.jpg"} alt={user.name || 'User'} />
                            <AvatarFallback className="font-primary-medium bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                              {getUserInitials(user.name || 'User')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-primary-semi-bold text-gray-900">
                              {user.name || 'Unknown User'}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {user.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span className="font-primary-regular">{user.email}</span>
                                </div>
                              )}
                              {user.phoneNumber && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span className="font-primary-regular">{user.phoneNumber}</span>
                                </div>
                              )}
                              {user.countryCode && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="font-primary-regular">{user.countryCode}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <Badge 
                                variant={user.isActive && !user.disabled ? 'default' : 'secondary'} 
                                className="font-primary-medium"
                              >
                                {(() => {
                                  if (user.disabled) return 'Disabled';
                                  if (user.isActive) return 'Active';
                                  return 'Inactive';
                                })()}
                              </Badge>
                              {user.emailVerified && (
                                <Badge variant="outline" className="font-primary-medium text-green-600 border-green-600">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="font-primary-regular text-xs text-gray-500">
                              Joined {formatDate(user.createdAt)}
                            </p>
                            {user.lastLogin && (
                              <p className="font-primary-regular text-xs text-gray-500">
                                Last login {formatDate(user.lastLogin)}
                              </p>
                            )}
                            {user.currencyCode && (
                              <p className="font-primary-regular text-xs text-blue-600">
                                Currency: {user.currencyCode}
                              </p>
                            )}
                          </div>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
