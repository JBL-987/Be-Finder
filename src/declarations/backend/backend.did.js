export const idlFactory = ({ IDL }) => {
  const BusinessParameters = IDL.Record({
    'buildingWidth' : IDL.Float64,
    'currency' : IDL.Text,
    'productPrice' : IDL.Float64,
    'operatingHours' : IDL.Float64,
  });
  const AreaDistribution = IDL.Record({
    'road' : IDL.Float64,
    'residential' : IDL.Float64,
    'openSpace' : IDL.Float64,
  });
  const LocationData = IDL.Record({
    'lat' : IDL.Float64,
    'lng' : IDL.Float64,
    'populationDensityPerSqKm' : IDL.Nat,
    'address' : IDL.Opt(IDL.Text),
    'areaSquareKm' : IDL.Float64,
  });
  const BusinessMetrics = IDL.Record({
    'apc' : IDL.Float64,
    'apt' : IDL.Nat,
    'pdr' : IDL.Float64,
    'cglp' : IDL.Nat,
    'pops' : IDL.Nat,
    'yearlyRevenue' : IDL.Nat,
    'tppd' : IDL.Nat,
    'vcdt' : IDL.Nat,
    'dailyRevenue' : IDL.Nat,
    'roadAreaSqm' : IDL.Nat,
    'monthlyRevenue' : IDL.Nat,
  });
  const BusinessAnalysisResult = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Opt(IDL.Text),
    'businessParameters' : BusinessParameters,
    'notes' : IDL.Opt(IDL.Text),
    'timestamp' : IDL.Int,
    'areaDistribution' : AreaDistribution,
    'locationData' : LocationData,
    'businessMetrics' : BusinessMetrics,
  });
  return IDL.Service({
    'analysisResultExists' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'checkFileExists' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'deleteAnalysisResult' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'deleteFile' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAnalysisResult' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(BusinessAnalysisResult)],
        [],
      ),
    'getAnalysisResults' : IDL.Func([], [IDL.Vec(BusinessAnalysisResult)], []),
    'getAnalysisResultsCount' : IDL.Func([], [IDL.Nat], []),
    'getAnalysisResultsPaginated' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'total' : IDL.Nat,
            'hasMore' : IDL.Bool,
            'results' : IDL.Vec(BusinessAnalysisResult),
          }),
        ],
        [],
      ),
    'getFileChunk' : IDL.Func(
        [IDL.Text, IDL.Nat],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [],
      ),
    'getFileType' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'getFiles' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'name' : IDL.Text,
              'size' : IDL.Nat,
              'fileType' : IDL.Text,
            })
          ),
        ],
        [],
      ),
    'getTotalChunks' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'saveAnalysisResult' : IDL.Func(
        [
          IDL.Text,
          LocationData,
          AreaDistribution,
          BusinessMetrics,
          BusinessParameters,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [IDL.Bool],
        [],
      ),
    'updateAnalysisResult' : IDL.Func(
        [
          IDL.Text,
          LocationData,
          AreaDistribution,
          BusinessMetrics,
          BusinessParameters,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [IDL.Bool],
        [],
      ),
    'uploadFileChunk' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Nat, IDL.Text],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
