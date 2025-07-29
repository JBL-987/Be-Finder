// Analysis Storage Service for ICP Backend - FIXED VERSION
let actor = null;

// Set the actor instance (called from main.jsx)
export const setActor = (actorInstance) => {
  actor = actorInstance;
};

// Get the current actor instance
export const getActor = () => {
  if (!actor) {
    throw new Error('Actor not initialized. Make sure to call setActor() first.');
  }
  return actor;
};

// FIXED: More robust BigInt conversion with validation
const safeNumberToBigInt = (value) => {
  try {
    if (typeof value === 'bigint') {
      return value;
    }
    
    // Handle null, undefined, empty string
    if (value === null || value === undefined || value === '') {
      return BigInt(0);
    }
    
    if (typeof value === 'string') {
      // Remove any non-numeric characters except decimal point
      const cleanValue = value.replace(/[^\d.-]/g, '');
      if (cleanValue === '' || cleanValue === '-') {
        return BigInt(0);
      }
      return BigInt(Math.round(Number(cleanValue)));
    }
    
    // Convert number to BigInt
    const numValue = Number(value);
    if (isNaN(numValue) || !isFinite(numValue)) {
      return BigInt(0);
    }
    
    return BigInt(Math.round(numValue));
  } catch (error) {
    console.warn('Error converting to BigInt:', value, error);
    return BigInt(0);
  }
};

// FIXED: More robust number conversion with validation
const safeToNumber = (value) => {
  try {
    if (typeof value === 'bigint') {
      // Check if BigInt is within safe integer range
      if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
        console.warn('BigInt value exceeds safe integer range:', value);
      }
      return Number(value);
    }
    
    if (value === null || value === undefined) {
      return 0;
    }
    
    if (typeof value === 'string') {
      const numValue = Number(value);
      return isNaN(numValue) ? 0 : numValue;
    }
    
    const numValue = Number(value);
    return isNaN(numValue) || !isFinite(numValue) ? 0 : numValue;
  } catch (error) {
    console.warn('Error converting to number:', value, error);
    return 0;
  }
};

// FIXED: Better validation for location data
const validateLocationData = (businessParams) => {
  if (!businessParams || !businessParams.location) {
    throw new Error('Business parameters or location is missing');
  }
  
  const { location } = businessParams;
  if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    throw new Error('Invalid location coordinates');
  }
  
  if (isNaN(location.lat) || isNaN(location.lng)) {
    throw new Error('Location coordinates are NaN');
  }
  
  return true;
};

// Auto-save analysis result (called after analysis completion)
export const autoSaveAnalysisResult = async (analysisResults, businessParams) => {
  try {
    const currentActor = getActor();
    
    // Validate input data
    validateLocationData(businessParams);
    
    if (!analysisResults || !analysisResults.metrics) {
      throw new Error('Analysis results or metrics are missing');
    }
    
    // Generate unique ID for this analysis
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // FIXED: Prepare location data with proper validation
    const locationData = {
      lat: safeToNumber(businessParams.location.lat),
      lng: safeToNumber(businessParams.location.lng),
      address: [],
      areaSquareKm: safeToNumber(analysisResults.locationData?.areaSquareKm || 0.056),
      populationDensityPerSqKm: 16000
    };

    // FIXED: Prepare area distribution with validation
    const areaDistribution = {
      residential: safeToNumber(analysisResults.areaDistribution?.residential || 0),
      road: safeToNumber(analysisResults.areaDistribution?.road || 0),
      openSpace: safeToNumber(analysisResults.areaDistribution?.openSpace || 0)
    };

    // FIXED: Prepare business metrics with proper BigInt conversions
    const businessMetrics = {
      cglp: Math.round(safeToNumber(analysisResults.metrics?.cglp || 0)),
      pops: Math.round(safeToNumber(analysisResults.metrics?.pops || 0)),
      roadAreaSqm: Math.round(safeToNumber(analysisResults.metrics?.roadAreaSqm || 0)),
      pdr: safeToNumber(analysisResults.metrics?.pdr || 0),
      apc: safeToNumber(analysisResults.metrics?.apc || 0),
      apt: Math.round(safeToNumber(analysisResults.metrics?.apt || 0)),
      vcdt: Math.round(safeToNumber(analysisResults.metrics?.vcdt || 0)),
      tppd: Math.round(safeToNumber(analysisResults.metrics?.tppd || 0)),
      dailyRevenue: Math.round(safeToNumber(analysisResults.metrics?.dailyRevenue || 0)),
      monthlyRevenue: Math.round(safeToNumber(analysisResults.metrics?.monthlyRevenue || 0)),
      yearlyRevenue: Math.round(safeToNumber((analysisResults.metrics?.monthlyRevenue || 0) * 12))
    };

    // FIXED: Prepare business parameters with validation
    const businessParameters = {
      buildingWidth: safeToNumber(businessParams.buildingWidth),
      operatingHours: safeToNumber(businessParams.operatingHours),
      productPrice: safeToNumber(businessParams.productPrice),
      currency: businessParams.currency || 'USD'
    };

    // FIXED: Call backend with proper parameters structure
    const result = await currentActor.saveAnalysisResult(
      analysisId,
      locationData,
      areaDistribution,
      businessMetrics,
      businessParameters,
      [`Auto-saved analysis ${new Date().toLocaleString()}`],
      [`Automatically saved after analysis completion`]
    );

    console.log('Auto-save result:', result);
    return { success: true, id: analysisId };
  } catch (error) {
    console.error('Auto-save failed:', error);
    throw new Error(`Auto-save failed: ${error.message}`);
  }
};

