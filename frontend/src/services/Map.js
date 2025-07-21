import L from 'leaflet';

// Fix for default markers in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map configuration object
export const MapConfig = {
  // Default center coordinates (Jakarta, Indonesia)
  defaultCenter: [-6.2088, 106.8456],
  defaultZoom: 13,
  minZoom: 5,
  maxZoom: 18,
  
  // Tile layer configuration
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },

  // Custom marker icons
  markerIcons: {
    default: new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }),
    
    business: new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiMzQjgyRjYiLz4KPHA...', // Blue business marker
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    }),

    selected: new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHA...', // Red selected marker
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    })
  }
};

// Map utility functions
export const MapUtils = {
  // Initialize map instance
  createMap: (containerId, options = {}) => {
    const config = { ...MapConfig, ...options };
    
    const map = L.map(containerId, {
      center: config.defaultCenter,
      zoom: config.defaultZoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      zoomControl: false // We'll add custom controls
    });

    // Add tile layer
    L.tileLayer(config.tileLayer.url, {
      attribution: config.tileLayer.attribution
    }).addTo(map);

    return map;
  },

  // Add marker with popup
  addMarker: (map, lat, lng, options = {}) => {
    const marker = L.marker([lat, lng], {
      icon: options.icon || MapConfig.markerIcons.default
    });

    if (options.popup) {
      marker.bindPopup(options.popup);
    }

    marker.addTo(map);
    return marker;
  },

  // Add radius circle
  addRadius: (map, lat, lng, radius, options = {}) => {
    const defaultOptions = {
      color: '#3B82F6',
      fillColor: '#3B82F6',
      fillOpacity: 0.1,
      weight: 2
    };

    const circle = L.circle([lat, lng], {
      radius: radius,
      ...defaultOptions,
      ...options
    });

    circle.addTo(map);
    return circle;
  },

  // Geocoding function using Nominatim API
  geocodeLocation: async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      return data.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        importance: item.importance,
        type: item.type,
        address: item.address
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  },

  // Reverse geocoding
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      return {
        display_name: data.display_name,
        address: data.address
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  },

  // Calculate distance between two points in kilometers
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Fit map to show all markers
  fitBounds: (map, locations) => {
    if (locations.length === 0) return;
    
    const group = new L.featureGroup(locations.map(loc => 
      L.marker([loc.lat, loc.lng])
    ));
    
    map.fitBounds(group.getBounds().pad(0.1));
  }
};

export default { MapConfig, MapUtils };