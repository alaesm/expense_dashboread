'use client';

import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Video,
  FileText,
  Users,
  Lightbulb,
  Bug,
  Heart
} from 'lucide-react';

export default function HelpPage() {
  const helpData = {
    quickLinks: [
      { 
        title: 'Getting Started Guide', 
        description: 'Learn the basics of using the admin dashboard',
        icon: Book,
        color: 'text-blue-600',
        href: '#'
      },
      { 
        title: 'Video Tutorials', 
        description: 'Watch step-by-step video guides',
        icon: Video,
        color: 'text-green-600',
        href: '#'
      },
      { 
        title: 'API Documentation', 
        description: 'Complete API reference and examples',
        icon: FileText,
        color: 'text-purple-600',
        href: '#'
      },
      { 
        title: 'Community Forum', 
        description: 'Connect with other administrators',
        icon: Users,
        color: 'text-orange-600',
        href: '#'
      },
    ],
    faqs: [
      {
        question: 'How do I reset a user\'s password?',
        answer: 'Navigate to the Users section, find the user, click on their profile, and select "Reset Password". The user will receive an email with reset instructions.'
      },
      {
        question: 'How can I generate custom reports?',
        answer: 'Go to the Reports section and click "New Report". You can select custom parameters, date ranges, and data sources to create tailored reports.'
      },
      {
        question: 'What are the different admin roles?',
        answer: 'There are three main roles: Super Admin (full access), Admin (most features), and Moderator (limited access). Each role has specific permissions and capabilities.'
      },
      {
        question: 'How do I backup the system data?',
        answer: 'System backups are automated daily. You can also manually trigger a backup from Settings > System > Backup. All backups are encrypted and stored securely.'
      },
      {
        question: 'How can I customize notification settings?',
        answer: 'Visit Settings > Notifications to configure email, push, and system notifications. You can set preferences for different types of alerts and their frequency.'
      },
    ],
    support: [
      {
        type: 'Email Support',
        description: 'Get help via email within 24 hours',
        contact: 'support@deni.com',
        icon: Mail,
        color: 'text-blue-600'
      },
      {
        type: 'Live Chat',
        description: 'Chat with our support team in real-time',
        contact: 'Available 9 AM - 6 PM EST',
        icon: MessageCircle,
        color: 'text-green-600'
      },
      {
        type: 'Phone Support',
        description: 'Call us for urgent technical issues',
        contact: '+1 (555) 123-4567',
        icon: Phone,
        color: 'text-purple-600'
      },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-primary-bold text-4xl md:text-5xl lg:text-6xl text-gray-900">Help Center</h1>
            <p className="font-primary-regular text-gray-600 mt-2">Find answers, tutorials, and get support</p>
          </div>

          {/* Search Bar */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for help articles, tutorials, or features..."
                  className="font-primary-regular w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 font-primary-medium">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-primary-semi-bold flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Quick Start
              </CardTitle>
              <CardDescription className="font-primary-regular">
                Essential resources to get you started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {helpData.quickLinks.map((link, index) => (
                  <button
                    key={index}
                    className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <link.icon className={`h-8 w-8 ${link.color} mb-3`} />
                    <h3 className="font-primary-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {link.title}
                    </h3>
                    <p className="font-primary-regular text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                    <div className="flex items-center mt-3 text-blue-600">
                      <span className="font-primary-medium text-sm">Learn more</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Frequently Asked Questions */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-primary-semi-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="font-primary-regular">
                  Common questions and answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {helpData.faqs.map((faq, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <h3 className="font-primary-medium text-gray-900 mb-2">{faq.question}</h3>
                      <p className="font-primary-regular text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" className="font-primary-medium">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All FAQs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-primary-semi-bold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contact Support
                </CardTitle>
                <CardDescription className="font-primary-regular">
                  Get personalized help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {helpData.support.map((support, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                          <support.icon className={`h-5 w-5 ${support.color}`} />
                        </div>
                        <div>
                          <h3 className="font-primary-medium text-gray-900">{support.type}</h3>
                          <p className="font-primary-regular text-sm text-gray-600">{support.description}</p>
                          <p className="font-primary-medium text-sm text-blue-600 mt-1">{support.contact}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="font-primary-medium">
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-primary-semi-bold">Additional Resources</CardTitle>
              <CardDescription className="font-primary-regular">
                More ways to learn and get help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    id: 'changelog', 
                    title: 'What\'s New', 
                    description: 'Latest features and updates', 
                    icon: FileText,
                    color: 'text-blue-600',
                    badge: 'Updated'
                  },
                  { 
                    id: 'bug-report', 
                    title: 'Report a Bug', 
                    description: 'Help us improve the platform', 
                    icon: Bug,
                    color: 'text-red-600',
                    badge: null
                  },
                  { 
                    id: 'feature-request', 
                    title: 'Request Feature', 
                    description: 'Suggest new functionality', 
                    icon: Heart,
                    color: 'text-pink-600',
                    badge: null
                  }
                ].map((resource) => (
                  <button
                    key={resource.id}
                    className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors relative"
                  >
                    {resource.badge && (
                      <Badge className="absolute top-2 right-2 font-primary-medium bg-green-100 text-green-700">
                        {resource.badge}
                      </Badge>
                    )}
                    <resource.icon className={`h-6 w-6 ${resource.color} mb-2`} />
                    <h3 className="font-primary-medium text-gray-900">{resource.title}</h3>
                    <p className="font-primary-regular text-sm text-gray-600 mt-1">{resource.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-primary-semi-bold">System Status</CardTitle>
              <CardDescription className="font-primary-regular">
                Current system health and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { service: 'API Services', status: 'Operational', color: 'bg-green-500' },
                  { service: 'Database', status: 'Operational', color: 'bg-green-500' },
                  { service: 'File Storage', status: 'Operational', color: 'bg-green-500' },
                  { service: 'Email Service', status: 'Operational', color: 'bg-green-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-primary-medium text-sm text-gray-900">{item.service}</p>
                      <p className="font-primary-regular text-xs text-gray-600">{item.status}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" className="font-primary-medium">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Status Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
