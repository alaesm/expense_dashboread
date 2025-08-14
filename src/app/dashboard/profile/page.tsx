'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminProfile } from '@/lib/hooks';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Clock,
  Edit,
  Settings,
  Activity,
  Loader2,
  Save,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, isLoading, error, fetchProfile } = useAdminProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update editedProfile when profile data is loaded
  useEffect(() => {
    if (profile) {
      setEditedProfile({
        name: profile.name || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would call your API to update the profile
      // await api.updateProfile(editedProfile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success and exit edit mode
      setIsEditing(false);
      
      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original profile data
    if (profile) {
      setEditedProfile({
        name: profile.name || '',
        email: profile.email || ''
      });
    }
    setIsEditing(false);
  };

  // Get user initials
  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'AD';
  };

  // Format date
  const formatDate = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'Not available';
    
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="font-primary-medium text-gray-600">Loading profile...</span>
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
              <h2 className="font-primary-semi-bold text-lg text-gray-800 mb-2">Error Loading Profile</h2>
              <p className="font-primary-regular text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchProfile()} className="font-primary-medium">
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
          <div>
            <h1 className="font-primary-bold text-4xl md:text-5xl lg:text-6xl text-gray-900">Profile</h1>
            <p className="font-primary-regular text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={profile?.name || 'Admin'} />
                      <AvatarFallback className="font-primary-bold text-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="font-primary-semi-bold text-xl">
                    {profile?.name || 'Admin User'}
                  </CardTitle>
                  <CardDescription className="font-primary-regular">
                    {profile?.email || 'admin@example.com'}
                  </CardDescription>
                  <div className="flex justify-center mt-2">
                    <Badge className="font-primary-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      {(() => {
                        if (profile?.role === 'super_admin') return 'Super Administrator';
                        if (profile?.role === 'admin') return 'Administrator';
                        return profile?.role ?? 'Admin';
                      })()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="edit-name" className="font-primary-medium text-sm text-gray-700 block mb-2">
                          Full Name
                        </label>
                        <input
                          id="edit-name"
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="font-primary-regular w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-email" className="font-primary-medium text-sm text-gray-700 block mb-2">
                          Email Address
                        </label>
                        <input
                          id="edit-email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="font-primary-regular w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your email"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 font-primary-medium"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={handleCancel}
                          variant="outline" 
                          disabled={isSaving}
                          className="font-primary-medium"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="w-full font-primary-medium" 
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button className="w-full font-primary-medium" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-primary-semi-bold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Full Name</label>
                      <p className="font-primary-regular text-gray-900 mt-1">
                        {profile?.name || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Email Address</label>
                      <p className="font-primary-regular text-gray-900 mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        {profile?.email || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Role</label>
                      <p className="font-primary-regular text-gray-900 mt-1 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        {(() => {
                          if (profile?.role === 'super_admin') return 'Super Administrator';
                          if (profile?.role === 'admin') return 'Administrator';
                          return profile?.role ?? 'Admin';
                        })()}
                      </p>
                    </div>
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Status</label>
                      <p className="font-primary-regular text-gray-900 mt-1">
                        <Badge variant={profile?.isActive ? 'default' : 'secondary'} className="font-primary-medium">
                          {profile?.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Activity */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-primary-semi-bold flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Account Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Account Created</label>
                      <p className="font-primary-regular text-gray-900 mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formatDate(profile?.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Last Updated</label>
                      <p className="font-primary-regular text-gray-900 mt-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {formatDate(profile?.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Last Login</label>
                      <p className="font-primary-regular text-gray-900 mt-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {formatDate(profile?.lastLogin)}
                      </p>
                    </div>
                    <div>
                      <label className="font-primary-medium text-sm text-gray-600">Admin ID</label>
                      <p className="font-primary-regular text-gray-900 mt-1 font-mono text-sm">
                        {profile?.id || 'Not available'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
