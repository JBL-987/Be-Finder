import React, { useState } from 'react';
import { 
  Calculator, 
  Building, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Camera,
  Loader
} from 'lucide-react';

const BusinessAnalysisForm = ({ 
  onAnalyze, 
  isAnalyzing, 
  selectedLocation,
  analysisResults 
}) => {
  const [formData, setFormData] = useState({
    buildingWidth: 3.8,
    dailyOperatingHours: 12,
    visitorRate: 0.1,
    purchaseRate: 90,
    productPrice: 50000,
    populationDensityPerSqKm: 16000
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleAnalyze = () => {
    if (!selectedLocation) {
      alert('Please select a location on the map first');
      return;
    }
    onAnalyze(formData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-dark-surface rounded-xl border border-dark-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center text-white">
          <Calculator className="w-5 h-5 mr-2 text-blue-400" />
          Business Profitability Analysis
        </h3>
        {selectedLocation && (
          <div className="flex items-center text-sm text-green-400">
            <MapPin className="w-4 h-4 mr-1" />
            Location Selected
          </div>
        )}
      </div>

      {/* Location Info */}
      {selectedLocation && (
        <div className="mb-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
          <h4 className="font-medium text-white mb-2">Selected Location</h4>
          <p className="text-sm text-dark-text-secondary">
            {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
          </p>
        </div>
      )}

      {/* Basic Parameters */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-white flex items-center">
          <Building className="w-4 h-4 mr-2 text-purple-400" />
          Business Parameters
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Building Width (meters)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.buildingWidth}
              onChange={(e) => handleInputChange('buildingWidth', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="3.8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Daily Operating Hours
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.dailyOperatingHours}
              onChange={(e) => handleInputChange('dailyOperatingHours', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Average Product Price (IDR)
            </label>
            <input
              type="number"
              value={formData.productPrice}
              onChange={(e) => handleInputChange('productPrice', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Population Density (per km²)
            </label>
            <input
              type="number"
              value={formData.populationDensityPerSqKm}
              onChange={(e) => handleInputChange('populationDensityPerSqKm', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="16000"
            />
          </div>
        </div>
      </div>

      {/* Advanced Parameters */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Parameters
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Visitor Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.visitorRate}
                onChange={(e) => handleInputChange('visitorRate', e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="0.1"
              />
              <p className="text-xs text-dark-text-secondary mt-1">
                Percentage of people who will visit your store
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Purchase Rate (%)
              </label>
              <input
                type="number"
                step="1"
                value={formData.purchaseRate}
                onChange={(e) => handleInputChange('purchaseRate', e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="90"
              />
              <p className="text-xs text-dark-text-secondary mt-1">
                Percentage of visitors who will make a purchase
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !selectedLocation}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
          isAnalyzing || !selectedLocation
            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Analyzing Location...
          </>
        ) : (
          <>
            <Camera className="w-5 h-5 mr-2" />
            Analyze Business Potential
          </>
        )}
      </button>

      {/* Quick Results Preview */}
      {analysisResults && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-800/30">
          <h4 className="font-medium text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
            Quick Results
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-dark-text-secondary">Daily Customers:</span>
              <div className="font-semibold text-white">{analysisResults.metrics?.tppd || 0}</div>
            </div>
            <div>
              <span className="text-dark-text-secondary">Daily Revenue:</span>
              <div className="font-semibold text-green-400">
                {formatCurrency(analysisResults.metrics?.dailyRevenue || 0)}
              </div>
            </div>
            <div>
              <span className="text-dark-text-secondary">Monthly Revenue:</span>
              <div className="font-semibold text-blue-400">
                {formatCurrency(analysisResults.metrics?.monthlyRevenue || 0)}
              </div>
            </div>
            <div>
              <span className="text-dark-text-secondary">Yearly Revenue:</span>
              <div className="font-semibold text-purple-400">
                {formatCurrency(analysisResults.metrics?.yearlyRevenue || 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessAnalysisForm;
