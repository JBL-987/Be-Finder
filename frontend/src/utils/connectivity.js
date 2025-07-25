/**
 * Utility functions for checking network connectivity and tile server availability
 */

/**
 * Test if a tile server is accessible
 * @param {string} url - Tile server URL template
 * @returns {Promise<boolean>} - True if accessible
 */
export async function testTileServer(url) {
  try {
    // Replace template variables with test values
    const testUrl = url
      .replace('{s}', 'a')
      .replace('{z}', '10')
      .replace('{x}', '512')
      .replace('{y}', '512')
      .replace('{r}', '');

    const response = await fetch(testUrl, {
      method: 'HEAD',
      mode: 'no-cors', // Avoid CORS issues
      cache: 'no-cache'
    });

    return true; // If we get here, the server is accessible
  } catch (error) {
    console.warn('Tile server test failed:', error);
    return false;
  }
}

/**
 * Test basic internet connectivity
 * @returns {Promise<boolean>} - True if online
 */
export async function testConnectivity() {
  try {
    // Test with a simple, fast endpoint
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    return true;
  } catch (error) {
    console.warn('Connectivity test failed:', error);
    return false;
  }
}

/**
 * Get the best available tile server
 * @param {Array} tileServers - Array of tile server configurations
 * @returns {Promise<Object>} - Best available tile server config
 */
export async function getBestTileServer(tileServers) {
  for (const server of tileServers) {
    const isAvailable = await testTileServer(server.url);
    if (isAvailable) {
      console.log('Using tile server:', server.url);
      return server;
    }
  }
  
  console.warn('No tile servers available, using offline mode');
  return {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y5ZjlmOSIvPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KICA8dGV4dCB4PSIxMjgiIHk9IjEyOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2Ij5PZmZsaW5lIE1vZGU8L3RleHQ+Cjwvc3ZnPg==',
    attribution: 'Offline Mode - Map tiles unavailable'
  };
}

export default {
  testTileServer,
  testConnectivity,
  getBestTileServer
};
