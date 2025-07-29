//ini file backend motoko aku 
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import HashMap "mo:map/Map";
import { phash; thash } "mo:map/Map";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Float "mo:base/Float";

persistent actor Filevault {

  // Define a data type for a file's chunks.
  type FileChunk = {
    chunk : Blob;
    index : Nat;
  };

  // Define a data type for a file's data.
  type File = {
    name : Text;
    chunks : [FileChunk];
    totalSize : Nat;
    fileType : Text;
  };

  // Define data types for business analysis results
  type LocationData = {
    lat : Float;
    lng : Float;
    address : ?Text;
    areaSquareKm : Float;
    populationDensityPerSqKm : Nat;
  };

  type AreaDistribution = {
    residential : Float;
    road : Float;
    openSpace : Float;
  };

  type BusinessMetrics = {
    cglp : Nat;
    pops : Nat;
    roadAreaSqm : Nat;
    pdr : Float;
    apc : Float;
    apt : Nat;
    vcdt : Nat;
    tppd : Nat;
    dailyRevenue : Nat;
    monthlyRevenue : Nat;
    yearlyRevenue : Nat;
  };

  type BusinessParameters = {
    buildingWidth : Float;
    operatingHours : Float;
    productPrice : Float;
    currency : Text;
  };

  type BusinessAnalysisResult = {
    id : Text;
    timestamp : Int;
    locationData : LocationData;
    areaDistribution : AreaDistribution;
    businessMetrics : BusinessMetrics;
    businessParameters : BusinessParameters;
    title : ?Text;
    notes : ?Text;
  };

  // Define a data type for storing files associated with a user principal.
  type UserFiles = HashMap.Map<Text, File>;

  // Define a data type for storing business analysis results associated with a user principal.
  type UserAnalysisResults = HashMap.Map<Text, BusinessAnalysisResult>;

  // HashMap to store the user data
  private var files = HashMap.new<Principal, UserFiles>();

  // HashMap to store business analysis results
  private var analysisResults = HashMap.new<Principal, UserAnalysisResults>();

  // Return files associated with a user's principal.
  private func getUserFiles(user : Principal) : UserFiles {
    switch (HashMap.get(files, phash, user)) {
      case null {
        let newFileMap = HashMap.new<Text, File>();
        let _ = HashMap.put(files, phash, user, newFileMap);
        newFileMap;
      };
      case (?existingFiles) existingFiles;
    };
  };

  // Return analysis results associated with a user's principal.
  private func getUserAnalysisResults(user : Principal) : UserAnalysisResults {
    switch (HashMap.get(analysisResults, phash, user)) {
      case null {
        let newAnalysisMap = HashMap.new<Text, BusinessAnalysisResult>();
        let _ = HashMap.put(analysisResults, phash, user, newAnalysisMap);
        newAnalysisMap;
      };
      case (?existingResults) existingResults;
    };
  };

  // Check if a file name already exists for the user.
  public shared (msg) func checkFileExists(name : Text) : async Bool {
    Option.isSome(HashMap.get(getUserFiles(msg.caller), thash, name));
  };

  // Upload a file in chunks.
  public shared (msg) func uploadFileChunk(name : Text, chunk : Blob, index : Nat, fileType : Text) : async () {
    let userFiles = getUserFiles(msg.caller);
    let fileChunk = { chunk = chunk; index = index };

    switch (HashMap.get(userFiles, thash, name)) {
      case null {
        let _ = HashMap.put(userFiles, thash, name, { name = name; chunks = [fileChunk]; totalSize = chunk.size(); fileType = fileType });
      };
      case (?existingFile) {
        let updatedChunks = Array.append(existingFile.chunks, [fileChunk]);
        let _ = HashMap.put(
          userFiles,
          thash,
          name,
          {
            name = name;
            chunks = updatedChunks;
            totalSize = existingFile.totalSize + chunk.size();
            fileType = fileType;
          }
        );
      };
    };
  };

  // Return list of files for a user.
  public shared (msg) func getFiles() : async [{ name : Text; size : Nat; fileType : Text }] {
    Iter.toArray(
      Iter.map(
        HashMap.vals(getUserFiles(msg.caller)),
        func(file : File) : { name : Text; size : Nat; fileType : Text } {
          {
            name = file.name;
            size = file.totalSize;
            fileType = file.fileType;
          };
        }
      )
    );
  };

  // Return total chunks for a file
  public shared (msg) func getTotalChunks(name : Text) : async Nat {
    switch (HashMap.get(getUserFiles(msg.caller), thash, name)) {
      case null 0;
      case (?file) file.chunks.size();
    };
  };

  // Return specific chunk for a file.
  public shared (msg) func getFileChunk(name : Text, index : Nat) : async ?Blob {
    switch (HashMap.get(getUserFiles(msg.caller), thash, name)) {
      case null null;
      case (?file) {
        switch (Array.find(file.chunks, func(chunk : FileChunk) : Bool { chunk.index == index })) {
          case null null;
          case (?foundChunk) ?foundChunk.chunk;
        };
      };
    };
  };

  // Get file's type.
  public shared (msg) func getFileType(name : Text) : async ?Text {
    switch (HashMap.get(getUserFiles(msg.caller), thash, name)) {
      case null null;
      case (?file) ?file.fileType;
    };
  };

  // Delete a file.
  public shared (msg) func deleteFile(name : Text) : async Bool {
    Option.isSome(HashMap.remove(getUserFiles(msg.caller), thash, name));
  };

  // ===== BUSINESS ANALYSIS FUNCTIONS =====

  // Save a business analysis result
  public shared (msg) func saveAnalysisResult(
    id : Text,
    locationData : LocationData,
    areaDistribution : AreaDistribution,
    businessMetrics : BusinessMetrics,
    businessParameters : BusinessParameters,
    title : ?Text,
    notes : ?Text
  ) : async Bool {
    let userResults = getUserAnalysisResults(msg.caller);
    let analysisResult : BusinessAnalysisResult = {
      id = id;
      timestamp = Time.now();
      locationData = locationData;
      areaDistribution = areaDistribution;
      businessMetrics = businessMetrics;
      businessParameters = businessParameters;
      title = title;
      notes = notes;
    };
    
    let _ = HashMap.put(userResults, thash, id, analysisResult);
    true;
  };

  // Get all analysis results for a user
  public shared (msg) func getAnalysisResults() : async [BusinessAnalysisResult] {
    let userResults = getUserAnalysisResults(msg.caller);
    Iter.toArray(HashMap.vals(userResults));
  };

  // Get a specific analysis result by ID
  public shared (msg) func getAnalysisResult(id : Text) : async ?BusinessAnalysisResult {
    let userResults = getUserAnalysisResults(msg.caller);
    HashMap.get(userResults, thash, id);
  };

  // Update an existing analysis result
  public shared (msg) func updateAnalysisResult(
    id : Text,
    locationData : LocationData,
    areaDistribution : AreaDistribution,
    businessMetrics : BusinessMetrics,
    businessParameters : BusinessParameters,
    title : ?Text,
    notes : ?Text
  ) : async Bool {
    let userResults = getUserAnalysisResults(msg.caller);
    switch (HashMap.get(userResults, thash, id)) {
      case null false; // Analysis result doesn't exist
      case (?_existingResult) {
        let updatedResult : BusinessAnalysisResult = {
          id = id;
          timestamp = Time.now(); // Update timestamp
          locationData = locationData;
          areaDistribution = areaDistribution;
          businessMetrics = businessMetrics;
          businessParameters = businessParameters;
          title = title;
          notes = notes;
        };
        let _ = HashMap.put(userResults, thash, id, updatedResult);
        true;
      };
    };
  };

  // Delete an analysis result
  public shared (msg) func deleteAnalysisResult(id : Text) : async Bool {
    let userResults = getUserAnalysisResults(msg.caller);
    Option.isSome(HashMap.remove(userResults, thash, id));
  };

  // Check if an analysis result exists
  public shared (msg) func analysisResultExists(id : Text) : async Bool {
    let userResults = getUserAnalysisResults(msg.caller);
    Option.isSome(HashMap.get(userResults, thash, id));
  };

  // Get analysis results count for a user
  public shared (msg) func getAnalysisResultsCount() : async Nat {
    let userResults = getUserAnalysisResults(msg.caller);
    HashMap.size(userResults);
  };

  // Get analysis results with pagination
  public shared (msg) func getAnalysisResultsPaginated(offset : Nat, limit : Nat) : async {
    results : [BusinessAnalysisResult];
    total : Nat;
    hasMore : Bool;
  } {
    let userResults = getUserAnalysisResults(msg.caller);
    let allResults = Iter.toArray(HashMap.vals(userResults));
    let total = allResults.size();
    
    // Sort by timestamp (newest first)
    let sortedResults = Array.sort(allResults, func(a : BusinessAnalysisResult, b : BusinessAnalysisResult) : { #less; #equal; #greater } {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    });
    
    let startIndex = offset;
    let endIndex = Nat.min(offset + limit, total);
    
    if (startIndex >= total) {
      return {
        results = [];
        total = total;
        hasMore = false;
      };
    };
    
    let paginatedResults = Array.tabulate<BusinessAnalysisResult>(endIndex - startIndex, func(i) {
      sortedResults[startIndex + i];
    });
    
    {
      results = paginatedResults;
      total = total;
      hasMore = endIndex < total;
    };
  };
};
