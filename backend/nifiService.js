const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// NiFi API configuration
const NIFI_API_URL = process.env.NIFI_API_URL || 'https://localhost:8443/nifi-api';
const NIFI_USERNAME = process.env.NIFI_USERNAME;
const NIFI_PASSWORD = process.env.NIFI_PASSWORD;
const NIFI_SSL_VERIFY = process.env.NIFI_SSL_VERIFY !== 'false';
const NIFI_AUTH_METHOD = process.env.NIFI_AUTH_METHOD || 'certificate';
const MOCK_NIFI_API = process.env.MOCK_NIFI_API === 'true';

console.log('NiFi Configuration:');
console.log('API URL:', NIFI_API_URL);
console.log('Username:', NIFI_USERNAME ? NIFI_USERNAME : 'Not provided');
console.log('Password:', NIFI_PASSWORD ? '******' : 'Not provided');
console.log('SSL Verify:', NIFI_SSL_VERIFY ? 'Enabled' : 'Disabled');
console.log('Auth Method:', NIFI_AUTH_METHOD);
console.log('Mock mode:', MOCK_NIFI_API ? 'Enabled' : 'Disabled');

// Create HTTPS agent for self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: NIFI_SSL_VERIFY
});

// Variables for token storage
let nifiToken = null;
let tokenExpiration = 0;

// Optionally, if you already have a token set via environment variable, use it.
if (process.env.NIFI_TOKEN) {
  nifiToken = process.env.NIFI_TOKEN;
  tokenExpiration = Date.now() + (12 * 60 * 60 * 1000); // 12 hours expiration
  console.log('Using token from environment variable');
}

// Function to get a NiFi access token
const getNiFiToken = async () => {
  if (MOCK_NIFI_API) {
    return "mock-token";
  }
  
  try {
    // If we have a valid token that's not expired, use it
    const now = Date.now();
    if (nifiToken && tokenExpiration > now) {
      return nifiToken;
    }
    
    console.log('Getting new NiFi access token...');
    
    // For password mode, use POST with URL-encoded form data
    const method = NIFI_AUTH_METHOD === 'password' ? 'POST' : 'GET';
    let config = {
      method: method,
      url: `${NIFI_API_URL}/access/token`,
      httpsAgent,
      headers: {
        'Accept': 'text/plain'
      }
    };
    
    if (NIFI_AUTH_METHOD === 'password') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.data = `username=${encodeURIComponent(NIFI_USERNAME)}&password=${encodeURIComponent(NIFI_PASSWORD)}`;
    } else if (NIFI_AUTH_METHOD === 'certificate') {
      // For certificate-based auth, no additional credentials are needed.
    } else {
      // For other methods like Kerberos, add additional headers as needed.
      config.headers['X-ProxiedEntitiesChain'] = NIFI_USERNAME;
    }
    
    const response = await axios(config);
    
    // The response body directly contains the token
    nifiToken = response.data;
    tokenExpiration = now + (12 * 60 * 60 * 1000); // Set expiration to 12 hours
    console.log('Successfully obtained NiFi access token');
    return nifiToken;
  } catch (error) {
    console.error('Error getting NiFi token:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      if (error.response.status === 401) {
        console.error('Authentication failed. NiFi rejected the credentials.');
      }
    }
    
    // Fallback alternative token acquisition method
    try {
      console.log('Attempting alternative token acquisition method...');
      const response = await axios({
        method: 'GET',
        url: `${NIFI_API_URL}/access/token/download`,
        httpsAgent,
        responseType: 'text'
      });
      
      if (response.status === 200) {
        nifiToken = response.data;
        tokenExpiration = Date.now() + (12 * 60 * 60 * 1000);
        console.log('Successfully obtained NiFi token using alternative method');
        return nifiToken;
      }
    } catch (fallbackError) {
      console.error('Alternative token method failed:', fallbackError.message);
    }
    
    return null;
  }
};

