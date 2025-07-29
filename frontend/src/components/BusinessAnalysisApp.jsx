import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jsPDF from 'jspdf';
import { analyzeLocationImage, calculateBusinessMetrics } from '../services/gemini';
import { captureMapScreenshot } from '../services/mapScreenshot';
import { CURRENCIES, formatCurrency, getCurrencySymbol } from '../services/currencies';
import { autoSaveAnalysisResult, saveAnalysisResult, getActor } from '../services/analysisStorage';

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
  Play,
  AlertCircle,
  Loader,
  X,
  Search,
  Save,
  FolderOpen,
  Download,
  Trash2,
  FileText,
  File
} from 'lucide-react';

const BusinessAnalysisApp = ({ actor, isAuthenticated, login, logout }) => {
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

  // Essential state hooks
  const [files, setFiles] = useState([]);
  const [fileTransferProgress, setFileTransferProgress] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFileManager, setShowFileManager] = useState(false);

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

  // Updated input step helper
  const getInputStep = (currencyCode) => {
    const highDenominationCurrencies = ['IDR', 'VND', 'KRW', 'JPY'];
    return highDenominationCurrencies.includes(currencyCode) ? '1000' : '0.01';
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

  // Load files when component mounts
  useEffect(() => {
    loadFiles();
  }, []);

  // Function to load files from backend
  const loadFiles = async () => {
    try {
      const actor = getActor();
      const fileList = await actor.getFiles();
      
      // Convert BigInt values to Numbers
      const formattedFiles = fileList.map(file => ({
        name: file.name,
        size: safeBigIntToNumber(file.size),
        fileType: file.fileType
      }));

      setFiles(formattedFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Loading Failed',
        text: 'Failed to load files from backend',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // Add this helper function at the top of your component
  const safeBigIntToNumber = (value) => {
    if (typeof value === 'bigint') {
      return Number(value);
    }
    if (typeof value === 'string') {
      return Number(value);
    }
    return Number(value || 0);
  };

  // File upload function with chunked upload
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    setErrorMessage('');

    if (!file) {
      await Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      const actor = getActor();
      
      if (await actor.checkFileExists(file.name)) {
        await Swal.fire({
          icon: 'warning',
          title: 'File Already Exists',
          text: `File "${file.name}" already exists. Please choose a different file name.`,
          background: '#1f2937',
          color: '#ffffff',
          confirmButtonColor: '#3b82f6'
        });
        return;
      }

      setFileTransferProgress({
        mode: 'Uploading',
        fileName: file.name,
        progress: 0
      });

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = new Uint8Array(e.target.result);
        const chunkSize = 1024 * 1024; // 1 MB chunks
        const totalChunks = Math.ceil(content.length / chunkSize);

        try {
          for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, content.length);
            const chunk = content.slice(start, end);

            await actor.uploadFileChunk(file.name, chunk, i, file.type);
            const progressPercent = Math.floor(((i + 1) / totalChunks) * 100);
            setFileTransferProgress(prev => ({
              ...prev,
              progress: progressPercent
            }));
          }

          await loadFiles();
          await Swal.fire({
            icon: 'success',
            title: 'Upload Complete',
            text: `${file.name} has been uploaded successfully.`,
            timer: 2000,
            showConfirmButton: false,
            background: '#1f2937',
            color: '#ffffff'
          });
        } catch (error) {
          console.error('Upload failed:', error);
          await Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: `Failed to upload ${file.name}: ${error.message}`,
            background: '#1f2937',
            color: '#ffffff',
            confirmButtonColor: '#ef4444'
          });
        } finally {
          setFileTransferProgress(null);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Upload preparation failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: `Failed to prepare upload: ${error.message}`,
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#ef4444'
      });
      setFileTransferProgress(null);
    }
  }


  // File download function with chunked download
  async function handleFileDownload(name) {
    try {
      setFileTransferProgress({
        mode: 'Downloading',
        fileName: name,
        progress: 0
      });
      
      const actor = getActor();
      const totalChunksResult = await actor.getTotalChunks(name);
      const totalChunks = typeof totalChunksResult === 'bigint' ? Number(totalChunksResult) : totalChunksResult;
      const fileTypeResult = await actor.getFileType(name);
      const fileType = fileTypeResult?.[0] || 'application/octet-stream';
      
      const chunks = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunkBlob = await actor.getFileChunk(name, i);
        if (!chunkBlob?.[0]) {
          throw new Error(`Failed to retrieve chunk ${i}`);
        }
        
        chunks.push(chunkBlob[0]);
        setFileTransferProgress(prev => ({
          ...prev,
          progress: Math.floor(((i + 1) / totalChunks) * 100)
        }));
      }

      const data = new Blob(chunks, { type: fileType });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);

      await Swal.fire({
        icon: 'success',
        title: 'Download Complete',
        text: `${name} has been downloaded successfully.`,
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#ffffff'
      });
    } catch (error) {
      console.error('Download failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: `Failed to download ${name}: ${error.message}`,
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setFileTransferProgress(null);
    }
  }


  // File delete function
  async function handleFileDelete(name) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Confirm Delete',
      text: `Are you sure you want to delete "${name}"?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      try {
        const actor = getActor();
        const success = await actor.deleteFile(name);
        
        if (success) {
          await loadFiles();
          await Swal.fire({
            icon: 'success',
            title: 'File Deleted',
            text: `${name} has been deleted successfully.`,
            timer: 2000,
            showConfirmButton: false,
            background: '#1f2937',
            color: '#ffffff'
          });
        } else {
          throw new Error('Delete operation failed');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: `Failed to delete ${name}: ${error.message}`,
          background: '#1f2937',
          color: '#ffffff',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  }

  // PDF generation function for analysis results and upload to backend
  const generateAndUploadPDF = async () => {
    if (!analysisResults) {
      setErrorMessage('No analysis results to export');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('Business Analysis Report', 20, 20);
      
      // Location info
      doc.setFontSize(12);
      doc.text(`Location: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`, 20, 40);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
      
      // Business Parameters
      doc.setFontSize(14);
      doc.text('Business Parameters:', 20, 70);
      doc.setFontSize(10);
      doc.text(`Building Width: ${businessParams.buildingWidth}m`, 20, 80);
      doc.text(`Operating Hours: ${businessParams.operatingHours} hours`, 20, 90);
      doc.text(`Product Price: ${formatCurrency(parseFloat(businessParams.productPrice), businessParams.currency)}`, 20, 100);
      
      // Key Metrics
      doc.setFontSize(14);
      doc.text('Key Metrics:', 20, 120);
      doc.setFontSize(10);
      doc.text(`Daily Customers: ${analysisResults.metrics?.tppd || 'N/A'}`, 20, 130);
      doc.text(`Daily Revenue: ${analysisResults.metrics?.dailyRevenue ? formatCurrency(analysisResults.metrics.dailyRevenue, businessParams.currency) : 'N/A'}`, 20, 140);
      doc.text(`Monthly Revenue: ${analysisResults.metrics?.monthlyRevenue ? formatCurrency(analysisResults.metrics.monthlyRevenue, businessParams.currency) : 'N/A'}`, 20, 150);
      
      // Area Distribution
      doc.setFontSize(14);
      doc.text('Area Distribution:', 20, 170);
      doc.setFontSize(10);
      doc.text(`Residential: ${analysisResults.areaDistribution?.residential || 'N/A'}%`, 20, 180);
      doc.text(`Roads: ${analysisResults.areaDistribution?.road || 'N/A'}%`, 20, 190);
      doc.text(`Open Space: ${analysisResults.areaDistribution?.openSpace || 'N/A'}%`, 20, 200);
      
      // Kenny Chart Details
      doc.setFontSize(14);
      doc.text('Kenny Chart Calculations:', 20, 220);
      doc.setFontSize(10);
      doc.text(`CGLP (Population): ${analysisResults.metrics?.cglp || 'N/A'}`, 20, 230);
      doc.text(`PDR (Density): ${analysisResults.metrics?.pdr || 'N/A'}`, 20, 240);
      doc.text(`APC: ${analysisResults.metrics?.apc || 'N/A'}`, 20, 250);
      doc.text(`APT (Traffic): ${analysisResults.metrics?.apt || 'N/A'}`, 20, 260);
      doc.text(`VCDT (Visitors): ${analysisResults.metrics?.vcdt || 'N/A'}`, 20, 270);
      
      // Generate PDF as blob
      const pdfBlob = doc.output('blob');
      const fileName = `business-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Upload PDF to backend
      const actor = getActor();
      
      if (await actor.checkFileExists(fileName)) {
        const timestamp = new Date().getTime();
        const uniqueFileName = `business-analysis-${new Date().toISOString().split('T')[0]}-${timestamp}.pdf`;
        await uploadPDFToBackend(pdfBlob, uniqueFileName);
      } else {
        await uploadPDFToBackend(pdfBlob, fileName);
      }
      
      await loadFiles();
      
      Swal.fire({
        icon: 'success',
        title: 'PDF Generated & Saved!',
        text: `Analysis report saved to blockchain storage as ${fileName}`,
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      setErrorMessage('Failed to generate and save PDF report');
    }
  };

  // Helper function to upload PDF to backend
  const uploadPDFToBackend = async (pdfBlob, fileName) => {
    const actor = getActor();
    
    setFileTransferProgress({
      mode: 'Uploading',
      fileName: fileName,
      progress: 0
    });

    const arrayBuffer = await pdfBlob.arrayBuffer();
    const content = new Uint8Array(arrayBuffer);
    const chunkSize = 1024 * 1024; // 1 MB chunks
    const totalChunks = Math.ceil(content.length / chunkSize);

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, content.length);
        const chunk = content.slice(start, end);

        await actor.uploadFileChunk(fileName, chunk, i, 'application/pdf');
        
        // FIXED: Explicit conversion for progress calculation
        const progressPercent = Math.floor(((i + 1) / totalChunks) * 100);
        setFileTransferProgress((prev) => ({
          ...prev,
          progress: progressPercent
        }));
      }
    } finally {
      setFileTransferProgress(null);
    }
  };

  // Generate comprehensive analysis report and save to blockchain storage
  const generateAnalysisReport = async (title) => {
    if (!analysisResults) {
      throw new Error('No analysis results to generate report');
    }

    try {
      const doc = new jsPDF();
      const currentDate = new Date();
      
      // Header with title
      doc.setFontSize(22);
      doc.setFont(undefined, 'bold');
      doc.text('BE-FINDER BUSINESS ANALYSIS REPORT', 20, 25);
      
      // Analysis title
      doc.setFontSize(16);
      doc.setFont(undefined, 'normal');
      doc.text(title, 20, 40);
      
      // Date and location
      doc.setFontSize(12);
      doc.text(`Generated: ${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`, 20, 55);
      doc.text(`Location: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`, 20, 65);
      
      // Separator line
      doc.setLineWidth(0.5);
      doc.line(20, 75, 190, 75);
      
      // Executive Summary
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('EXECUTIVE SUMMARY', 20, 90);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const dailyRevenue = Number(analysisResults.metrics?.dailyRevenue || 0);
      const monthlyRevenue = Number(analysisResults.metrics?.monthlyRevenue || 0);
      const yearlyRevenue = monthlyRevenue * 12;
      const dailyCustomers = Number(analysisResults.metrics?.tppd || 0);
      
      doc.text(`This analysis evaluates the business potential for the selected location using`, 20, 105);
      doc.text(`AI-powered area analysis and Kenny Chart methodology.`, 20, 115);
      doc.text(``, 20, 125);
      doc.text(`Key Findings:`, 20, 135);
      doc.text(`• Estimated Daily Customers: ${dailyCustomers}`, 25, 145);
      doc.text(`• Daily Revenue Potential: ${formatCurrency(dailyRevenue, businessParams.currency)}`, 25, 155);
      doc.text(`• Monthly Revenue Potential: ${formatCurrency(monthlyRevenue, businessParams.currency)}`, 25, 165);
      doc.text(`• Annual Revenue Potential: ${formatCurrency(yearlyRevenue, businessParams.currency)}`, 25, 175);
      
      // Business Parameters
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('BUSINESS PARAMETERS', 20, 195);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Building Width: ${businessParams.buildingWidth} meters`, 20, 210);
      doc.text(`Operating Hours: ${businessParams.operatingHours} hours per day`, 20, 220);
      doc.text(`Product Price: ${formatCurrency(parseFloat(businessParams.productPrice), businessParams.currency)}`, 20, 230);
      doc.text(`Currency: ${businessParams.currency}`, 20, 240);
      
      // Area Analysis (AI Results)
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('AI AREA ANALYSIS', 20, 260);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Using Gemini AI 2.5 Pro for satellite image analysis:`, 20, 275);
      doc.text(`• Residential Area: ${analysisResults.areaDistribution?.residential || 'N/A'}%`, 25, 285);
      doc.text(`• Road Coverage: ${analysisResults.areaDistribution?.road || 'N/A'}%`, 25, 295);
      doc.text(`• Open Space: ${analysisResults.areaDistribution?.openSpace || 'N/A'}%`, 25, 305);
      
      // New page for detailed calculations
      doc.addPage();
      
      // Kenny Chart Calculations
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('KENNY CHART METHODOLOGY', 20, 25);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`The Kenny Chart is a proven methodology for business location analysis`, 20, 40);
      doc.text(`that calculates customer potential based on population density and traffic patterns.`, 20, 50);
      
      doc.text(``, 20, 65);
      doc.setFont(undefined, 'bold');
      doc.text('Calculation Details:', 20, 75);
      doc.setFont(undefined, 'normal');
      
      doc.text(`CGLP (Catchment General Location Population): ${Number(analysisResults.metrics?.cglp || 0)}`, 25, 90);
      doc.text(`POPS (Population on Residential): ${Number(analysisResults.metrics?.pops || 0)}`, 25, 100);
      doc.text(`PDR (Population Density Ratio): ${analysisResults.metrics?.pdr || 'N/A'}`, 25, 110);
      doc.text(`Road Area: ${Number(analysisResults.metrics?.roadAreaSqm || 0)} m²`, 25, 120);
      doc.text(`APC (Average Population Capitalization): ${analysisResults.metrics?.apc || 'N/A'}`, 25, 130);
      doc.text(`APT (Average Population Traffic): ${Number(analysisResults.metrics?.apt || 0)}`, 25, 140);
      doc.text(`VCDT (Visitor Capitalizations Daily Traffic): ${Number(analysisResults.metrics?.vcdt || 0)}`, 25, 150);
      doc.text(`TPPD (Total People-Purchase Daily): ${dailyCustomers}`, 25, 160);
      
      // Revenue Breakdown
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('REVENUE PROJECTIONS', 20, 180);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Based on calculated customer traffic and pricing:`, 20, 195);
      doc.text(``, 20, 205);
      doc.text(`Daily Revenue: ${formatCurrency(dailyRevenue, businessParams.currency)}`, 25, 215);
      doc.text(`Monthly Revenue: ${formatCurrency(monthlyRevenue, businessParams.currency)}`, 25, 225);
      doc.text(`Annual Revenue: ${formatCurrency(yearlyRevenue, businessParams.currency)}`, 25, 235);
      
      // Profitability Score
      const profitabilityScore = monthlyRevenue ?
        Math.min(10, Math.max(1, Math.round((monthlyRevenue / 1000000) * 2))) : 0;
      
      doc.text(``, 20, 250);
      doc.setFont(undefined, 'bold');
      doc.text(`Profitability Score: ${profitabilityScore}/10`, 25, 260);
      doc.setFont(undefined, 'normal');
      
      let scoreDescription = '';
      if (profitabilityScore >= 8) scoreDescription = 'Excellent business potential';
      else if (profitabilityScore >= 6) scoreDescription = 'Good business potential';
      else if (profitabilityScore >= 4) scoreDescription = 'Moderate business potential';
      else scoreDescription = 'Consider alternative locations';
      
      doc.text(`Assessment: ${scoreDescription}`, 25, 270);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Generated by Be-Finder - AI-Powered Business Location Analysis', 20, 285);
      doc.text('This report is based on AI analysis and statistical calculations. Results may vary.', 20, 292);
      
      // Generate PDF and save to blockchain
      const pdfBlob = doc.output('blob');
      const timestamp = new Date().getTime();
      const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Report_${timestamp}.pdf`;
      
      await uploadPDFToBackend(pdfBlob, fileName);
      await loadFiles(); // Refresh file list
      
      console.log(`Analysis report generated and saved: ${fileName}`);
      return fileName;
      
    } catch (error) {
      console.error('Report generation failed:', error);
      throw error;
    }
  };

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

      // Auto-save analysis results to Motoko backend
      try {
        const businessParamsWithLocation = {
          ...businessParams,
          location: selectedLocation
        };
        
        await autoSaveAnalysisResult(finalResults, businessParamsWithLocation);
        console.log('Analysis results auto-saved to Motoko backend');
      } catch (saveError) {
        console.warn('Auto-save to backend failed:', saveError);
        // Continue with success notification even if save fails
      }

      // Show success notification
      await Swal.fire({
        icon: 'success',
        title: 'Analysis Successful!',
        text: 'Business profitability analysis completed and saved.',
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

  // Manual save function for results panel - now automatically generates report file
  const handleManualSave = async () => {
    if (!analysisResults || !selectedLocation) {
      await Swal.fire({
        icon: 'warning',
        title: 'No Analysis to Save',
        text: 'Please complete an analysis first before saving.',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      const { value: title } = await Swal.fire({
        title: 'Save Analysis to Blockchain',
        input: 'text',
        inputLabel: 'Analysis Title (Optional)',
        inputPlaceholder: 'Enter a title for this analysis...',
        showCancelButton: true,
        confirmButtonText: 'Save to ICP Blockchain',
        cancelButtonText: 'Cancel',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        inputValidator: (value) => {
          // Title is optional, so no validation needed
          return null;
        }
      });

      if (title !== undefined) { // User clicked Save (even with empty title)
        const businessParamsWithLocation = {
          ...businessParams,
          location: selectedLocation
        };

        // Save analysis data to blockchain
        const result = await saveAnalysisResult(
          analysisResults,
          businessParamsWithLocation,
          title || `Analysis ${new Date().toLocaleDateString()}`,
          'Manually saved analysis with complete profitability calculations'
        );

        if (result.success) {
          // Automatically generate and save report file
          await generateAnalysisReport(title || `Analysis ${new Date().toLocaleDateString()}`);
          
          await Swal.fire({
            icon: 'success',
            title: 'Saved to Blockchain!',
            html: `
              <p>Your analysis has been permanently saved to the ICP blockchain.</p>
              <p><strong>📄 Report file automatically generated and saved!</strong></p>
              <br>
              <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 8px; margin: 8px 0;">
                <strong>📊 Saved Data:</strong><br>
                • Daily Revenue: ${formatCurrency(Number(analysisResults.metrics?.dailyRevenue || 0), businessParams.currency)}<br>
                • Monthly Revenue: ${formatCurrency(Number(analysisResults.metrics?.monthlyRevenue || 0), businessParams.currency)}<br>
                • Daily Customers: ${Number(analysisResults.metrics?.tppd || 0)}<br>
                • Location: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}
              </div>
            `,
            confirmButtonText: 'Great!',
            background: '#1f2937',
            color: '#ffffff',
            confirmButtonColor: '#10b981'
          });
        }
      }
    } catch (error) {
      console.error('Manual save failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        html: `
          <p>Failed to save analysis to blockchain.</p>
          <br>
          <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 8px; margin: 8px 0;">
            <strong>Error:</strong> ${error.message}
          </div>
          <p><small>Your analysis is still available in this session. Try saving again or check your connection.</small></p>
        `,
        confirmButtonText: 'OK',
        background: '#1f2937',
        color: '#ffffff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">
            </h1>
            <p className="text-muted-foreground">
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-140px)]">
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


              <button
                onClick={() => setShowFileManager(!showFileManager)}
                className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center space-x-2 transition-colors text-xs sm:text-sm text-white"
                title="Toggle File Management"
              >
                <File className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Files</span>
                <span className="sm:hidden">Files</span>
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleManualSave}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors text-white"
                  title="Save to ICP Blockchain"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save to Blockchain</span>
                  <span className="sm:hidden">Save</span>
                </button>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-1 hover:bg-zinc-900 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <Users className="h-6 w-6 mx-auto mb-1 text-blue-400" />
                <div className="text-xl font-bold text-white">{analysisResults.metrics?.tppd ? Number(analysisResults.metrics.tppd) : 'N/A'}</div>
                <div className="text-xs text-gray-400">Customers/Day</div>
              </div>

              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-1 text-green-400" />
                <div className="text-xl font-bold text-white">
                  {analysisResults.metrics?.dailyRevenue ? formatCurrency(Number(analysisResults.metrics.dailyRevenue), businessParams.currency) : 'N/A'}
                </div>
                <div className="text-xs text-gray-400">Daily Revenue</div>
              </div>

              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-400" />
                <div className="text-xl font-bold text-white">
                  {analysisResults.metrics?.monthlyRevenue ? formatCurrency(Number(analysisResults.metrics.monthlyRevenue), businessParams.currency) : 'N/A'}
                </div>
                <div className="text-xs text-gray-400">Monthly Revenue</div>
              </div>

              <div className="bg-zinc-900/80 p-3 rounded-lg text-center">
                <Calculator className="h-6 w-6 mx-auto mb-1 text-yellow-400" />
                <div className="text-xl font-bold text-white">
                  {analysisResults.metrics?.monthlyRevenue ?
                    Math.min(10, Math.max(1, Math.round((Number(analysisResults.metrics.monthlyRevenue) / 1000000) * 2))) : 'N/A'}/10
                </div>
                <div className="text-xs text-gray-400">Profitability Score</div>
              </div>
            </div>

            {/* Detailed Kenny Chart Parameters */}
            <div className="bg-zinc-900/50 p-3 rounded-lg mb-3">
              <h4 className="font-semibold text-blue-400 mb-2 text-sm flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                Kenny Chart's Calculation Details
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">CGLP (Population)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.cglp ? Number(analysisResults.metrics.cglp) : 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">Residential Pop</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.pops ? Number(analysisResults.metrics.pops) : 'N/A'}</div>
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
                  <div className="text-white font-semibold">{analysisResults.metrics?.apt ? Number(analysisResults.metrics.apt) : 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">VCDT (Visitors)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.vcdt ? Number(analysisResults.metrics.vcdt) : 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">Area (km²)</div>
                  <div className="text-white font-semibold">{analysisResults.locationData?.areaSquareKm?.toFixed(6) || 'N/A'}</div>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded">
                  <div className="text-gray-400">Road Area (m²)</div>
                  <div className="text-white font-semibold">{analysisResults.metrics?.roadAreaSqm ? Number(analysisResults.metrics.roadAreaSqm) : 'N/A'}</div>
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


        {/* File Management Modal */}
        {showFileManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-bold text-card-foreground flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-400" />
                  Generated Reports
                </h2>
                <button
                  onClick={() => setShowFileManager(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                           </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {/* Info Section */}
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-400" />
                    Automatic Report Generation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Analysis reports are automatically generated and saved to blockchain storage when you click "Save to Blockchain" after completing an analysis.
                  </p>
                </div>

                {/* File Transfer Progress */}
                {fileTransferProgress && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-card-foreground">
                        {fileTransferProgress.mode} {fileTransferProgress.fileName}
                      </span>
                      <span className="text-sm text-muted-foreground">{fileTransferProgress.progress}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileTransferProgress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                      <span className="text-sm text-destructive">{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Files List */}
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3 flex items-center">
                    <FolderOpen className="h-4 w-4 mr-2 text-green-400" />
                    Your Files ({files.length})
                  </h3>
                  
                  {files.length > 0 ? (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-card-foreground truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB • {file.fileType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {file.fileType === 'application/pdf' && (
                              <button
                                onClick={() => handleFileDownload(file.name)}
                                className="p-2 hover:bg-background rounded-lg text-green-600 hover:text-green-500 transition-colors"
                                title="Export PDF"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleFileDelete(file.name)}
                              className="p-2 hover:bg-background rounded-lg text-destructive hover:text-destructive/80 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <File className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No files uploaded yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload your first file to get started
                      </p>
                    </div>
                  )}
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