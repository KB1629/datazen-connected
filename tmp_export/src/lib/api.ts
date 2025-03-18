// API service for communicating with the NiFi integration backend

// Define the API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to get auth headers with token
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Workflows API
export const fetchWorkflows = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/workflows`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
};

export const createWorkflow = async (workflowData: any) => {
  const response = await fetch(`${API_BASE_URL}/workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData),
  });
  if (!response.ok) {
    throw new Error('Failed to create workflow');
  }
  return response.json();
};

export const runWorkflow = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}/run`, {
      method: 'POST',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error running workflow:', error);
    throw error;
  }
};

export const pauseWorkflow = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}/pause`, {
      method: 'POST',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error pausing workflow:', error);
    throw error;
  }
};

export const deleteWorkflow = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting workflow:', error);
    throw error;
  }
};

// Database Connections API
export const fetchConnections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }
};

export const createConnection = async (connectionData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connectionData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating connection:', error);
    throw error;
  }
};

export const testConnection = async (connectionData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connectionData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};

export const deleteConnection = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/connections/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete connection');
  }
  return response.json();
};

// Schema Transformation API
export const transformSchema = async (sourceSchema: any, transformationRules: any) => {
  const response = await fetch(`${API_BASE_URL}/transform/schema`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sourceSchema,
      transformationRules,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to transform schema');
  }
  return response.json();
};

// NiFi API
export const testNiFiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/nifi/test`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to test NiFi connection: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error testing NiFi connection:', error);
    return { success: false, message: error.message };
  }
};

// Existing NiFi Pipeline API
export const getNifiPipeline = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nifi/process-groups/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get pipeline details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching NiFi pipeline:', error);
    throw error;
  }
};

export const getNifiPipelineStatus = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nifi/process-groups/${id}/status`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get pipeline status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching NiFi pipeline status:', error);
    throw error;
  }
};

export const startNifiPipeline = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nifi/process-groups/${id}/start`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to start pipeline: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error starting NiFi pipeline:', error);
    throw error;
  }
};

export const stopNifiPipeline = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nifi/process-groups/${id}/stop`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to stop pipeline: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error stopping NiFi pipeline:', error);
    throw error;
  }
};

export const getNifiPipelineMetrics = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nifi/process-groups/${id}/metrics`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get pipeline metrics: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching NiFi pipeline metrics:', error);
    throw error;
  }
}; 