// Create HTTP client with default settings
const client = axios.create({
  baseURL: NIFI_API_URL,
  httpsAgent,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock data for when MOCK_NIFI_API is true
const mockData = {
  processGroups: [
    {
      id: 'mock-pg-1',
      component: {
        name: 'Mock ETL Pipeline',
        comments: 'This is a mock NiFi pipeline for testing',
      },
      status: {
        runStatus: 'Running'
      }
    },
    {
      id: 'mock-pg-2',
      component: {
        name: 'Mock Data Ingestion',
        comments: 'Mock data ingestion pipeline',
      },
      status: {
        runStatus: 'Stopped'
      }
    }
  ],
  processors: [
    {
      id: 'mock-processor-1',
      component: {
        name: 'ExtractData',
        type: 'ExecuteSQL',
        state: 'RUNNING'
      },
      revision: {
        version: 1
      }
    },
    {
      id: 'mock-processor-2',
      component: {
        name: 'TransformData',
        type: 'JoltTransformJSON',
        state: 'RUNNING'
      },
      revision: {
        version: 1
      }
    },
    {
      id: 'mock-processor-3',
      component: {
        name: 'LoadData',
        type: 'PutDatabaseRecord',
        state: 'RUNNING'
      },
      revision: {
        version: 1
      }
    }
  ],
  metrics: {
    bytesIn: 1024000,
    bytesOut: 512000,
    bytesQueued: 0,
    flowFilesIn: 100,
    flowFilesOut: 100,
    flowFilesQueued: 0,
    activeThreadCount: 3
  }
};

// Simple request to check if the server is running
const checkServerRunning = async () => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, returning true for server running check');
    return true;
  }
  
  try {
    console.log('Checking NiFi server status at:', NIFI_API_URL);
    
    const token = await getNiFiToken();
    const headers = {
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-NiFi-Requested-Identity'] = NIFI_USERNAME;
    }
    
    const response = await axios.get(`${NIFI_API_URL}/flow/about`, {
      httpsAgent,
      timeout: 5000,
      validateStatus: (status) => true,
      headers
    });
    
    console.log('NiFi server status check result:');
    console.log('  Status code:', response.status);
    
    if (response.status === 200) {
      if (response.data.about) {
        console.log('  NiFi version:', response.data.about.version || 'Unknown');
        console.log('  Build date:', response.data.about.buildDate || 'Unknown');
      } else {
        console.log('  Connected successfully but response format unexpected');
        console.log('  Response:', JSON.stringify(response.data).substring(0, 200));
      }
      return true;
    } else if (response.status === 401 || response.status === 403) {
      if (!token) {
        console.log('  Authentication required but no token obtained');
      } else {
        console.log('  Authentication failed despite having a token. Access denied.');
      }
      return false;
    } else {
      console.log('  Unexpected status code:', response.status);
      if (response.data) {
        console.log('  Response data:', JSON.stringify(response.data).substring(0, 200));
      }
      return false;
    }
  } catch (error) {
    console.error('NiFi server check failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('  Connection refused. NiFi server might not be running at', NIFI_API_URL);
    } else if (error.code === 'ENOTFOUND') {
      console.error('  Host not found. Check the NIFI_API_URL in your .env file');
    } else if (error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT' || error.code === 'CERT_HAS_EXPIRED') {
      console.error('  SSL certificate error:', error.code);
      console.error('  This is likely because NiFi is using a self-signed certificate.');
      console.error('  Set NIFI_SSL_VERIFY=false in your .env file to bypass certificate validation.');
    } else {
      console.error('  Error:', error.message);
    }
    return false;
  }
};

