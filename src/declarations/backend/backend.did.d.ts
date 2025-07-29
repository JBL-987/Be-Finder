import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AreaDistribution {
  'road' : number,
  'residential' : number,
  'openSpace' : number,
}
export interface BusinessAnalysisResult {
  'id' : string,
  'title' : [] | [string],
  'businessParameters' : BusinessParameters,
  'notes' : [] | [string],
  'timestamp' : bigint,
  'areaDistribution' : AreaDistribution,
  'locationData' : LocationData,
  'businessMetrics' : BusinessMetrics,
}
export interface BusinessMetrics {
  'apc' : number,
  'apt' : bigint,
  'pdr' : number,
  'cglp' : bigint,
  'pops' : bigint,
  'yearlyRevenue' : bigint,
  'tppd' : bigint,
  'vcdt' : bigint,
  'dailyRevenue' : bigint,
  'roadAreaSqm' : bigint,
  'monthlyRevenue' : bigint,
}
export interface BusinessParameters {
  'buildingWidth' : number,
  'currency' : string,
  'productPrice' : number,
  'operatingHours' : number,
}
export interface LocationData {
  'lat' : number,
  'lng' : number,
  'populationDensityPerSqKm' : bigint,
  'address' : [] | [string],
  'areaSquareKm' : number,
}
export interface _SERVICE {
  'analysisResultExists' : ActorMethod<[string], boolean>,
  'checkFileExists' : ActorMethod<[string], boolean>,
  'deleteAnalysisResult' : ActorMethod<[string], boolean>,
  'deleteFile' : ActorMethod<[string], boolean>,
  'getAnalysisResult' : ActorMethod<[string], [] | [BusinessAnalysisResult]>,
  'getAnalysisResults' : ActorMethod<[], Array<BusinessAnalysisResult>>,
  'getAnalysisResultsCount' : ActorMethod<[], bigint>,
  'getAnalysisResultsPaginated' : ActorMethod<
    [bigint, bigint],
    {
      'total' : bigint,
      'hasMore' : boolean,
      'results' : Array<BusinessAnalysisResult>,
    }
  >,
  'getFileChunk' : ActorMethod<[string, bigint], [] | [Uint8Array | number[]]>,
  'getFileType' : ActorMethod<[string], [] | [string]>,
  'getFiles' : ActorMethod<
    [],
    Array<{ 'name' : string, 'size' : bigint, 'fileType' : string }>
  >,
  'getTotalChunks' : ActorMethod<[string], bigint>,
  'saveAnalysisResult' : ActorMethod<
    [
      string,
      LocationData,
      AreaDistribution,
      BusinessMetrics,
      BusinessParameters,
      [] | [string],
      [] | [string],
    ],
    boolean
  >,
  'updateAnalysisResult' : ActorMethod<
    [
      string,
      LocationData,
      AreaDistribution,
      BusinessMetrics,
      BusinessParameters,
      [] | [string],
      [] | [string],
    ],
    boolean
  >,
  'uploadFileChunk' : ActorMethod<
    [string, Uint8Array | number[], bigint, string],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