// Manual save analysis result (called from save button)
export const saveAnalysisResult = async (analysisResults, businessParams, title, notes) => {
  try {
    const currentActor = getActor();
    
    // Validate input data
    validateLocationData(businessParams);
    
    if (!analysisResults || !analysisResults.metrics) {
      throw new Error('Analysis results or metrics are missing');
    }
    
    // Generate unique ID for this analysis
    const analysisId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare data for Motoko backend with proper validation
    const locationData = {
      lat: safeToNumber(businessParams.location.lat),
      lng: safeToNumber(businessParams.location.lng),
      address: [],
      areaSquareKm: safeToNumber(analysisResults.locationData?.areaSquareKm || 0.056),
      populationDensityPerSqKm: 16000
    };

    const areaDistribution = {
      residential: safeToNumber(analysisResults.areaDistribution?.residential || 0),
      road: safeToNumber(analysisResults.areaDistribution?.road || 0),
      openSpace: safeToNumber(analysisResults.areaDistribution?.openSpace || 0)
    };

    const businessMetrics = {
      cglp: Math.round(safeToNumber(analysisResults.metrics?.cglp || 0)),
      pops: Math.round(safeToNumber(analysisResults.metrics?.pops || 0)),
      roadAreaSqm: Math.round(safeToNumber(analysisResults.metrics?.roadAreaSqm || 0)),
      pdr: safeToNumber(analysisResults.metrics?.pdr || 0),
      apc: safeToNumber(analysisResults.metrics?.apc || 0),
      apt: Math.round(safeToNumber(analysisResults.metrics?.apt || 0)),
      vcdt: Math.round(safeToNumber(analysisResults.metrics?.vcdt || 0)),
      tppd: Math.round(safeToNumber(analysisResults.metrics?.tppd || 0)),
      dailyRevenue: Math.round(safeToNumber(analysisResults.metrics?.dailyRevenue || 0)),
      monthlyRevenue: Math.round(safeToNumber(analysisResults.metrics?.monthlyRevenue || 0)),
      yearlyRevenue: Math.round(safeToNumber((analysisResults.metrics?.monthlyRevenue || 0) * 12))
    };

    const businessParameters = {
      buildingWidth: safeToNumber(businessParams.buildingWidth),
      operatingHours: safeToNumber(businessParams.operatingHours),
      productPrice: safeToNumber(businessParams.productPrice),
      currency: businessParams.currency || 'USD'
    };

    // FIXED: Call backend with proper parameter structure
    const result = await currentActor.saveAnalysisResult(
      analysisId,
      locationData,
      areaDistribution,
      businessMetrics,
      businessParameters,
      title ? [title] : [],
      notes ? [notes] : []
    );

    console.log('Manual save result:', result);
    return { success: true, id: analysisId };
  } catch (error) {
    console.error('Manual save failed:', error);
    throw new Error(`Manual save failed: ${error.message}`);
  }
};

// FIXED: Load all saved analysis results with proper error handling
export const loadAnalysisResults = async () => {
  try {
    const currentActor = getActor();
    const results = await currentActor.getAnalysisResults();
    
    // Convert BigInt values to numbers for frontend use
    return results.map(result => ({
      ...result,
      timestamp: safeToNumber(result.timestamp),
      businessMetrics: {
        ...result.businessMetrics,
        cglp: safeToNumber(result.businessMetrics.cglp),
        pops: safeToNumber(result.businessMetrics.pops),
        roadAreaSqm: safeToNumber(result.businessMetrics.roadAreaSqm),
        apt: safeToNumber(result.businessMetrics.apt),
        vcdt: safeToNumber(result.businessMetrics.vcdt),
        tppd: safeToNumber(result.businessMetrics.tppd),
        dailyRevenue: safeToNumber(result.businessMetrics.dailyRevenue),
        monthlyRevenue: safeToNumber(result.businessMetrics.monthlyRevenue),
        yearlyRevenue: safeToNumber(result.businessMetrics.yearlyRevenue)
      }
    }));
  } catch (error) {
    console.error('Load analysis results failed:', error);
    throw new Error(`Load analysis results failed: ${error.message}`);
  }
};