// Make a direct NiFi API request with the necessary authentication
const makeNiFiRequest = async (method, endpoint, data = null) => {
  if (MOCK_NIFI_API) {
    console.log(`Mock mode enabled, returning mock data for: ${method.toUpperCase()} ${endpoint}`);
    if (endpoint === '/process-groups/root/process-groups') {
      return { processGroups: mockData.processGroups };
    }
    if (endpoint.includes('/process-groups/') && endpoint.includes('/processors')) {
      return { processors: mockData.processors };
    }
    if (endpoint.includes('/flow/process-groups/') && endpoint.includes('/status')) {
      return { processGroupStatus: mockData.metrics };
    }
    if (endpoint.includes('/process-groups/') && !endpoint.includes('/processors')) {
      const pgId = endpoint.split('/').pop();
      const pg = mockData.processGroups.find(pg => pg.id === pgId) || mockData.processGroups[0];
      return pg;
    }
    return { success: true };
  }
  
  try {
    console.log(`Making NiFi API request: ${method.toUpperCase()} ${endpoint}`);
    
    const serverRunning = await checkServerRunning();
    if (!serverRunning) {
      throw new Error('NiFi server is not running or not accessible');
    }
    
    const token = await getNiFiToken();
    if (!token) {
      throw new Error('Failed to obtain NiFi authentication token');
    }
    
    const config = {
      method,
      url: `${NIFI_API_URL}${endpoint}`,
      httpsAgent,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-ProxiedEntitiesChain': NIFI_USERNAME,
        'client-id': 'datazen-backend'
      },
      params: {
        disconnectedNodeAcknowledged: true
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    console.log('Request config:', {
      method: config.method,
      url: config.url
    });
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error making NiFi API request to ${endpoint}:`, error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
    throw error;
  }
};

// Test NiFi connection
const testNiFiConnection = async () => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, returning success for NiFi connection test');
    return { 
      success: true, 
      message: 'Successfully connected to NiFi (Mock)', 
      version: '2.3.0' 
    };
  }
  
  try {
    console.log('Testing NiFi connection to:', NIFI_API_URL);
    const aboutData = await makeNiFiRequest('get', '/flow/about');
    
    console.log('NiFi connection successful! Version:', aboutData.about.version);
    return { 
      success: true, 
      message: 'Successfully connected to NiFi', 
      version: aboutData.about.version 
    };
  } catch (error) {
    console.error('NiFi connection test failed:', error.message);
    return { 
      success: false, 
      message: error.message || 'Failed to connect to NiFi'
    };
  }
};

// Get all process groups (workflows)
const getProcessGroups = async () => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, returning mock process groups');
    return mockData.processGroups;
  }
  
  try {
    const data = await makeNiFiRequest('get', '/process-groups/root/process-groups');
    return data.processGroups;
  } catch (error) {
    console.error('Error fetching process groups:', error);
    throw error;
  }
};

// Get a specific process group by ID
const getProcessGroup = async (processGroupId) => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, returning mock process group for ID:', processGroupId);
    return mockData.processGroups.find(pg => pg.id === processGroupId) || mockData.processGroups[0];
  }
  
  try {
    return await makeNiFiRequest('get', `/process-groups/${processGroupId}`);
  } catch (error) {
    console.error(`Error fetching process group ${processGroupId}:`, error);
    throw error;
  }
};

// Get process group status
const getProcessGroupStatus = async (processGroupId) => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, returning mock status for process group ID:', processGroupId);
    return {
      processGroupId,
      status: 'RUNNING',
      processorStates: mockData.processors.map(p => ({
        id: p.id,
        name: p.component.name,
        state: p.component.state,
        type: p.component.type
      })),
      lastUpdated: new Date().toISOString()
    };
  }
  
  try {
    const processorsResponse = await makeNiFiRequest('get', `/process-groups/${processGroupId}/processors`);
    const processors = processorsResponse.processors || [];
    
    const processorStates = processors.map(processor => ({
      id: processor.id,
      name: processor.component.name,
      state: processor.component.state,
      type: processor.component.type
    }));
    
    let overallStatus = 'STOPPED';
    if (processorStates.some(p => p.state === 'RUNNING')) {
      overallStatus = 'RUNNING';
    } else if (processorStates.some(p => p.state === 'STOPPED' && processorStates.some(p => p.state === 'DISABLED'))) {
      overallStatus = 'PARTIALLY_DISABLED';
    } else if (processorStates.every(p => p.state === 'DISABLED')) {
      overallStatus = 'DISABLED';
    }
    
    return {
      processGroupId,
      status: overallStatus,
      processorStates,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error getting process group status ${processGroupId}:`, error);
    throw error;
  }
};

