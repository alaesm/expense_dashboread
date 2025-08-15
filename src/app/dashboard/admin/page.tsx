'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAdmins, useToast } from '@/lib/hooks';
import { 
  Shield, 
  Search, 
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Calendar,
  Loader2,
  UserCheck,
  UserX,
  Crown,
  Settings,
  Trash2,
  UserMinus,
  UserPlus
} from 'lucide-react';

export default function AdminPage() {
  const { admins, isLoading, error, fetchAdmins, createAdmin, updateAdmin, deleteAdmin } = useAdmins();
  const { showSuccess, showWarning, showInfo } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
    isActive: true
  });

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Show welcome toast when admins are first loaded
  useEffect(() => {
    if (admins && admins.length > 0 && !isLoading && !error) {
      // Only show this once when admins are initially loaded
      const hasShownWelcome = sessionStorage.getItem('adminPageWelcomeShown');
      if (!hasShownWelcome) {
        showInfo('Admin Dashboard', {
          description: `Managing ${admins.length} administrator account${admins.length !== 1 ? 's' : ''}`,
        });
        sessionStorage.setItem('adminPageWelcomeShown', 'true');
      }
    }
  }, [admins, isLoading, error, showInfo]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with toast warnings
    if (!formData.name.trim()) {
      showWarning('Name required', {
        description: 'Please enter the administrator\'s full name',
      });
      return;
    }
    
    if (!formData.email.trim()) {
      showWarning('Email required', {
        description: 'Please enter a valid email address',
      });
      return;
    }
    
    if (!formData.password.trim()) {
      showWarning('Password required', {
        description: 'Please enter a secure password for the admin account',
      });
      return;
    }

    if (formData.password.length < 6) {
      showWarning('Password too short', {
        description: 'Password must be at least 6 characters long',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the createAdmin method from the hook
      await createAdmin({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password
      });

      // Reset form and close modal
      setFormData({ name: '', email: '', password: '', role: 'admin', isActive: true });
      setIsAddModalOpen(false);
      
      // Success toast is already shown by the useAdmins hook
      // No need to show additional success message here
    } catch (error) {
      console.error('Error adding admin:', error);
      // Error toast is already shown by the useAdmins hook
      // No need to show additional error message here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return 'Not available';
    
    // Handle Firestore timestamp format
    if (typeof timestamp === 'object' && timestamp !== null && '_seconds' in timestamp) {
      const firestoreTimestamp = timestamp as { _seconds: number };
      return new Date(firestoreTimestamp._seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle regular timestamp
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    return 'Not available';
  };

  // Get admin initials
  const getAdminInitials = (name: string) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Administrator';
      case 'admin':
        return 'Administrator';
      case 'moderator':
        return 'Moderator';
      default:
        return role || 'Admin';
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'admin':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'moderator':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    try {
      showWarning('Confirm Delete', {
        description: `Are you sure you want to delete ${adminName}? This action cannot be undone.`,
        action: {
          label: 'Delete',
          onClick: () => {
            void deleteAdmin(adminId);
          },
        }
      });
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  // Handle activate/deactivate admin
  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean, adminName: string) => {
    try {
      const action = currentStatus ? 'deactivate' : 'activate';
      const newStatus = !currentStatus;
      
      showInfo(`${action === 'activate' ? 'Activate' : 'Deactivate'} Admin`, {
        description: `Are you sure you want to ${action} ${adminName}?`,
        action: {
          label: action === 'activate' ? 'Activate' : 'Deactivate',
          onClick: () => {
            void (async () => {
              await updateAdmin(adminId, { isActive: newStatus });
              showSuccess(`Admin ${action}d`, {
                description: `${adminName} has been ${action}d successfully`,
              });
            })();
          },
        }
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  // Filter and search logic
  const filteredAdmins = admins?.filter(admin => {
    const matchesSearch = !searchQuery || 
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && admin.isActive) ||
      (filterStatus === 'inactive' && !admin.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterRole('all');
    setFilterStatus('all');
    showInfo('Filters cleared', {
      description: 'All search and filter criteria have been reset',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="font-primary-medium text-gray-600">Loading administrators...</span>
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
              <h2 className="font-primary-semi-bold text-lg text-gray-800 mb-2">Error Loading Administrators</h2>
              <p className="font-primary-regular text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => {
                  showInfo('Retrying...', {
                    description: 'Attempting to reload administrator data',
                  });
                  fetchAdmins();
                }} 
                className="font-primary-medium"
              >
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
              <h1 className="font-primary-bold text-4xl md:text-5xl lg:text-6xl text-gray-900">Admin</h1>
              <p className="font-primary-regular text-gray-600 mt-2">Manage administrator accounts and permissions</p>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
              setIsAddModalOpen(open);
              if (open) {
                showInfo('Add Administrator', {
                  description: 'Fill out the form below to create a new admin account',
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="font-primary-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-primary-semi-bold">Add New Administrator</DialogTitle>
                  <DialogDescription className="font-primary-regular">
                    Create a new administrator account with the specified role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-primary-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      className="font-primary-regular"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-primary-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="font-primary-regular"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-primary-medium">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password"
                      className="font-primary-regular"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="font-primary-medium">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger className="font-primary-regular">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin" className="font-primary-regular">Administrator</SelectItem>
                        <SelectItem value="super_admin" className="font-primary-regular">Super Administrator</SelectItem>
                        <SelectItem value="moderator" className="font-primary-regular">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isActive" className="font-primary-regular text-sm">
                      Active (user can log in immediately)
                    </Label>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        showInfo('Form cancelled', {
                          description: 'No administrator was added',
                        });
                      }}
                      className="font-primary-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-primary-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Admin
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Total Admins</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {admins?.length || 0}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Super Admins</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {admins?.filter(admin => admin.role === 'super_admin').length || 0}
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Active Admins</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {admins?.filter(admin => admin.isActive).length || 0}
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
                    <p className="font-primary-regular text-sm text-gray-600">Inactive Admins</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">
                      {admins?.filter(admin => !admin.isActive).length || 0}
                    </p>
                  </div>
                  <UserX className="h-8 w-8 text-red-600" />
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
                      placeholder="Search administrators..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim()) {
                          showInfo('Searching...', {
                            description: `Searching for "${e.target.value}"`,
                          });
                        }
                      }}
                      className="font-primary-regular w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="font-primary-medium">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {(filterRole !== 'all' || filterStatus !== 'all') && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {(filterRole !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0)}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="font-primary-medium text-sm">Role</Label>
                          <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="All roles" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              <SelectItem value="super_admin">Super Administrator</SelectItem>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="font-primary-medium text-sm">Status</Label>
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-between pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="font-primary-medium"
                          >
                            Clear All
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setIsFilterOpen(false);
                              showSuccess('Filters applied', {
                                description: `Showing ${filteredAdmins.length} of ${admins?.length || 0} administrators`,
                              });
                            }}
                            className="font-primary-medium"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-primary-regular">
                    Showing {filteredAdmins.length} of {admins?.length || 0} administrators
                  </span>
                  {(searchQuery || filterRole !== 'all' || filterStatus !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="font-primary-medium text-xs h-6 px-2"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admins List */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-primary-semi-bold">All Administrators</CardTitle>
              <CardDescription className="font-primary-regular">
                Complete list of administrator accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                if (!admins || admins.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-primary-semi-bold text-lg text-gray-900 mb-2">No administrators found</h3>
                      <p className="font-primary-regular text-gray-600 mb-4">
                        Get started by adding your first administrator to the system.
                      </p>
                      <Button 
                        onClick={() => {
                          showInfo('Opening admin creation', {
                            description: 'Fill out the form to add your first administrator',
                          });
                          setIsAddModalOpen(true);
                        }}
                        className="font-primary-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Admin
                      </Button>
                    </div>
                  );
                }
                
                if (filteredAdmins.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-primary-semi-bold text-lg text-gray-900 mb-2">No administrators match your criteria</h3>
                      <p className="font-primary-regular text-gray-600 mb-4">
                        Try adjusting your search terms or filters to find what you&apos;re looking for.
                      </p>
                      <Button 
                        onClick={clearFilters}
                        variant="outline"
                        className="font-primary-medium"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-4">
                    {filteredAdmins.map((admin, index) => (
                    <div key={admin.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="font-primary-medium bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                            {getAdminInitials(admin.name || 'Admin')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-primary-semi-bold text-gray-900">
                              {admin.name || 'Unknown Admin'}
                            </h3>
                            {admin.role === 'super_admin' && (
                              <Crown className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {admin.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="font-primary-regular">{admin.email}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className="font-primary-regular">
                                Last login: {formatDate(admin.lastLogin)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right space-y-1">
                          <Badge className={`font-primary-medium ${getRoleColor(admin.role)}`}>
                            {getRoleDisplay(admin.role)}
                          </Badge>
                          <div>
                            <Badge 
                              variant={admin.isActive ? 'default' : 'secondary'} 
                              className="font-primary-medium"
                            >
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="font-primary-regular text-xs text-gray-500">
                            Created {formatDate(admin.createdAt)}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => void handleToggleAdminStatus(admin.id, admin.isActive, admin.name || 'Admin')}
                              className="font-primary-regular"
                            >
                              {admin.isActive ? (
                                <>
                                  <UserMinus className="h-4 w-4 mr-2 text-orange-600" />
                                  Deactivate Admin
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4 mr-2 text-green-600" />
                                  Activate Admin
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => void handleDeleteAdmin(admin.id, admin.name || 'Admin')}
                              className="font-primary-regular text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-primary-semi-bold">Admin Actions</CardTitle>
              <CardDescription className="font-primary-regular">
                Quick administrative tasks and system management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    id: 'permissions', 
                    title: 'Manage Permissions', 
                    description: 'Configure role-based access control', 
                    icon: Settings,
                    color: 'text-blue-600'
                  },
                  { 
                    id: 'audit-logs', 
                    title: 'Audit Logs', 
                    description: 'View system activity and admin actions', 
                    icon: Calendar,
                    color: 'text-green-600'
                  },
                  { 
                    id: 'security', 
                    title: 'Security Settings', 
                    description: 'Configure authentication and security', 
                    icon: Shield,
                    color: 'text-purple-600'
                  }
                ].map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      switch (action.id) {
                        case 'permissions':
                          showInfo('Permissions Management', {
                            description: 'This feature will allow you to configure role-based access control',
                            action: {
                              label: 'Coming Soon',
                              onClick: () => {},
                            }
                          });
                          break;
                        case 'audit-logs':
                          showInfo('Audit Logs', {
                            description: 'This feature will show system activity and admin actions',
                            action: {
                              label: 'Coming Soon',
                              onClick: () => {},
                            }
                          });
                          break;
                        case 'security':
                          showInfo('Security Settings', {
                            description: 'This feature will allow you to configure authentication and security',
                            action: {
                              label: 'Coming Soon',
                              onClick: () => {},
                            }
                          });
                          break;
                        default:
                          showInfo('Feature Coming Soon', {
                            description: 'This feature is currently under development',
                          });
                      }
                    }}
                    className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
                    <h3 className="font-primary-medium text-gray-900">{action.title}</h3>
                    <p className="font-primary-regular text-sm text-gray-600 mt-1">{action.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
