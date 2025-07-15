import {
  ChevronLeft,
  ChevronRight,
  Activity,
  MapPin,
  Navigation,
  Layers,
  Filter,
  Map,
  Plus,
  BarChart3,
  Download,
  Eye,
  Users,
  TrendingUp,
  Building,
  DollarSign,
  Target,
  FileText,
  Database,
  Zap,
  Clock,
  X,
} from 'lucide-react';

const MainContent = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  uploadFile,
  fileTransferProgress,
  files,
  deleteFile,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Content Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            {activeTab === 'map' && 'Location Map'}
            {activeTab === 'analytics' && 'Business Analytics'}
            {activeTab === 'reports' && 'Location Reports'}
            {activeTab === 'data' && 'Data Management'}
          </h1>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Real-time Analysis</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main View */}
        <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
          {activeTab === 'map' && (
            <div className="h-full bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-semibold flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                  Interactive Location Map
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Navigation className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Layers className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Map Container */}
              <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 text-lg mb-2">
                      Interactive Map View
                    </p>
                    <p className="text-gray-500 text-sm">
                      Map integration coming soon
                    </p>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2">
                  <div className="flex flex-col space-y-2">
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition-colors">
                      <span className="w-4 h-4 block text-center text-xs">
                        -
                      </span>
                    </button>
                  </div>
                </div>

                {/* Location Info Panel */}
                <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                  <h3 className="font-medium text-white mb-2">
                    Selected Location
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Click on the map to explore locations
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>Real-time location data</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="h-full bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-lg font-semibold flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Business Analytics Dashboard
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-900/30 rounded-lg">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">12.5K</h3>
                  <p className="text-sm text-gray-400">Foot Traffic</p>
                  <p className="text-xs text-green-400">
                    +15% from last month
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-900/30 rounded-lg">
                      <Building className="w-5 h-5 text-purple-400" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">89</h3>
                  <p className="text-sm text-gray-400">Active Locations</p>
                  <p className="text-xs text-green-400">+3 new this week</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-900/30 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">$2.1M</h3>
                  <p className="text-sm text-gray-400">Revenue Impact</p>
                  <p className="text-xs text-green-400">
                    +8% ROI improvement
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-orange-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-orange-400" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">94%</h3>
                  <p className="text-sm text-gray-400">Accuracy Score</p>
                  <p className="text-xs text-green-400">+2% this quarter</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">
                    Location Performance
                  </h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-400 text-sm">
                        Performance charts loading...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-4">
                    Traffic Trends
                  </h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-400 text-sm">
                        Trend analysis loading...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="h-full bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-lg font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-400" />
                  Location Intelligence Reports
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-colors text-sm">
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Report Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Time Period
                  </label>
                  <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Report Type
                  </label>
                  <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Location Analysis</option>
                    <option>Market Research</option>
                    <option>Competitor Analysis</option>
                    <option>Demographic Study</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Format
                  </label>
                  <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>PDF Report</option>
                    <option>Excel Spreadsheet</option>
                    <option>PowerPoint</option>
                    <option>Interactive Dashboard</option>
                  </select>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 p-4">
                <h3 className="font-semibold text-white mb-4">
                  Recent Reports
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Downtown Location Analysis',
                      date: '2 hours ago',
                      type: 'Market Research',
                      status: 'completed',
                    },
                    {
                      title: 'Competitor Mapping Report',
                      date: '1 day ago',
                      type: 'Competitor Analysis',
                      status: 'completed',
                    },
                    {
                      title: 'Demographic Analysis - Mall District',
                      date: '3 days ago',
                      type: 'Demographic Study',
                      status: 'completed',
                    },
                    {
                      title: 'Q4 Performance Review',
                      date: '1 week ago',
                      type: 'Location Analysis',
                      status: 'completed',
                    },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-900/30 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm">
                            {report.title}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {report.type} • {report.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                          {report.status}
                        </span>
                        <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="h-full bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-lg font-semibold flex items-center">
                  <Database className="w-5 h-5 mr-2 text-yellow-400" />
                  Data Management Center
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files[0] && uploadFile(e.target.files[0])
                    }
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg transition-colors text-sm"
                  >
                    Import Data
                  </label>
                </div>
              </div>

              {fileTransferProgress && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-white mb-1">
                    Uploading: {fileTransferProgress.fileName}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (fileTransferProgress.loaded /
                            fileTransferProgress.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {fileTransferProgress.loaded} of{' '}
                    {fileTransferProgress.total} chunks loaded.
                  </p>
                </div>
              )}

              {/* Data Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-yellow-900/30 rounded-lg">
                      <Database className="w-5 h-5 text-yellow-400" />
                    </div>
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">2.8TB</h3>
                  <p className="text-sm text-gray-400">Total Data Storage</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-900/30 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">1,247</h3>
                  <p className="text-sm text-gray-400">
                    Active Data Sources
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-900/30 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Real-time
                  </h3>
                  <p className="text-sm text-gray-400">Data Sync Status</p>
                </div>
              </div>

              {/* Uploaded Files */}
              <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 p-4">
                <h3 className="font-semibold text-white mb-4">
                  Uploaded Files
                </h3>
                <div className="space-y-3">
                  {files.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No files uploaded yet</p>
                    </div>
                  ) : (
                    files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-900/30 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <h4
                              className="font-medium text-white text-sm truncate"
                              style={{ maxWidth: '200px' }}
                            >
                              {file.name}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {file.file_type} •{' '}
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => deleteFile(file.name)}
                            className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-red-400 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;