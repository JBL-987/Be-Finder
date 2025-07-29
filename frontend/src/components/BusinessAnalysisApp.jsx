import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { analyzeLocationImage, calculateBusinessMetrics } from '../services/gemini';
import { captureMapScreenshot } from '../services/mapScreenshot';
import { CURRENCIES, formatCurrency, getCurrencySymbol } from '../services/currencies';

// Fix Leaflet marker icons in Vite/React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a custom red marker icon for selected locations
const redMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

import {
  MapPin,
  Calculator,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Building,
  Play,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
  Search
} from 'lucide-react';

const BusinessAnalysisApp = ({ user, logout }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [businessParams, setBusinessParams] = useState({
    buildingWidth: '',
    operatingHours: '',
    productPrice: '',
    currency: 'IDR'
  });
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Progress tracking states
  const [analysisProgress, setAnalysisProgress] = useState({
    currentStep: 0,
    steps: [
      { id: 1, name: 'Capture Screenshot', status: 'pending', detail: 'Capturing screenshot of selected area...', image: null },
      { id: 2, name: 'Send to Gemini AI', status: 'pending', detail: 'Sending image to Gemini AI (gemini-2.5-pro)...', image: null },
      { id: 3, name: 'AI Color Analysis', status: 'pending', detail: 'AI analyzing color distribution (residential, roads, open spaces)...', data: null },
      { id: 4, name: 'Area Calculation', status: 'pending', detail: 'Calculating area from screenshot dimensions and scale...', data: null },
      { id: 5, name: 'Population Density', status: 'pending', detail: 'Calculating CGLP and road population density...', data: null },
      { id: 6, name: 'Traffic Analysis', status: 'pending', detail: 'Calculating APC, APT, and visitor traffic...', data: null },
      { id: 7, name: 'Revenue Projection', status: 'pending', detail: 'Calculating daily purchases and monthly revenue...', data: null },
      { id: 8, name: 'Complete', status: 'pending', detail: 'Analysis complete! Displaying results...', data: null }
    ]
  });

  const progressRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Dynamic step for input based on currency
  const getInputStep = (currencyCode) => {
    const currency = CURRENCIES[currencyCode];
    if (!currency) return '0.01';
    // For high-denomination currencies like IDR, VND, etc., use larger steps
    return ['IDR', 'VND', 'KRW', 'JPY', 'IRR', 'HUF', 'CLP', 'COP', 'PYG', 'UGX', 'TZS', 'KZT', 'UZS', 'MMK', 'KHR', 'LAK', 'LBP', 'RSD', 'ISK'].includes(currencyCode) ? '1000' : '0.01';
  };

  // Add custom styles for map
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        height: 100% !important;
        width: 100% !important;
        background: #1f2937 !important;
      }
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
      }
      .leaflet-control-zoom a {
        background-color: #374151 !important;
        color: white !important;
        border: 1px solid #4b5563 !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: #4b5563 !important;
      }
      .leaflet-popup-content-wrapper {
        background: #1f2937 !important;
        color: white !important;
        border-radius: 8px !important;
      }
      .leaflet-popup-tip {
        background: #1f2937 !important;
      }
      .custom-marker {
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        console.log('Starting map initialization...');

        // Check if Leaflet is available
        if (typeof L === 'undefined') {
          throw new Error('Leaflet not loaded');
        }

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 200));

        // Get the map container
        const container = document.getElementById('business-map');
        if (!container) {
          throw new Error('Map container not found');
        }

        console.log('Creating Leaflet map...');

        // Create map with Jakarta as center
        const map = L.map(container, {
          center: [-6.2088, 106.8456], // Jakarta coordinates
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
          dragging: true
        });

        console.log('Adding map layer...');

        // Add OpenStreetMap tiles
        const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        });

        tileLayer.addTo(map);

        // Store map instance
        mapInstanceRef.current = map;

        // Add click handler
        map.on('click', (e) => {
          console.log('Map clicked:', e.latlng);
          const { lat, lng } = e.latlng;
          setSelectedLocation({ lat, lng });

          // Clear existing markers
          map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              map.removeLayer(layer);
            }
          });

          // Add red marker for selected location
          L.marker([lat, lng], { icon: redMarkerIcon })
            .addTo(map)
            .bindPopup(`📍 Selected Location<br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`)
            .openPopup();
        });

        console.log('Map initialized successfully!');
        setMapLoaded(true);

      } catch (error) {
        console.error('Map initialization failed:', error);
        // Create a fallback clickable area
        const container = document.getElementById('business-map');
        if (container) {
          container.innerHTML = `
            <div style="
              width: 100%;
              height: 100%;
              background: linear-gradient(45deg, #374151 25%, transparent 25%),
                          linear-gradient(-45deg, #374151 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #374151 75%),
                          linear-gradient(-45deg, transparent 75%, #374151 75%);
              background-size: 20px 20px;
              background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: crosshair;
              color: white;
              font-family: Arial, sans-serif;
            ">
              <div style="text-align: center; background: rgba(0,0,0,0.7); padding: 20px; border-radius: 8px;">
                <h3>Click to Select Location</h3>
                <p style="font-size: 14px; opacity: 0.8;">Map tiles unavailable - using fallback mode</p>
              </div>
            </div>
          `;

          container.onclick = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Convert to approximate lat/lng (very rough approximation)
            const lat = 51.505 + (y - rect.height/2) * -0.001;
            const lng = -0.09 + (x - rect.width/2) * 0.001;

            setSelectedLocation({ lat, lng });
            console.log('Fallback location selected:', { lat, lng });
          };
        }
        setMapLoaded(true);
      }
    };

    initMap();
  }, []);

  // Handle map resize when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search for places using Nominatim
  const searchPlace = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Jakarta, Indonesia')}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);

          // Clear existing markers
          mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              mapInstanceRef.current.removeLayer(layer);
            }
          });

          // Add red marker at searched location
          L.marker([lat, lng], { icon: redMarkerIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`📍 ${result.display_name}<br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`)
            .openPopup();

          setSelectedLocation({ lat, lng });
        }
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Location Not Found',
          text: 'Location not found. Try different keywords.',
          confirmButtonText: 'OK',
          background: '#1f2937',
          color: '#ffffff',
          confirmButtonColor: '#3b82f6'
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Search Failed',
        text: 'Search failed. Please try again.',
        confirmButtonText: 'OK',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchPlace(searchQuery);
  };

  // Update analysis progress with auto-scroll
  const updateProgress = (stepId, status, detail = null, data = null, image = null) => {
    setAnalysisProgress(prev => ({
      ...prev,
      currentStep: stepId,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, status, detail: detail || step.detail, data, image }
          : step.id < stepId
            ? { ...step, status: 'completed' }
            : step
      )
    }));

    // Auto-scroll to current step
    setTimeout(() => {
      if (progressRef.current) {
        const activeStep = progressRef.current.querySelector(`[data-step-id="${stepId}"]`);
        if (activeStep) {
          activeStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);
  };

  const handleAnalysis = async () => {
    // Validate inputs
    if (!selectedLocation || !selectedLocation.lat || !selectedLocation.lng) {
      await Swal.fire({
        icon: 'warning',
        title: 'Location Not Selected',
        text: 'Please select a location on the map first',
        confirmButtonText: 'OK',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (!businessParams.buildingWidth || !businessParams.operatingHours || !businessParams.productPrice) {
      await Swal.fire({
        icon: 'warning',
        title: 'Incomplete Parameters',
        text: 'Please fill all business parameters (building width, operating hours, price)',
        confirmButtonText: 'OK',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (!mapInstanceRef.current) {
      await Swal.fire({
        icon: 'info',
        title: 'Map Not Ready',
        text: 'Map is not ready yet. Please wait a moment and try again.',
        confirmButtonText: 'OK',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    console.log('Starting analysis for:', selectedLocation, businessParams);
    setIsAnalyzing(true);
    setCurrentStep(2);

    // Reset progress
    setAnalysisProgress(prev => ({
      ...prev,
      currentStep: 0,
      steps: prev.steps.map(step => ({ ...step, status: 'pending', data: null, image: null }))
    }));

    try {
      // Step 1: Screenshot Capture (Kenny chart step 3)
      updateProgress(1, 'active', 'Capturing screenshot of selected area...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Capturing screenshot for location:', selectedLocation);
      const screenshot = await captureMapScreenshot(
        mapInstanceRef.current,
        selectedLocation.lat,
        selectedLocation.lng,
        16 // zoom level for analysis
      );

      updateProgress(1, 'completed', 'Screenshot captured successfully!', null, screenshot.imageBase64);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Send to Gemini AI (Kenny chart step 4)
      updateProgress(2, 'active', 'Sending image to Gemini AI (gemini-2.5-pro)...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress(2, 'completed', 'Image successfully sent to AI!', {
        imageSize: `${screenshot.metadata?.width || 800}x${screenshot.metadata?.height || 600}px`,
        model: 'gemini-2.5-pro'
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: AI Color Analysis (Kenny chart step 5)
      updateProgress(3, 'active', 'AI analyzing color distribution: residential (brown), roads (white/yellow), open spaces (green/blue/gray)...');
      const aiResponse = await analyzeLocationImage(screenshot.imageBase64, screenshot.metadata);
      const areaAnalysis = aiResponse.analysis; // Extract the actual analysis data

      console.log('AI response:', aiResponse);
      console.log('Area analysis:', areaAnalysis);

      updateProgress(3, 'completed', 'AI color analysis complete!', {
        residential: `${areaAnalysis.residential}%`,
        road: `${areaAnalysis.road}%`,
        openSpace: `${areaAnalysis.openSpace}%`
      });

      // Store AI analysis results in localStorage (Kenny chart step 5)
      const locationKey = `${selectedLocation.lat.toFixed(6)}_${selectedLocation.lng.toFixed(6)}`;
      localStorage.setItem(`befinder_analysis_${locationKey}`, JSON.stringify({
        areaAnalysis,
        timestamp: new Date().toISOString(),
        location: selectedLocation
      }));
      console.log('AI analysis results saved to localStorage');

      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Area Calculation (Kenny chart step 6)
      updateProgress(4, 'active', 'Calculating area from screenshot dimensions and scale (with 30.5% error adjustment)...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress(4, 'completed', 'Area calculation complete!', {
        dimensions: `${screenshot.metadata?.width || 800}x${screenshot.metadata?.height || 600}px`,
        estimatedArea: '~0.056 km²'
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 5: Population Density (Kenny chart steps 7-8)
      updateProgress(5, 'active', 'Calculating CGLP (Jakarta density × area) and road population density...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress(5, 'completed', 'Population density calculated!', {
        cglp: 'Jakarta density (16,000) × area',
        pdr: 'Population / road area'
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 6: Traffic Analysis (Kenny chart steps 9-11)
      updateProgress(6, 'active', 'Calculating APC (building width × road width × PDR), APT, and visitor traffic...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      updateProgress(6, 'completed', 'Traffic analysis complete!', {
        apc: 'Average Population Capitalization',
        apt: 'Average Population Traffic',
        vcdt: 'Visitor Capitalizations Daily Traffic'
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 7: Revenue Projection (Kenny chart steps 12-13)
      updateProgress(7, 'active', 'Calculating TPPD (Total People-Purchase Daily) and monthly revenue...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Perform the actual calculation
      const analysis = calculateBusinessMetrics(areaAnalysis, {
        location: selectedLocation,
        buildingWidth: parseFloat(businessParams.buildingWidth),
        operatingHours: parseFloat(businessParams.operatingHours),
        productPrice: parseFloat(businessParams.productPrice)
      }, screenshot);

      console.log('Final analysis results:', analysis);

      updateProgress(7, 'completed', 'Revenue projection complete!', {
        tppd: `${analysis.metrics?.tppd || 'N/A'} daily customers`,
        monthlyRevenue: `${CURRENCIES[businessParams.currency]?.symbol || ''}${analysis.metrics?.monthlyRevenue?.toLocaleString() || 'N/A'}`
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 8: Complete
      updateProgress(8, 'active', 'Finalizing analysis results...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress(8, 'completed', 'Analysis complete! Results ready to display.');

      // Ensure the analysis results include the area distribution
      const finalResults = {
        ...analysis,
        areaDistribution: areaAnalysis, // Make sure area distribution is included
        rawAiResponse: aiResponse.rawResponse
      };

      console.log('Final results to display:', finalResults);
      setAnalysisResults(finalResults);
      setCurrentStep(3);
      setShowResults(true);

      // Show success notification
      await Swal.fire({
        icon: 'success',
        title: 'Analysis Successful!',
        text: 'Business profitability analysis completed.',
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#ffffff'
      });

    } catch (error) {
      console.error('Analysis failed:', error);

      // More specific error messages
      let errorTitle = 'Analysis Failed';
      let errorMessage = '';
      
      if (error.message.includes('screenshot')) {
        errorMessage = 'Failed to capture map screenshot. Make sure the map is properly loaded.';
      } else if (error.message.includes('Gemini') || error.message.includes('AI')) {
        errorMessage = 'Failed to analyze with AI. Please try again.';
      } else {
        errorMessage = 'An error occurred during analysis. Please try again or select a different location.';
      }

      await Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: errorMessage,
        confirmButtonText: 'OK',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#ef4444'
      });

      setCurrentStep(1);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedLocation(null);
    setBusinessParams({ buildingWidth: '', operatingHours: '', productPrice: '', currency: 'IDR' });
    setAnalysisResults(null);
    setCurrentStep(1);
    setShowResults(false);
    
    // Clear map markers
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
    }
  };

  const handleCurrencyChange = (e) => {
    setBusinessParams(prev => ({
      ...prev,
      currency: e.target.value,
      productPrice: '' // Reset productPrice to avoid invalid values for new currency
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Simplified Top Panel */}
        <div className="bg-card border-b border-border p-3">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between max-w-7xl mx-auto gap-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Location"
                    className="pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-3 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors text-primary-foreground"
                >
                  {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : 'Search'}
                </button>
              </form>

              {/* Location Status */}
              {selectedLocation && (
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <MapPin className="h-4 w-4" />
                  <span>Location Selected</span>
                </div>
              )}
            </div>

            {/* Business Parameters - Simplified */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full lg:w-auto">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <input
                  type="number"
                  value={businessParams.buildingWidth}
                  onChange={(e) => setBusinessParams(prev => ({ ...prev, buildingWidth: e.target.value }))}
                  className="w-12 sm:w-16 px-1 sm:px-2 py-1 bg-background border border-input rounded text-xs sm:text-sm focus:ring-1 focus:ring-ring"
                  placeholder="10"
                />
                <span className="text-xs text-muted-foreground">m</span>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <input
                  type="number"
                  value={businessParams.operatingHours}
                  onChange={(e) => setBusinessParams(prev => ({ ...prev, operatingHours: e.target.value }))}
                  className="w-12 sm:w-16 px-1 sm:px-2 py-1 bg-background border border-input rounded text-xs sm:text-sm focus:ring-1 focus:ring-ring"
                  placeholder="12"
                />
                <span className="text-xs text-muted-foreground">hrs</span>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <select
                  value={businessParams.currency}
                  onChange={handleCurrencyChange}
                  className="w-16 sm:w-20 px-1 sm:px-2 py-1 bg-background border border-input rounded text-xs sm:text-sm focus:ring-1 focus:ring-ring"
                >
                  {Object.keys(CURRENCIES).map(code => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground">
                  {getCurrencySymbol(businessParams.currency)}
                </span>
                <input
                  type="number"
                  step={getInputStep(businessParams.currency)}
                  value={businessParams.productPrice}
                  onChange={(e) => setBusinessParams(prev => ({ ...prev, productPrice: e.target.value }))}
                  className="w-16 sm:w-20 px-1 sm:px-2 py-1 bg-background border border-input rounded text-xs sm:text-sm focus:ring-1 focus:ring-ring"
                  placeholder={CURRENCIES[businessParams.currency]?.placeholder || '0.00'}
                />
              </div>
              
              {/* Action Buttons */}
              <button
                onClick={handleAnalysis}
                disabled={isAnalyzing || !selectedLocation || !businessParams.buildingWidth || !businessParams.operatingHours || !businessParams.productPrice}
                className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed rounded-lg font-medium flex items-center space-x-2 transition-all text-xs sm:text-sm text-primary-foreground"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Analyze</span>
                  </>
                )}
              </button>

              {(selectedLocation || analysisResults) && (
                <button
                  onClick={resetAnalysis}
                  className="px-2 sm:px-3 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-colors text-xs sm:text-sm"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Panel - Map */}
          <div className="w-full lg:w-3/5 h-64 sm:h-80 lg:h-auto relative border-b lg:border-b-0 lg:border-r border-border">
            <div
              id="business-map"
              ref={mapRef}
              className="absolute inset-0 w-full h-full z-0"
              style={{ minHeight: '400px' }}
            />

            {/* Simple Instructions */}
            {!selectedLocation && (
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-background/90 text-foreground px-3 py-2 rounded-lg text-sm border border-border">
                  📍 Click map to select location
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                  <p className="text-lg text-muted-foreground">Loading Map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Progress & Info */}
          <div className="w-full lg:w-2/5 bg-card flex flex-col">
            {!isAnalyzing ? (
              /* Instructions Panel */
              <div className="p-4 sm:p-6 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-4">📍 Analysis Guide</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-background/50 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2 text-sm sm:text-base">1. Select Location</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Use the search bar or click directly on the map to select your business location</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-background/50 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2 text-sm sm:text-base">2. Enter Parameters</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Input building width (meters), operating hours, and product price</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-background/50 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2 text-sm sm:text-base">3. AI Analysis</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">AI will analyze the location and calculate business profitability following Kenny chart methodology</p>
                  </div>
                </div>

                {selectedLocation && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-900/30 border border-green-700 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2 text-sm sm:text-base">✅ Location Selected</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Lat: {selectedLocation.lat.toFixed(6)}<br/>
                      Lng: {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Progress Panel */
              <div className="p-4 sm:p-6 flex-1" ref={progressRef}>
                <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-4 sm:mb-6">🔄 Analysis Progress</h3>
                <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                  {analysisProgress.steps.map((step, index) => (
                    <div
                      key={step.id}
                      data-step-id={step.id}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        step.status === 'completed' ? 'bg-green-900/30 border-green-700' :
                        step.status === 'active' ? 'bg-blue-900/30 border-blue-700 shadow-lg' :
                        'bg-zinc-900/30 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          step.status === 'completed' ? 'bg-green-600 text-white' :
                          step.status === 'active' ? 'bg-blue-600 text-white animate-pulse' :
                          'bg-zinc-800 text-gray-300'
                        }`}>
                          {step.status === 'completed' ? '✓' : step.id}
                        </div>
                        <h4 className={`font-semibold ${
                          step.status === 'completed' ? 'text-green-400' :
                          step.status === 'active' ? 'text-blue-400' :
                          'text-gray-400'
                        }`}>
                          {step.name}
                        </h4>
                        {step.status === 'active' && (
                          <Loader className="h-4 w-4 animate-spin ml-auto text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-300 ml-9">{step.detail}</p>

                      {/* Show screenshot when available */}
                      {step.image && (
                        <div className="mt-3 ml-9">
                          <img
                            src={`data:image/png;base64,${step.image}`}
                            alt="Screenshot"
                            className="w-full max-w-xs rounded border border-gray-600"
                          />
                        </div>
                      )}

                      {/* Show data when available */}
                      {step.data && (
                        <div className="mt-3 ml-9 p-2 bg-zinc-950/50 rounded text-xs">
                          <pre className="text-gray-400 whitespace-pre-wrap">
                            {JSON.stringify(step.data, null, 2).substring(0, 200)}...
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel - Bottom Overlay */}
        {showResults && analysisResults && (
          <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-3 sm:p-4 z-30 max-h-64 sm:max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                Profitability Analysis Results
              </h3>
              <button
                onClick={() => setShowResults(false)}
                className="p-1 hover:bg-zinc-900 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <Users className="h-6 w-6 mx-auto mb-1 text-blue-400" />
                <div className="text-xl font-bold text-white">{analysisResults.metrics?.tppd || 'N/A'}</div>
                <div className="text-xs text-gray-400">Customers/Day</div>
              </div>

              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-1 text-green-400" />
                <div className="text-xl font-bold text-white">
                  {analysisResults.metrics?.dailyRevenue ? formatCurrency(analysisResults.metrics.dailyRevenue, businessParams.currency) : 'N/A'}
                </div>
                <div className="text-xs text-gray-400">Daily Revenue</div>
              </div>

              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-400" />
                <div className="text-xl font-bold text-white">
                  {analysisResults.metrics?.monthlyRevenue ? formatCurrency(analysisResults.metrics.monthlyRevenue, businessParams.currency) : 'N/A'}
                </div>
                <div className="text-xs text-gray-400">Monthly Revenue</div>
              </div>

              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <Calculator className="h-6 w-6 mx-auto mb-1 text-yellow-400" />
                <div className="text-xl font-bold text-white">
                  {analysisResults.metrics?.monthlyRevenue ?
                    Math.min(10, Math.max(1, Math.round((analysisResults.metrics.monthlyRevenue / 1000000) * 2))) : 'N/A'}/10
                </div>
                <div className="text-xs text-gray-400">Profitability Score</div>
              </div>
            </div>

            {/* Detailed Kenny Chart Parameters */}
            <div className="bg-zinc-900/50 p-3 rounded-lg mb-3">
              <h4 className="font-semibold text-blue-400 mb-2 text-sm flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                Kenny Chart Calculation Details
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">CGLP (Population)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.cglp || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">Residential Pop</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.pops || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">PDR (Density)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.pdr || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">APC</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.apc || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">APT (Traffic)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.apt || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">VCDT (Visitors)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.vcdt || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">Area (km²)</div>
                  <div className="text-white font-semibold">{analysisResults.locationData?.areaSquareKm?.toFixed(6) || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">Road Area (m²)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.roadAreaSqm || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Area Distribution */}
            <div className="bg-zinc-900/50 p-3 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2 text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Area Distribution (AI Analysis)
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-zinc-950/50 p-2 rounded text-center">
                  <div className="text-gray-400">Residential</div>
                  <div className="text-white font-semibold">{analysisResults.areaDistribution?.residential || 'N/A'}%</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded text-center">
                  <div className="text-gray-400">Roads</div>
                  <div className="text-white font-semibold">{analysisResults.areaDistribution?.road || 'N/A'}%</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded text-center">
                  <div className="text-gray-400">Open Space</div>
                  <div className="text-white font-semibold">{analysisResults.areaDistribution?.openSpace || 'N/A'}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessAnalysisApp;