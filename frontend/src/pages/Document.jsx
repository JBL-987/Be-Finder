import { useState } from "react";
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
        title: 'Getting Started with Be-Finder',
        description: 'Welcome to Be-Finder! This guide will help you analyze business locations quickly and effectively.',
        steps: [
          'Login with Internet Identity for secure access',
          'Navigate to the analysis page and select a location on the map',
          'Input your business parameters (building width, operating hours, product price)',
          'Wait for AI analysis to process the location screenshot',
          'Review the profitability analysis and customer predictions',
          'Use the insights to make informed location decisions'
        ]
      }
    },
    {
      id: 'analysis-guide',
      title: 'Analysis Guide',
      icon: Code,
      content: {
        title: 'Understanding Your Analysis Results',
        description: 'Learn how to interpret the AI-powered analysis results and make data-driven decisions.',
        steps: [
          'Area Distribution: Understand residential, road, and open space percentages',
          'Customer Predictions: Interpret daily customer traffic estimates',
          'Profitability Score: Use the 1-10 scale to evaluate location potential',
          'Kenny Chart Methodology: Learn about the 12-step calculation process',
          'Location Factors: Consider population density and traffic patterns',
          'Business Parameters: Optimize building width, hours, and pricing inputs'
        ]
      }
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: Settings,
      content: {
        title: 'Best Practices for Location Analysis',
        description: 'Tips and recommendations to get the most accurate results from Be-Finder.',
        steps: [
          'Location Selection: Choose clear, representative areas for analysis',
          'Photo Quality: Ensure map screenshots are clear and properly scaled',
          'Parameter Input: Use realistic business parameters for accurate predictions',
          'Multiple Analyses: Compare different locations for better decision making',
          'Time Considerations: Factor in peak hours and seasonal variations',
          'Local Context: Consider local regulations and competition factors'
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Users,
      content: {
        title: 'Common Issues and Solutions',
        description: 'Resolve common problems and get help when you need it.',
        steps: [
          'Login Issues: Troubleshoot Internet Identity authentication problems',
          'Map Loading: Fix issues with map display and location selection',
          'Analysis Errors: Resolve AI analysis failures and timeout issues',
          'Result Interpretation: Understand unexpected or unusual results',
          'Performance: Optimize analysis speed and browser compatibility',
          'Support: Contact our team for additional assistance'
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
    <div className="min-h-screen bg-dark-bg text-dark-text-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Everything you need to know about using Be-Finder effectively
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-surface/50 rounded-lg p-6 border-dark-border sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Contents</h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-green-600 text-white'
                          : 'text-dark-text-secondary hover:bg-dark-bg'
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
              <div className="bg-dark-surface/50 rounded-lg p-8 border-dark-border">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <activeContent.icon className="text-green-400" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      {activeContent.content.title}
                    </h2>
                  </div>
                  <p className="text-dark-text-secondary text-lg leading-relaxed">
                    {activeContent.content.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-4">
                    Step-by-step guide:
                  </h3>
                  <div className="space-y-4">
                    {activeContent.content.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-dark-bg/50 rounded-lg border-dark-border/50 hover:border-blue-500/50 transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-dark-text-primary leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Resources */}
                <div className="mt-12 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/30">
                  <h4 className="text-lg font-semibold text-green-400 mb-3">
                    Need more help?
                  </h4>
                  <p className="text-dark-text-secondary mb-4">
                    If you're still having trouble, check out our additional resources or contact support.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors">
                      Contact Support
                    </button>
                    <button className="px-4 py-2 bg-dark-border hover:bg-dark-bg rounded-lg text-white transition-colors">
                      Video Tutorials
                    </button>
                    <button className="px-4 py-2 bg-dark-border hover:bg-dark-bg rounded-lg text-white transition-colors">
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