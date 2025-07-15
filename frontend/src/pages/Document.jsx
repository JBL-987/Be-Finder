import React, { useState } from "react";
import { Book, Code, Settings, Users, ChevronRight, Search } from "lucide-react";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      content: {
        title: 'Getting Started with Locatify',
        description: 'Welcome to Locatify! This guide will help you get up and running quickly.',
        steps: [
          'Create your account and verify your email',
          'Connect your bank accounts and financial sources',
          'Set up your business profile and preferences',
          'Import your existing transaction data',
          'Configure AI categorization rules',
          'Start processing transactions automatically'
        ]
      }
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      content: {
        title: 'API Documentation',
        description: 'Complete reference for the Locatify API endpoints and authentication.',
        steps: [
          'Authentication: Use API keys for secure access',
          'Transactions: Create, read, update, and delete transactions',
          'Categories: Manage transaction categories',
          'Reports: Generate financial reports programmatically',
          'Webhooks: Receive real-time notifications',
          'Rate Limits: Understand API usage limits'
        ]
      }
    },
    {
      id: 'configuration',
      title: 'Configuration',
      icon: Settings,
      content: {
        title: 'System Configuration',
        description: 'Configure Locatify to match your business requirements.',
        steps: [
          'Account Settings: Manage your profile and preferences',
          'Integration Setup: Connect with third-party services',
          'AI Training: Customize AI categorization rules',
          'Security Settings: Configure two-factor authentication',
          'Notification Preferences: Set up alerts and reports',
          'Data Export: Schedule automated backups'
        ]
      }
    },
    {
      id: 'team-management',
      title: 'Team Management',
      icon: Users,
      content: {
        title: 'Managing Your Team',
        description: 'Add team members and manage access permissions.',
        steps: [
          'Invite Team Members: Send invitations via email',
          'Role Assignment: Set up different permission levels',
          'Access Control: Define what each role can access',
          'Audit Logs: Track team member activities',
          'Collaboration Tools: Share reports and insights',
          'User Management: Deactivate or remove users'
        ]
      }
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeContent = sections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about using Locatify effectively
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-blue-900/30 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Contents</h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1">{section.title}</span>
                      {activeSection === section.id && (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeContent && (
              <div className="bg-gray-900/50 rounded-lg p-8 border border-blue-900/30">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <activeContent.icon className="text-blue-400" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      {activeContent.content.title}
                    </h2>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {activeContent.content.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">
                    Step-by-step guide:
                  </h3>
                  <div className="space-y-4">
                    {activeContent.content.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Resources */}
                <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30">
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">
                    Need more help?
                  </h4>
                  <p className="text-gray-300 mb-4">
                    If you're still having trouble, check out our additional resources or contact support.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                      Contact Support
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                      Video Tutorials
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                      Community Forum
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;