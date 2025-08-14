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
import { useAdmins } from '@/lib/hooks';
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
  Settings
} from 'lucide-react';

export default function AdminPage() {
  const { admins, isLoading, error, fetchAdmins, createAdmin } = useAdmins();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('Please fill in all required fields');
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
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin. Please try again.');
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
              <Button onClick={() => fetchAdmins()} className="font-primary-medium">
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
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                      onClick={() => setIsAddModalOpen(false)}
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
                      className="font-primary-regular w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="font-primary-medium">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
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
              {!admins || admins.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-primary-semi-bold text-lg text-gray-900 mb-2">No administrators found</h3>
                  <p className="font-primary-regular text-gray-600 mb-4">
                    Get started by adding your first administrator to the system.
                  </p>
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="font-primary-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Admin
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {admins.map((admin, index) => (
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
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
