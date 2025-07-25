import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapUtils, MapConfig } from '../services/Map';
// Services imported dynamically in workflow component
import BusinessAnalysisWorkflow from './BusinessAnalysisWorkflow';
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
  Search,
  Crosshair,
  Settings,
  Camera,
  Calculator
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
  // Map states
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const radiusCircleRef = useRef(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [pinLocations, setPinLocations] = useState([]);
  const [radiusValue, setRadiusValue] = useState(1000); // meters
  const [showRadius, setShowRadius] = useState(false);

  // Business analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showBusinessAnalysis, setShowBusinessAnalysis] = useState(false);

  // Initialize map when activeTab is 'map'
  useEffect(() => {
    if (activeTab === 'map' && mapRef.current && !mapInstanceRef.current) {
      try {
        console.log('Initializing map...');
        // Initialize map
        mapInstanceRef.current = MapUtils.createMap('map-container', {
          defaultCenter: MapConfig.defaultCenter,
          defaultZoom: MapConfig.defaultZoom
        });

        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }

      // Add custom zoom controls
      L.control.zoom({
        position: 'topleft'
      }).addTo(mapInstanceRef.current);

      // Map click handler - simplified for workflow
      mapInstanceRef.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        // Clear previous markers
        markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
        markersRef.current = [];

        // Add new marker
        const marker = MapUtils.addMarker(
          mapInstanceRef.current,
          lat,
          lng,
          {
            icon: MapConfig.markerIcons.selected,
            popup: `<div>
              <strong>Analysis Location</strong><br/>
              Lat: ${lat.toFixed(6)}<br/>
              Lng: ${lng.toFixed(6)}
            </div>`
          }
        );

        markersRef.current.push(marker);

        // Update selected location for workflow
        const newLocation = { lat, lng, id: Date.now() };

        // Try to get address
        try {
          const locationInfo = await MapUtils.reverseGeocode(lat, lng);
          if (locationInfo) {
            newLocation.address = locationInfo.display_name;
            marker.setPopupContent(`<div>
              <strong>Analysis Location</strong><br/>
              ${locationInfo.display_name}<br/>
              <small>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</small>
            </div>`);
          }
        } catch (error) {
          console.error('Error getting location info:', error);
        }

        setSelectedLocation(newLocation);
        setPinLocations([newLocation]);
      });
    }

    return () => {
      if (activeTab !== 'map' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        radiusCircleRef.current = null;
      }
    };
  }, [activeTab]);

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await MapUtils.geocodeLocation(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([result.lat, result.lon], 15);
      
      // Clear previous markers
      markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
      markersRef.current = [];

      // Add new marker
      const marker = MapUtils.addMarker(
        mapInstanceRef.current,
        result.lat,
        result.lon,
        {
          icon: MapConfig.markerIcons.selected,
          popup: `<div>
            <strong>${result.display_name}</strong><br/>
            <small>Lat: ${result.lat.toFixed(6)}, Lng: ${result.lon.toFixed(6)}</small>
          </div>`
        }
      );

      markersRef.current.push(marker);
      
      const newLocation = { 
        lat: result.lat, 
        lng: result.lon, 
        id: Date.now(),
        address: result.display_name
      };
      
      setPinLocations([newLocation]);
      setSelectedLocation(newLocation);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  // Toggle radius circle
  const toggleRadius = () => {
    if (!selectedLocation || !mapInstanceRef.current) return;

    if (showRadius && radiusCircleRef.current) {
      mapInstanceRef.current.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
      setShowRadius(false);
    } else {
      radiusCircleRef.current = MapUtils.addRadius(
        mapInstanceRef.current,
        selectedLocation.lat,
        selectedLocation.lng,
        radiusValue,
        {
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          weight: 2
        }
      );
      setShowRadius(true);
    }
  };

  // Update radius
  const updateRadius = (newRadius) => {
    setRadiusValue(newRadius);
    if (showRadius && radiusCircleRef.current && selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = MapUtils.addRadius(
        mapInstanceRef.current,
        selectedLocation.lat,
        selectedLocation.lng,
        newRadius,
        {
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          weight: 2
        }
      );
    }
  };

  // Clear all markers
  const clearMarkers = () => {
    if (mapInstanceRef.current) {
      markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
      markersRef.current = [];

      if (radiusCircleRef.current) {
        mapInstanceRef.current.removeLayer(radiusCircleRef.current);
        radiusCircleRef.current = null;
      }

      setPinLocations([]);
      setSelectedLocation(null);
      setShowRadius(false);
      setAnalysisResults(null);
    }
  };

  // Simple function to handle analysis completion
  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Content Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-white" />
            ) : (
              <ChevronRight className="w-5 h-5 text-white" />
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
            <div className="h-full bg-gray-900 rounded-xl border border-gray-700 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-semibold flex items-center text-white">
                  <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                  Interactive Location Map
                </h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={clearMarkers}
                    className="p-2 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-white"
                    title="Clear all markers"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowBusinessAnalysis(!showBusinessAnalysis)}
                    className={`p-2 rounded-lg transition-colors text-white ${
                      showBusinessAnalysis
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-900 hover:bg-gray-700'
                    }`}
                    title="Business Analysis"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-white">
                    <Navigation className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-white">
                    <Layers className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-white">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4 relative">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for locations..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.length > 2) {
                          handleSearch(e.target.value);
                        } else {
                          setSearchResults([]);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => selectSearchResult(result)}
                        className="w-full text-left p-3 hover:bg-gray-700 border-b border-gray-600 last:border-b-0 text-white"
                      >
                        <div className="font-medium truncate">{result.display_name}</div>
                        <div className="text-sm text-gray-400">
                          {result.type} • {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Map Controls */}
              {selectedLocation && (
                <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">Location Controls</h3>
                    <button
                      onClick={toggleRadius}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        showRadius 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {showRadius ? 'Hide Radius' : 'Show Radius'}
                    </button>
                  </div>
                  
                  {showRadius && (
                    <div className="flex items-center space-x-3">
                      <label className="text-sm text-gray-400">Radius:</label>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={radiusValue}
                        onChange={(e) => updateRadius(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-white w-20">
                        {radiusValue >= 1000 ? `${(radiusValue/1000).toFixed(1)}km` : `${radiusValue}m`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Map Container */}
              <div className="flex-1 bg-gray-900 rounded-lg border border-gray-600 relative overflow-hidden">
                <div
                  id="map-container"
                  ref={mapRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ minHeight: '400px' }}
                />

                {/* Loading indicator */}
                {!mapInstanceRef.current && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-400">Loading map...</p>
                      <p className="text-xs text-gray-500 mt-1">Connecting to map servers...</p>
                    </div>
                  </div>
                )}

                {/* Location Info Panel */}
                {selectedLocation && (
                  <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 max-w-xs border border-gray-600">
                    <h3 className="font-medium text-white mb-2">
                      Selected Location
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      {selectedLocation.address || 'Custom location'}
                    </p>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
                      </div>
                      {showRadius && (
                        <div className="flex items-center space-x-1">
                          <Crosshair className="w-3 h-3" />
                          <span>Radius: {radiusValue >= 1000 ? `${(radiusValue/1000).toFixed(1)}km` : `${radiusValue}m`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Business Analysis Workflow */}
              {showBusinessAnalysis && (
                <div className="mt-6">
                  <BusinessAnalysisWorkflow
                    mapInstance={mapInstanceRef.current}
                    selectedLocation={selectedLocation}
                    onLocationSelect={setSelectedLocation}
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="h-full bg-gray-900 rounded-xl border border-gray-700 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-lg font-semibold flex items-center text-white">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Business Analytics Dashboard
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-white">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-white">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
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

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
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

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
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

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
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
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <h3 className="font-semibold text-white mb-4">
                    Location Performance
                  </h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                      <p className="text-gray-400 text-sm">
                        Performance charts loading...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <h3 className="font-semibold text-white mb-4">
                    Traffic Trends
                  </h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-500" />
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
            <div className="h-full bg-gray-900 rounded-xl border border-gray-700 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-lg font-semibold flex items-center text-white">
                  <FileText className="w-5 h-5 mr-2 text-green-400" />
                  Location Intelligence Reports
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-colors text-sm text-white">
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
                  <select className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
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
                  <select className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
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
                  <select className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                    <option>PDF Report</option>
                    <option>Excel Spreadsheet</option>
                    <option>PowerPoint</option>
                    <option>Interactive Dashboard</option>
                  </select>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="flex-1 bg-gray-900 rounded-lg border border-gray-600 p-4">
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
                        <button className="p-1 hover:bg-gray-600 rounded transition-colors">
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
            <div className="h-full bg-gray-900 rounded-xl border border-gray-700 p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-lg font-semibold flex items-center text-white">
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
                    className="cursor-pointer px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg transition-colors text-sm text-white"
                  >
                    Import Data
                  </label>
                </div>
              </div>

              {fileTransferProgress && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-sm text-white mb-1">
                    Uploading: {fileTransferProgress.fileName}
                  </p>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
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
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-yellow-900/30 rounded-lg">
                      <Database className="w-5 h-5 text-yellow-400" />
                    </div>
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">2.8TB</h3>
                  <p className="text-sm text-gray-400">Total Data Storage</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
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

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
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
              <div className="flex-1 bg-gray-900 rounded-lg border border-gray-600 p-4">
                <h3 className="font-semibold text-white mb-4">
                  Uploaded Files
                </h3>
                <div className="space-y-3">
                  {files.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
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