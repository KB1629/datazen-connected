// API service for communicating with the NiFi integration backend

// Define the API base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Workflows API
export const fetchWorkflows = async () => {
  const response = await fetch(`${API_BASE_URL}/workflows`);
  if (!response.ok) {
    throw new Error('Failed to fetch workflows');
  }
  return response.json();
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
  const response = await fetch(`${API_BASE_URL}/workflows/${id}/run`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to run workflow');
  }
  return response.json();
};

export const pauseWorkflow = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/workflows/${id}/pause`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to pause workflow');
  }
  return response.json();
};

export const deleteWorkflow = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete workflow');
  }
  return response.json();
};

// Database Connections API
export const fetchConnections = async () => {
  const response = await fetch(`${API_BASE_URL}/connections`);
  if (!response.ok) {
    throw new Error('Failed to fetch connections');
  }
  return response.json();
};

export const createConnection = async (connectionData: any) => {
  const response = await fetch(`${API_BASE_URL}/connections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(connectionData),
  });
  if (!response.ok) {
    throw new Error('Failed to create connection');
  }
  return response.json();
};

export const testConnection = async (connectionData: any) => {
  const response = await fetch(`${API_BASE_URL}/connections/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(connectionData),
  });
  if (!response.ok) {
    throw new Error('Failed to test connection');
  }
  return response.json();
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
  const response = await fetch(`${API_BASE_URL}/nifi/test`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to test NiFi connection');
  }
  return response.json();
};

// Existing NiFi Pipeline API
export const getNifiPipeline = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/nifi/pipeline/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get NiFi pipeline');
  }
  return response.json();
};

export const getNifiPipelineStatus = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/nifi/pipeline/${id}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get NiFi pipeline status');
  }
  return response.json();
};

export const startNifiPipeline = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/nifi/pipeline/${id}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to start NiFi pipeline');
  }
  return response.json();
};

export const stopNifiPipeline = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/nifi/pipeline/${id}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to stop NiFi pipeline');
  }
  return response.json();
};

export const getNifiPipelineMetrics = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/nifi/pipeline/${id}/metrics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get NiFi pipeline metrics');
  }
  return response.json();
}; 