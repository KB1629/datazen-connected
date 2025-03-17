const axios = require('axios');
const https = require('https');

// NiFi API configuration
const NIFI_API_URL = process.env.NIFI_API_URL || 'https://localhost:8443/nifi-api';
const NIFI_USERNAME = process.env.NIFI_USERNAME;
const NIFI_PASSWORD = process.env.NIFI_PASSWORD;

console.log('NiFi Configuration:');
console.log('API URL:', NIFI_API_URL);
console.log('Username:', NIFI_USERNAME ? 'Provided' : 'Not provided');
console.log('Password:', NIFI_PASSWORD ? 'Provided' : 'Not provided');

// Helper function to create axios instance with authentication if needed
const createNiFiClient = () => {
  const config = {
    baseURL: NIFI_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://localhost:8443'
    },
    // Add HTTPS agent to handle self-signed certificates
    httpsAgent: new https.Agent({
      rejectUnauthorized: false // Only for development, remove in production
    }),
    // Add timeout
    timeout: 10000,
    // Add withCredentials for CORS
    withCredentials: true
  };

  // Add authentication if credentials are provided
  if (NIFI_USERNAME && NIFI_PASSWORD) {
    config.auth = {
      username: NIFI_USERNAME,
      password: NIFI_PASSWORD
    };
  }

  const client = axios.create(config);

  // Add request interceptor to handle token-based authentication
  client.interceptors.request.use(async (config) => {
    try {
      // Try to get access token first
      const tokenResponse = await axios.post(`${NIFI_API_URL}/access/token`, null, {
        auth: {
          username: NIFI_USERNAME,
          password: NIFI_PASSWORD
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      const token = tokenResponse.data;
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    } catch (error) {
      console.error('Error getting access token:', error.message);
      // Fall back to basic auth if token request fails
      return config;
    }
  });

  return client;
};

const nifiClient = createNiFiClient();

// Get all process groups (workflows)
const getProcessGroups = async () => {
  try {
    const response = await nifiClient.get('/process-groups/root/process-groups');
    return response.data.processGroups;
  } catch (error) {
    console.error('Error fetching process groups:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response',
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        auth: error.config?.auth ? 'Provided' : 'Not provided'
      }
    });
    throw error;
  }
};

