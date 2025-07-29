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
import { CURRENCIES, formatCurrency } from '../services/currencies';

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
    currency: 'IDR',
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

  const formatCurrencyAmount = (amount) => {
    return formatCurrency(amount, formData.currency);
  };

  const getInputStep = (currencyCode) => {
    // For high-denomination currencies like IDR, VND, etc., use larger steps
    return ['IDR', 'VND', 'KRW', 'JPY', 'IRR', 'HUF', 'CLP', 'COP', 'PYG', 'UGX', 'TZS', 'KZT', 'UZS', 'MMK', 'KHR', 'LAK', 'LBP', 'RSD', 'ISK'].includes(currencyCode) ? '1000' : '0.01';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center text-card-foreground">
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
        <div className="mb-6 p-4 bg-background rounded-lg border border-border">
          <h4 className="font-medium text-card-foreground mb-2">Selected Location</h4>
          <p className="text-sm text-muted-foreground">
            {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
          </p>
        </div>
      )}

      {/* Basic Parameters */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-card-foreground flex items-center">
          <Building className="w-4 h-4 mr-2 text-purple-400" />
          Business Parameters
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Building Width (meters)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.buildingWidth}
              onChange={(e) => handleInputChange('buildingWidth', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="3.8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Daily Operating Hours
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.dailyOperatingHours}
              onChange={(e) => handleInputChange('dailyOperatingHours', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Currency & Product Price
            </label>
            <div className="flex space-x-2">
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value, productPrice: '' }))}
                className="w-24 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              >
                {Object.keys(CURRENCIES).map(code => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step={getInputStep(formData.currency)}
                value={formData.productPrice}
                onChange={(e) => handleInputChange('productPrice', e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder={CURRENCIES[formData.currency]?.placeholder || '0.00'}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {CURRENCIES[formData.currency]?.name} ({CURRENCIES[formData.currency]?.symbol})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Population Density (per km²)
            </label>
            <input
              type="number"
              value={formData.populationDensityPerSqKm}
              onChange={(e) => handleInputChange('populationDensityPerSqKm', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
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
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Visitor Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.visitorRate}
                onChange={(e) => handleInputChange('visitorRate', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Percentage of people who will visit your store
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Purchase Rate (%)
              </label>
              <input
                type="number"
                step="1"
                value={formData.purchaseRate}
                onChange={(e) => handleInputChange('purchaseRate', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="90"
              />
              <p className="text-xs text-muted-foreground mt-1">
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
            ? 'bg-muted cursor-not-allowed text-muted-foreground'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
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
          <h4 className="font-medium text-card-foreground mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
            Quick Results
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Daily Customers:</span>
              <div className="font-semibold text-card-foreground">{analysisResults.metrics?.tppd || 0}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Daily Revenue:</span>
              <div className="font-semibold text-green-400">
                {formatCurrencyAmount(analysisResults.metrics?.dailyRevenue || 0)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Monthly Revenue:</span>
              <div className="font-semibold text-blue-400">
                {formatCurrencyAmount(analysisResults.metrics?.monthlyRevenue || 0)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Yearly Revenue:</span>
              <div className="font-semibold text-purple-400">
                {formatCurrencyAmount(analysisResults.metrics?.yearlyRevenue || 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessAnalysisForm;