// FIXED: Load specific analysis result by ID with proper conversion
export const loadAnalysisResult = async (id) => {
  try {
    const currentActor = getActor();
    const result = await currentActor.getAnalysisResult(id);
    
    if (!result) {
      return null;
    }
    
    // Convert BigInt values to numbers for frontend use
    return {
      ...result,
      timestamp: safeToNumber(result.timestamp),
      businessMetrics: {
        ...result.businessMetrics,
        cglp: safeToNumber(result.businessMetrics.cglp),
        pops: safeToNumber(result.businessMetrics.pops),
        roadAreaSqm: safeToNumber(result.businessMetrics.roadAreaSqm),
        apt: safeToNumber(result.businessMetrics.apt),
        vcdt: safeToNumber(result.businessMetrics.vcdt),
        tppd: safeToNumber(result.businessMetrics.tppd),
        dailyRevenue: safeToNumber(result.businessMetrics.dailyRevenue),
        monthlyRevenue: safeToNumber(result.businessMetrics.monthlyRevenue),
        yearlyRevenue: safeToNumber(result.businessMetrics.yearlyRevenue)
      }
    };
  } catch (error) {
    console.error('Load analysis result failed:', error);
    throw new Error(`Load analysis result failed: ${error.message}`);
  }
};

// Delete analysis result
export const deleteAnalysisResult = async (id) => {
  try {
    const currentActor = getActor();
    const result = await currentActor.deleteAnalysisResult(id);
    return result;
  } catch (error) {
    console.error('Delete analysis result failed:', error);
    throw new Error(`Delete analysis result failed: ${error.message}`);
  }
};

// FIXED: Get analysis results with pagination and proper BigInt handling
export const getAnalysisResultsPaginated = async (offset = 0, limit = 10) => {
  try {
    const currentActor = getActor();
    const result = await currentActor.getAnalysisResultsPaginated(
      Number(offset),
      Number(limit)
    );
    
    // Convert the result with proper BigInt handling
    return {
      results: result.results.map(analysisResult => ({
        ...analysisResult,
        timestamp: safeToNumber(analysisResult.timestamp),
        businessMetrics: {
          ...analysisResult.businessMetrics,
          cglp: safeToNumber(analysisResult.businessMetrics.cglp),
          pops: safeToNumber(analysisResult.businessMetrics.pops),
          roadAreaSqm: safeToNumber(analysisResult.businessMetrics.roadAreaSqm),
          apt: safeToNumber(analysisResult.businessMetrics.apt),
          vcdt: safeToNumber(analysisResult.businessMetrics.vcdt),
          tppd: safeToNumber(analysisResult.businessMetrics.tppd),
          dailyRevenue: safeToNumber(analysisResult.businessMetrics.dailyRevenue),
          monthlyRevenue: safeToNumber(analysisResult.businessMetrics.monthlyRevenue),
          yearlyRevenue: safeToNumber(analysisResult.businessMetrics.yearlyRevenue)
        }
      })),
      total: safeToNumber(result.total),
      hasMore: Boolean(result.hasMore)
    };
  } catch (error) {
    console.error('Get paginated analysis results failed:', error);
    throw new Error(`Get paginated analysis results failed: ${error.message}`);
  }
};

// Get analysis result by ID
export const getAnalysisResult = async (id) => {
  try {
    const currentActor = getActor();
    const result = await currentActor.getAnalysisResult(id);
    
    if (!result) {
      return null;
    }
    
    // Convert BigInt values to numbers for frontend use
    return {
      ...result,
      timestamp: safeToNumber(result.timestamp),
      businessMetrics: {
        ...result.businessMetrics,
        cglp: safeToNumber(result.businessMetrics.cglp),
        pops: safeToNumber(result.businessMetrics.pops),
        roadAreaSqm: safeToNumber(result.businessMetrics.roadAreaSqm),
        apt: safeToNumber(result.businessMetrics.apt),
        vcdt: safeToNumber(result.businessMetrics.vcdt),
        tppd: safeToNumber(result.businessMetrics.tppd),
        dailyRevenue: safeToNumber(result.businessMetrics.dailyRevenue),
        monthlyRevenue: safeToNumber(result.businessMetrics.monthlyRevenue),
        yearlyRevenue: safeToNumber(result.businessMetrics.yearlyRevenue)
      }
    };
  } catch (error) {
    console.error('Get analysis result failed:', error);
    throw new Error(`Get analysis result failed: ${error.message}`);
  }
};