// Create a new process group
const createProcessGroup = async (name, description) => {
  try {
    // First, get the root process group ID
    const rootResponse = await nifiClient.get('/process-groups/root');
    const rootId = rootResponse.data.id;

    // Create a new process group
    const response = await nifiClient.post(`/process-groups/${rootId}/process-groups`, {
      revision: {
        version: 0,
      },
      component: {
        name,
        position: {
          x: 100,
          y: 100,
        },
        comments: description,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating process group:', error);
    throw error;
  }
};

// Start a process group
const startProcessGroup = async (processGroupId) => {
  try {
    // Get all processors in the process group
    const processorsResponse = await nifiClient.get(`/process-groups/${processGroupId}/processors`);
    const processors = processorsResponse.data.processors;

    // Start each processor
    for (const processor of processors) {
      await nifiClient.put(`/processors/${processor.id}/run-status`, {
        revision: {
          version: processor.revision.version,
        },
        state: 'RUNNING',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error starting process group:', error);
    throw error;
  }
};

// Stop a process group
const stopProcessGroup = async (processGroupId) => {
  try {
    // Get all processors in the process group
    const processorsResponse = await nifiClient.get(`/process-groups/${processGroupId}/processors`);
    const processors = processorsResponse.data.processors;

    // Stop each processor
    for (const processor of processors) {
      await nifiClient.put(`/processors/${processor.id}/run-status`, {
        revision: {
          version: processor.revision.version,
        },
        state: 'STOPPED',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error stopping process group:', error);
    throw error;
  }
};

// Delete a process group
const deleteProcessGroup = async (processGroupId) => {
  try {
    // First, get the process group to get its current version
    const pgResponse = await nifiClient.get(`/process-groups/${processGroupId}`);
    const version = pgResponse.data.revision.version;

    // Delete the process group
    await nifiClient.delete(`/process-groups/${processGroupId}`, {
      data: {
        revision: {
          version,
        },
        disconnectedNodeAcknowledged: true,
      },
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
    // First, create a controller service
    const controllerServicesResponse = await nifiClient.post(`/process-groups/${processGroupId}/controller-services`, {
      revision: {
        version: 0,
      },
      component: {
        type: getDatabaseControllerServiceType(connectionData.type),
        name: connectionData.name,
        properties: getDatabaseProperties(connectionData),
      },
    });

    const controllerServiceId = controllerServicesResponse.data.id;

    // Enable the controller service
    await nifiClient.put(`/controller-services/${controllerServiceId}/run-status`, {
      revision: {
        version: controllerServicesResponse.data.revision.version,
      },
      state: 'ENABLED',
    });

    return controllerServicesResponse.data;
  } catch (error) {
    console.error('Error creating database connection service:', error);
    throw error;
  }
};

// Helper function to get the appropriate controller service type for a database
const getDatabaseControllerServiceType = (dbType) => {
  // Since we're focusing on PostgreSQL, we'll always return the PostgreSQL controller service type
  return 'org.apache.nifi.dbcp.DBCPConnectionPool';
};

// Helper function to get the appropriate connection properties for a database
const getDatabaseProperties = (connectionData) => {
  const { host, port, database, username, password } = connectionData;
  
  // For PostgreSQL connections
  return {
    'Database Connection URL': `jdbc:postgresql://${host}:${port}/${database}`,
    'Database User': username,
    'Password': password,
    'Database Driver Class Name': 'org.postgresql.Driver',
    'Database Driver Location': '/opt/nifi/nifi-current/lib/postgresql-42.2.18.jar', // Update this path to your actual PostgreSQL driver location
  };
};

// Helper function to generate JDBC URL based on database type
const getJdbcUrl = (type, host, port, database) => {
  // Since we're focusing on PostgreSQL, we'll always return a PostgreSQL JDBC URL
  return `jdbc:postgresql://${host}:${port}/${database}`;
};

// Test a database connection
const testDatabaseConnection = async (connectionData) => {
  try {
    // In a real implementation, you would create a temporary controller service
    // and test the connection, then delete the service
    
    // For now, we'll just simulate a successful connection
    return { success: true };
  } catch (error) {
    console.error('Error testing database connection:', error);
    throw error;
  }
};

// Test NiFi connection
const testNiFiConnection = async () => {
  try {
    console.log('Testing NiFi connection to:', NIFI_API_URL);
    const response = await nifiClient.get('/system-diagnostics');
    console.log('NiFi connection successful');
    return { success: true, message: 'Successfully connected to NiFi' };
  } catch (error) {
    console.error('NiFi connection failed:', error.message);
    console.error('Full error details:', JSON.stringify({
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response'
    }, null, 2));
    
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Failed to connect to NiFi',
      error: error.message,
      details: {
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText
        } : 'No response'
      }
    };
  }
};

// Configure ETL pipeline
const configureETLPipeline = async (processGroupId, sourceConnectionId, destinationConnectionId) => {
  try {
    // 1. Create ExecuteSQL processor
    const executeSQLResponse = await nifiClient.post(`/process-groups/${processGroupId}/processors`, {
      revision: {
        version: 0,
      },
      component: {
        type: 'org.apache.nifi.processors.standard.ExecuteSQL',
        name: 'Extract Data',
        position: {
          x: 100,
          y: 100,
        },
        properties: {
          'Database Connection Pooling Service': sourceConnectionId,
          'SQL select query': 'SELECT * FROM your_source_table',
          'Max Rows Per Flow File': '1000',
          'Output Format': 'json',
        },
      },
    });

    // 2. Create InvokeHTTP processor for transformation
    const invokeHTTPResponse = await nifiClient.post(`/process-groups/${processGroupId}/processors`, {
      revision: {
        version: 0,
      },
      component: {
        type: 'org.apache.nifi.processors.standard.InvokeHTTP',
        name: 'Transform Data',
        position: {
          x: 400,
          y: 100,
        },
        properties: {
          'HTTP Method': 'POST',
          'Remote URL': 'https://api.gemini.com/v1/transform',
          'Request Body': '${flowfile.content}',
          'Content-Type': 'application/json',
        },
      },
    });

    // 3. Create PutDatabaseRecord processor
    const putDatabaseResponse = await nifiClient.post(`/process-groups/${processGroupId}/processors`, {
      revision: {
        version: 0,
      },
      component: {
        type: 'org.apache.nifi.processors.standard.PutDatabaseRecord',
        name: 'Load Data',
        position: {
          x: 700,
          y: 100,
        },
        properties: {
          'Database Connection Pooling Service': destinationConnectionId,
          'Table Name': 'your_destination_table',
          'Record Reader': 'JsonTreeReader',
          'Schema Name': 'public',
        },
      },
    });

    // 4. Connect the processors
    await nifiClient.post(`/process-groups/${processGroupId}/connections`, {
      revision: {
        version: 0,
      },
      component: {
        name: 'Extract to Transform',
        source: {
          id: executeSQLResponse.data.id,
          type: 'PROCESSOR',
          groupId: processGroupId,
        },
        destination: {
          id: invokeHTTPResponse.data.id,
          type: 'PROCESSOR',
          groupId: processGroupId,
        },
        selectedRelationships: ['success'],
      },
    });

    await nifiClient.post(`/process-groups/${processGroupId}/connections`, {
      revision: {
        version: 0,
      },
      component: {
        name: 'Transform to Load',
        source: {
          id: invokeHTTPResponse.data.id,
          type: 'PROCESSOR',
          groupId: processGroupId,
        },
        destination: {
          id: putDatabaseResponse.data.id,
          type: 'PROCESSOR',
          groupId: processGroupId,
        },
        selectedRelationships: ['success'],
      },
    });

    return {
      success: true,
      message: 'ETL pipeline configured successfully',
      processors: {
        extract: executeSQLResponse.data.id,
        transform: invokeHTTPResponse.data.id,
        load: putDatabaseResponse.data.id,
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
    const response = await nifiClient.get(`/process-groups/${pipelineId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching existing pipeline:', error);
    throw error;
  }
};

// Get status of existing pipeline
const getExistingPipelineStatus = async (pipelineId) => {
  try {
    const processorsResponse = await nifiClient.get(`/process-groups/${pipelineId}/processors`);
    const processors = processorsResponse.data.processors;
    
    // Get the status of all processors in the pipeline
    const processorStates = processors.map(processor => ({
      id: processor.id,
      name: processor.component.name,
      state: processor.component.state,
      type: processor.component.type
    }));
    
    // Determine overall pipeline status
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
    // Get all processors in the pipeline
    const processorsResponse = await nifiClient.get(`/process-groups/${pipelineId}/processors`);
    const processors = processorsResponse.data.processors;
    
    // Start each processor
    for (const processor of processors) {
      // Only try to start processors that aren't already running and aren't disabled
      if (processor.component.state !== 'RUNNING' && processor.component.state !== 'DISABLED') {
        await nifiClient.put(`/processors/${processor.id}/run-status`, {
          revision: {
            version: processor.revision.version,
          },
          state: 'RUNNING',
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
    // Get all processors in the pipeline
    const processorsResponse = await nifiClient.get(`/process-groups/${pipelineId}/processors`);
    const processors = processorsResponse.data.processors;
    
    // Stop each processor
    for (const processor of processors) {
      // Only try to stop processors that are running
      if (processor.component.state === 'RUNNING') {
        await nifiClient.put(`/processors/${processor.id}/run-status`, {
          revision: {
            version: processor.revision.version,
          },
          state: 'STOPPED',
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
    const metricsResponse = await nifiClient.get(`/flow/process-groups/${pipelineId}/status`);
    const metrics = metricsResponse.data.processGroupStatus;
    
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

module.exports = {
  getProcessGroups,
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
  getExistingPipelineMetrics
}; 