const axios = require('axios');
require('dotenv').config();

// Configure axios defaults
axios.defaults.httpsAgent = new (require('https').Agent)({
  rejectUnauthorized: process.env.NIFI_SSL_VERIFY === 'true'
});

// Create axios instance with default config
const nifiClient = axios.create({
  baseURL: process.env.NIFI_API_URL,
  auth: {
    username: process.env.NIFI_USERNAME || 'admin',
    password: process.env.NIFI_PASSWORD || 'admin'
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor for better error handling
nifiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('NiFi API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      throw new Error(error.response.data.message || `NiFi API Error: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from NiFi:', error.request);
      throw new Error('No response received from NiFi API');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up NiFi request:', error.message);
      throw new Error('Failed to connect to NiFi API');
    }
  }
);

// Helper function to handle NiFi API responses
const handleNiFiResponse = (response) => {
  if (!response || !response.data) {
    throw new Error('Invalid response from NiFi API');
  }
  return response.data;
};

// NiFi API functions
const nifiService = {
  // Get process group details
  async getProcessGroup(id) {
    try {
      const response = await nifiClient.get(`/process-groups/${id}`);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error getting process group ${id}:`, error);
      throw error;
    }
  },

  // Create process group
  async createProcessGroup(parentId, data) {
    try {
      const response = await nifiClient.post(`/process-groups/${parentId}`, data);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error creating process group in ${parentId}:`, error);
      throw error;
    }
  },

  // Update process group
  async updateProcessGroup(id, data) {
    try {
      const response = await nifiClient.put(`/process-groups/${id}`, data);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error updating process group ${id}:`, error);
      throw error;
    }
  },

  // Delete process group
  async deleteProcessGroup(id) {
    try {
      const response = await nifiClient.delete(`/process-groups/${id}`);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error deleting process group ${id}:`, error);
      throw error;
    }
  },

  // Get processor details
  async getProcessor(id) {
    try {
      const response = await nifiClient.get(`/processors/${id}`);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error getting processor ${id}:`, error);
      throw error;
    }
  },

  // Create processor
  async createProcessor(parentId, data) {
    try {
      const response = await nifiClient.post(`/process-groups/${parentId}/processors`, data);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error creating processor in ${parentId}:`, error);
      throw error;
    }
  },

  // Update processor
  async updateProcessor(id, data) {
    try {
      const response = await nifiClient.put(`/processors/${id}`, data);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error updating processor ${id}:`, error);
      throw error;
    }
  },

  // Delete processor
  async deleteProcessor(id) {
    try {
      const response = await nifiClient.delete(`/processors/${id}`);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error deleting processor ${id}:`, error);
      throw error;
    }
  },

  // Get controller service details
  async getControllerService(id) {
    try {
      const response = await nifiClient.get(`/controller-services/${id}`);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error getting controller service ${id}:`, error);
      throw error;
    }
  },

  // Create controller service
  async createControllerService(parentId, data) {
    try {
      const response = await nifiClient.post(`/controller-services`, data);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error creating controller service in ${parentId}:`, error);
      throw error;
    }
  },

  // Update controller service
  async updateControllerService(id, data) {
    try {
      const response = await nifiClient.put(`/controller-services/${id}`, data);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error updating controller service ${id}:`, error);
      throw error;
    }
  },

  // Delete controller service
  async deleteControllerService(id) {
    try {
      const response = await nifiClient.delete(`/controller-services/${id}`);
      return handleNiFiResponse(response);
    } catch (error) {
      console.error(`Error deleting controller service ${id}:`, error);
      throw error;
    }
  }
};

module.exports = nifiService; 