'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Reply,
  Loader2,
  Eye,
  Ban,
  Send
} from 'lucide-react';

interface UserReport {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  reportType: 'bug' | 'complaint' | 'suggestion' | 'abuse' | 'other';
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt?: string;
  adminResponse?: string;
  adminId?: string;
  adminName?: string;
  responseDate?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockReports: UserReport[] = [
      {
        id: '1',
        userId: 'user_123',
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        reportType: 'bug',
        subject: 'Login Page Not Working',
        description: 'I cannot login to my account. The page keeps showing error messages even with correct credentials.',
        status: 'pending',
        priority: 'high',
        createdAt: '2025-08-14T10:00:00Z',
      },
      {
        id: '2',
        userId: 'user_456',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        reportType: 'complaint',
        subject: 'Slow Response Time',
        description: 'The application is very slow and takes too long to load pages. This affects my productivity.',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2025-08-13T15:30:00Z',
        adminResponse: 'We are looking into this issue and will update you soon.',
        adminId: 'admin_1',
        adminName: 'Admin User',
        responseDate: '2025-08-13T16:00:00Z',
      },
      {
        id: '3',
        userId: 'user_789',
        userName: 'Mike Johnson',
        userEmail: 'mike.johnson@example.com',
        reportType: 'suggestion',
        subject: 'Add Dark Mode Feature',
        description: 'It would be great to have a dark mode option for better user experience during night time usage.',
        status: 'resolved',
        priority: 'low',
        createdAt: '2025-08-12T09:15:00Z',
        adminResponse: 'Thank you for your suggestion! We have added this to our development roadmap and will implement it in the next version.',
        adminId: 'admin_1',
        adminName: 'Admin User',
        responseDate: '2025-08-12T14:20:00Z',
      },
      {
        id: '4',
        userId: 'user_101',
        userName: 'Sarah Wilson',
        userEmail: 'sarah.wilson@example.com',
        reportType: 'abuse',
        subject: 'Inappropriate Content',
        description: 'There is inappropriate content being shared by another user that violates community guidelines.',
        status: 'pending',
        priority: 'urgent',
        createdAt: '2025-08-14T08:45:00Z',
      },
    ];

    setTimeout(() => {
      setReports(mockReports);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'urgent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-700';
      case 'complaint':
        return 'bg-orange-100 text-orange-700';
      case 'suggestion':
        return 'bg-green-100 text-green-700';
      case 'abuse':
        return 'bg-purple-100 text-purple-700';
      case 'other':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResponse = async (reportId: string, status: 'resolved' | 'rejected') => {
    setIsResponding(true);
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? {
              ...report,
              status,
              adminResponse: responseText,
              adminName: 'Current Admin',
              responseDate: new Date().toISOString()
            }
          : report
      ));
      
      setSelectedReport(null);
      setResponseText('');
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsResponding(false);
    }
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.reportType === filterType;
    const matchesSearch = searchTerm === '' || 
      report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  // Summary stats
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-primary-bold text-4xl md:text-5xl lg:text-6xl text-gray-900">User Reports</h1>
              <p className="font-primary-regular text-gray-600 mt-2">Manage user reports and provide responses</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Total Reports</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Pending</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">In Progress</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">{stats.inProgress}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-primary-regular text-sm text-gray-600">Resolved</p>
                    <p className="font-primary-bold text-2xl text-gray-900 mt-1">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
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
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="font-primary-regular w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="font-primary-regular px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="font-primary-regular px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="bug">Bug Report</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="abuse">Abuse Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-primary-semi-bold">User Reports</CardTitle>
              <CardDescription className="font-primary-regular">
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="font-primary-medium text-gray-600">Loading reports...</span>
                  </div>
                </div>
              )}

              {!isLoading && filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-primary-semi-bold text-lg text-gray-900 mb-2">No reports found</h3>
                  <p className="font-primary-regular text-gray-600">
                    No user reports match your current filters.
                  </p>
                </div>
              )}

              {!isLoading && filteredReports.length > 0 && (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="font-primary-medium bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                              {getUserInitials(report.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-primary-semi-bold text-gray-900">{report.subject}</h3>
                              <Badge className={`font-primary-medium text-xs ${getTypeColor(report.reportType)}`}>
                                {report.reportType}
                              </Badge>
                              <Badge className={`font-primary-medium text-xs ${getPriorityColor(report.priority)}`}>
                                {report.priority}
                              </Badge>
                            </div>
                            <p className="font-primary-regular text-sm text-gray-600 mb-2">
                              By <span className="font-medium">{report.userName}</span> ({report.userEmail})
                            </p>
                            <p className="font-primary-regular text-gray-700 mb-3">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Created: {formatDate(report.createdAt)}</span>
                              {report.responseDate && (
                                <span>Responded: {formatDate(report.responseDate)}</span>
                              )}
                            </div>
                            {report.adminResponse && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="font-primary-medium text-sm text-blue-800 mb-1">Admin Response:</p>
                                <p className="font-primary-regular text-sm text-blue-700">{report.adminResponse}</p>
                                {report.adminName && (
                                  <p className="font-primary-regular text-xs text-blue-600 mt-1">
                                    By {report.adminName}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`font-primary-medium ${getStatusColor(report.status)}`}>
                            {report.status.replace('_', ' ')}
                          </Badge>
                          {report.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className="font-primary-medium"
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Respond
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Modal/Dialog - Simplified inline version */}
          {selectedReport && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="font-primary-semi-bold">Respond to Report</CardTitle>
                <CardDescription className="font-primary-regular">
                  {selectedReport.subject} by {selectedReport.userName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-primary-regular text-gray-700">{selectedReport.description}</p>
                </div>
                <Textarea
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="min-h-[100px] font-primary-regular"
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleResponse(selectedReport.id, 'resolved')}
                    disabled={isResponding || !responseText.trim()}
                    className="font-primary-medium"
                  >
                    {isResponding ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Resolve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleResponse(selectedReport.id, 'rejected')}
                    disabled={isResponding || !responseText.trim()}
                    className="font-primary-medium"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedReport(null);
                      setResponseText('');
                    }}
                    className="font-primary-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
}