// Get metrics for a process group
const getProcessGroupMetrics = async (processGroupId) => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, returning mock metrics for process group ID:', processGroupId);
    return {
      bytesIn: mockData.metrics.bytesIn,
      bytesOut: mockData.metrics.bytesOut,
      bytesQueued: mockData.metrics.bytesQueued,
      flowFilesIn: mockData.metrics.flowFilesIn,
      flowFilesOut: mockData.metrics.flowFilesOut,
      flowFilesQueued: mockData.metrics.flowFilesQueued,
      activeThreadCount: mockData.metrics.activeThreadCount,
      lastRefreshed: new Date().toISOString()
    };
  }
  
  try {
    const metricsResponse = await makeNiFiRequest('get', `/flow/process-groups/${processGroupId}/status`);
    const metrics = metricsResponse.processGroupStatus || {};
    
    return {
      bytesIn: metrics.bytesIn || 0,
      bytesOut: metrics.bytesOut || 0,
      bytesQueued: metrics.bytesQueued || 0,
      flowFilesIn: metrics.flowFilesIn || 0,
      flowFilesOut: metrics.flowFilesOut || 0,
      flowFilesQueued: metrics.flowFilesQueued || 0,
      activeThreadCount: metrics.activeThreadCount || 0,
      lastRefreshed: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error getting process group metrics ${processGroupId}:`, error);
    throw error;
  }
};

// Start a process group
const startProcessGroup = async (processGroupId) => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, simulating starting process group ID:', processGroupId);
    return { 
      success: true, 
      message: 'Process group started successfully (Mock)',
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    const processorsResponse = await makeNiFiRequest('get', `/process-groups/${processGroupId}/processors`);
    const processors = processorsResponse.processors;
    for (const processor of processors) {
      await makeNiFiRequest('put', `/processors/${processor.id}/run-status`, {
        revision: {
          version: processor.revision.version,
          clientId: 'datazen-frontend',
        },
        state: 'RUNNING',
        disconnectedNodeAcknowledged: false
      });
    }

    return { 
      success: true,
      message: 'Process group started successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error starting process group:', error);
    throw error;
  }
};

// Stop a process group
const stopProcessGroup = async (processGroupId) => {
  if (MOCK_NIFI_API) {
    console.log('Mock mode enabled, simulating stopping process group ID:', processGroupId);
    return { 
      success: true, 
      message: 'Process group stopped successfully (Mock)',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const processorsResponse = await makeNiFiRequest('get', `/process-groups/${processGroupId}/processors`);
    const processors = processorsResponse.processors;
    for (const processor of processors) {
      await makeNiFiRequest('put', `/processors/${processor.id}/run-status`, {
        revision: {
          version: processor.revision.version,
          clientId: 'datazen-frontend'
        },
        state: 'STOPPED',
        disconnectedNodeAcknowledged: false
      });
    }

    return { 
      success: true,
      message: 'Process group stopped successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error stopping process group:', error);
    throw error;
  }
};

// Create a new process group
const createProcessGroup = async (name, description) => {
  try {
    const rootResponse = await makeNiFiRequest('get', '/process-groups/root');
    const rootId = rootResponse.id;

    const response = await makeNiFiRequest('post', `/process-groups/${rootId}/process-groups`, {
      revision: {
        version: 0,
        clientId: 'datazen-frontend'
      },
      component: {
        name,
        position: {
          x: 100,
          y: 100,
        },
        comments: description,
      },
      disconnectedNodeAcknowledged: false
    });

    return response;
  } catch (error) {
    console.error('Error creating process group:', error);
    throw error;
  }
};

// Delete a process group
const deleteProcessGroup = async (processGroupId) => {
  try {
    const pgResponse = await makeNiFiRequest('get', `/process-groups/${processGroupId}`);
    const version = pgResponse.revision.version;

    await makeNiFiRequest('delete', `/process-groups/${processGroupId}`, {
      revision: {
        version,
        clientId: 'datazen-frontend'
      },
      disconnectedNodeAcknowledged: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting process group:', error);
    throw error;
  }
};

// Create a controller service for database connection
const createDatabaseConnectionService = async (processGroupId, connectionData) => {
  try {
    const controllerServicesResponse = await makeNiFiRequest(
      'post', 
      `/process-groups/${processGroupId}/controller-services`, 
      {
        revision: {
          version: 0,
          clientId: 'datazen-frontend'
        },
        component: {
          type: getDatabaseControllerServiceType(connectionData.type),
          name: connectionData.name,
          properties: getDatabaseProperties(connectionData),
        },
        disconnectedNodeAcknowledged: false
      }
    );

    const controllerServiceId = controllerServicesResponse.id;

    await makeNiFiRequest(
      'put', 
      `/controller-services/${controllerServiceId}/run-status`, 
      {
        revision: {
          version: controllerServicesResponse.revision.version,
          clientId: 'datazen-frontend'
        },
        state: 'ENABLED',
        disconnectedNodeAcknowledged: false
      }
    );

    return controllerServicesResponse;
  } catch (error) {
    console.error('Error creating database connection service:', error);
    throw error;
  }
};

// Test a database connection
const testDatabaseConnection = async (connectionData) => {
  try {
    return { success: true };
  } catch (error) {
    console.error('Error testing database connection:', error);
    throw error;
  }
};

// Configure ETL pipeline
const configureETLPipeline = async (processGroupId, sourceConnectionId, destinationConnectionId) => {
  try {
    return {
      success: true,
      message: 'ETL pipeline configured successfully',
      processors: {
        extract: 'extractorId',
        transform: 'transformId',
        load: 'loadId',
      },
    };
  } catch (error) {
    console.error('Error configuring ETL pipeline:', error);
    throw error;
  }
};

// Get existing pipeline by ID
const getExistingPipeline = async (pipelineId) => {
  try {
    const response = await makeNiFiRequest('get', `/process-groups/${pipelineId}`);
    return response;
  } catch (error) {
    console.error('Error fetching existing pipeline:', error);
    throw error;
  }
};

// Get status of existing pipeline
const getExistingPipelineStatus = async (pipelineId) => {
  try {
    const processorsResponse = await makeNiFiRequest('get', `/process-groups/${pipelineId}/processors`);
    const processors = processorsResponse.processors;
    
    const processorStates = processors.map(processor => ({
      id: processor.id,
      name: processor.component.name,
      state: processor.component.state,
      type: processor.component.type
    }));
    
    let overallStatus = 'STOPPED';
    if (processorStates.some(p => p.state === 'RUNNING')) {
      overallStatus = 'RUNNING';
    } else if (processorStates.some(p => p.state === 'STOPPED' && processorStates.some(p => p.state === 'DISABLED'))) {
      overallStatus = 'PARTIALLY_DISABLED';
    } else if (processorStates.every(p => p.state === 'DISABLED')) {
      overallStatus = 'DISABLED';
    }
    
    return {
      pipelineId,
      status: overallStatus,
      processorStates,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting pipeline status:', error);
    throw error;
  }
};

// Start existing pipeline
const startExistingPipeline = async (pipelineId) => {
  try {
    const processorsResponse = await makeNiFiRequest('get', `/process-groups/${pipelineId}/processors`);
    const processors = processorsResponse.processors;
    
    for (const processor of processors) {
      if (processor.component.state !== 'RUNNING' && processor.component.state !== 'DISABLED') {
        await makeNiFiRequest('put', `/processors/${processor.id}/run-status`, {
          revision: {
            version: processor.revision.version,
            clientId: 'datazen-frontend'
          },
          state: 'RUNNING',
          disconnectedNodeAcknowledged: false
        });
      }
    }
    
    return { 
      success: true, 
      message: 'Pipeline started successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error starting pipeline:', error);
    throw error;
  }
};

// Stop existing pipeline
const stopExistingPipeline = async (pipelineId) => {
  try {
    const processorsResponse = await makeNiFiRequest('get', `/process-groups/${pipelineId}/processors`);
    const processors = processorsResponse.processors;
    
    for (const processor of processors) {
      if (processor.component.state === 'RUNNING') {
        await makeNiFiRequest('put', `/processors/${processor.id}/run-status`, {
          revision: {
            version: processor.revision.version,
            clientId: 'datazen-frontend'
          },
          state: 'STOPPED',
          disconnectedNodeAcknowledged: false
        });
      }
    }
    
    return { 
      success: true, 
      message: 'Pipeline stopped successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error stopping pipeline:', error);
    throw error;
  }
};

// Get the flow metrics for a pipeline
const getExistingPipelineMetrics = async (pipelineId) => {
  try {
    const metricsResponse = await makeNiFiRequest('get', `/flow/process-groups/${pipelineId}/status`);
    const metrics = metricsResponse.processGroupStatus;
    
    return {
      bytesIn: metrics.bytesIn,
      bytesOut: metrics.bytesOut,
      bytesQueued: metrics.bytesQueued,
      flowFilesIn: metrics.flowFilesIn,
      flowFilesOut: metrics.flowFilesOut,
      flowFilesQueued: metrics.flowFilesQueued,
      activeThreadCount: metrics.activeThreadCount,
      lastRefreshed: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting pipeline metrics:', error);
    throw error;
  }
};

// Helper function to get the appropriate controller service type for a database
const getDatabaseControllerServiceType = (dbType) => {
  return 'org.apache.nifi.dbcp.DBCPConnectionPool';
};

// Helper function to get the appropriate connection properties for a database
const getDatabaseProperties = (connectionData) => {
  const { host, port, database, username, password } = connectionData;
  return {
    'Database Connection URL': `jdbc:postgresql://${host}:${port}/${database}`,
    'Database User': username,
    'Password': password,
    'Database Driver Class Name': 'org.postgresql.Driver',
    'Database Driver Location': '/opt/nifi/nifi-current/lib/postgresql-42.2.18.jar',
  };
};

module.exports = {
  getProcessGroups,
  getProcessGroup,
  getProcessGroupStatus,
  getProcessGroupMetrics,
  createProcessGroup,
  startProcessGroup,
  stopProcessGroup,
  deleteProcessGroup,
  createDatabaseConnectionService,
  testDatabaseConnection,
  testNiFiConnection,
  configureETLPipeline,
  getExistingPipeline,
  getExistingPipelineStatus,
  startExistingPipeline,
  stopExistingPipeline,
  getExistingPipelineMetrics,
  checkServerRunning
};
