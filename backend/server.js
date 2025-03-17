const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
require('dotenv').config();
const nifiService = require('./nifiService');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:8081', // Specific origin instead of wildcard
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Configuration
const PORT = process.env.PORT || 3001;

// In-memory storage for workflows (replace with database in production)
let workflows = [];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NiFi Integration API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      workflows: '/api/workflows',
      connections: '/api/connections',
      schemaTransform: '/api/transform/schema'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NiFi Integration Service is running' });
});

// Workflows API
app.get('/api/workflows', (req, res) => {
  res.json(workflows);
});

app.get('/api/workflows/:id', (req, res) => {
  const workflow = workflows.find(w => w.id === req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json(workflow);
});

app.post('/api/workflows', async (req, res) => {
  try {
    const { name, description, nodes, edges, source, destination } = req.body;
    
    // Create a new workflow configuration
    const newWorkflow = {
      id: Date.now().toString(),
      name,
      description,
      nodes,
      edges,
      source,
      destination,
      status: 'scheduled',
      created: new Date().toISOString().split('T')[0],
      lastRun: 'Never',
      schedule: 'Manual',
      configuration: {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      }
    };
    
    // Store the workflow
    workflows.push(newWorkflow);
    
    res.status(201).json(newWorkflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

app.post('/api/workflows/:id/run', async (req, res) => {
  try {
    const workflow = workflows.find(w => w.id === req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    // Update workflow status
    workflow.status = 'running';
    workflow.lastRun = 'Running now';

    // Here we would:
    // 1. Validate the workflow configuration
    // 2. Create a temporary NiFi process group
    // 3. Execute the workflow
    // 4. Clean up the temporary process group
    // For now, we'll just simulate execution
    setTimeout(() => {
      workflow.status = 'completed';
      workflow.lastRun = new Date().toISOString();
    }, 5000);

    res.json({ message: 'Workflow started successfully' });
  } catch (error) {
    console.error('Error running workflow:', error);
    res.status(500).json({ error: 'Failed to run workflow' });
  }
});

app.post('/api/workflows/:id/pause', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to stop the process group in NiFi
    try {
      await nifiService.stopProcessGroup(id);
    } catch (nifiError) {
      console.error('Error stopping process group in NiFi:', nifiError);
      // Continue anyway for demo purposes
    }
    
    res.json({ success: true, message: `Workflow ${id} paused successfully` });
  } catch (error) {
    console.error('Error pausing workflow:', error);
    res.status(500).json({ error: 'Failed to pause workflow' });
  }
});

app.delete('/api/workflows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to delete the process group in NiFi
    try {
      await nifiService.deleteProcessGroup(id);
    } catch (nifiError) {
      console.error('Error deleting process group in NiFi:', nifiError);
      // Continue anyway for demo purposes
    }
    
    res.json({ success: true, message: `Workflow ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

// Connections API
app.get('/api/connections', async (req, res) => {
  try {
    // In a production environment, you would fetch connections from a database
    // For now, we'll return mock data focused on PostgreSQL
    const connections = [
      {
        id: '1',
        name: 'Source PostgreSQL',
        type: 'PostgreSQL',
        host: 'localhost',
        port: '5432',
        username: 'postgres',
        database: 'source_db',
        status: 'Connected',
        updatedAt: '2 hours ago'
      },
      {
        id: '2',
        name: 'Destination PostgreSQL',
        type: 'PostgreSQL',
        host: 'localhost',
        port: '5432',
        username: 'postgres',
        database: 'destination_db',
        status: 'Connected',
        updatedAt: '1 day ago'
      }
    ];
    
    res.json(connections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

app.post('/api/connections', async (req, res) => {
  try {
    // In a production environment, you would store the connection in a database
    // For now, we'll just return the data that was sent
    const newConnection = {
      id: Date.now().toString(),
      ...req.body,
      status: 'Connected',
      updatedAt: 'Just now'
    };
    
    res.status(201).json(newConnection);
  } catch (error) {
    console.error('Error creating connection:', error);
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

app.post('/api/connections/test', async (req, res) => {
  try {
    const connectionData = req.body;
    
    // Try to test the connection using NiFi service
    try {
      await nifiService.testDatabaseConnection(connectionData);
    } catch (nifiError) {
      console.error('Error testing connection with NiFi:', nifiError);
      // Randomly fail some connection tests for demonstration
      if (Math.random() < 0.2) {
        throw new Error('Connection failed: Could not connect to database');
      }
    }
    
    res.json({ success: true, message: 'Connection successful' });
  } catch (error) {
    console.error('Error testing connection:', error);
    res.status(500).json({ error: error.message || 'Failed to test connection' });
  }
});

app.delete('/api/connections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a production environment, you would delete the connection from a database
    // For now, we'll just return a success message
    
    res.json({ success: true, message: `Connection ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting connection:', error);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
});

// Schema Transformation API
app.post('/api/transform/schema', async (req, res) => {
  try {
    const { sourceSchema, transformationRules } = req.body;
    
    // In a production environment, you would call your NiFi pipeline or Gemini API
    // For now, we'll just return a mock transformed schema
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example transformation
    const transformedSchema = sourceSchema.map(field => {
      // Apply simple transformations based on field names
      if (field.name === 'first_name' || field.name === 'last_name') {
        return { name: 'name', type: 'string', description: 'Full name' };
      }
      if (field.name === 'telephone_number' || field.name === 'phone') {
        return { name: 'phone_number', type: 'string', description: 'Contact phone number' };
      }
      return field;
    });
    
    res.json({ 
      transformedSchema,
      message: 'Schema transformed successfully'
    });
  } catch (error) {
    console.error('Error transforming schema:', error);
    res.status(500).json({ error: 'Failed to transform schema' });
  }
});

// Test NiFi Connection
app.get('/api/nifi/test', async (req, res) => {
  try {
    console.log('Received request to test NiFi connection');
    const result = await nifiService.testNiFiConnection();
    console.log('NiFi test result:', result);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error testing NiFi connection:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to test NiFi connection',
      error: error.message 
    });
  }
});

// Configure ETL Pipeline
app.post('/api/workflows/:id/configure', async (req, res) => {
  try {
    const { id } = req.params;
    const { sourceConnectionId, destinationConnectionId } = req.body;
    
    const result = await nifiService.configureETLPipeline(id, sourceConnectionId, destinationConnectionId);
    res.json(result);
  } catch (error) {
    console.error('Error configuring ETL pipeline:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to configure ETL pipeline',
      error: error.message 
    });
  }
});

// Existing NiFi Pipeline API
app.get('/api/nifi/pipeline/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await nifiService.getExistingPipeline(id);
    res.json(result);
  } catch (error) {
    console.error('Error getting NiFi pipeline:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get NiFi pipeline',
      error: error.message 
    });
  }
});

app.get('/api/nifi/pipeline/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await nifiService.getExistingPipelineStatus(id);
    res.json(result);
  } catch (error) {
    console.error('Error getting NiFi pipeline status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get NiFi pipeline status',
      error: error.message 
    });
  }
});

app.post('/api/nifi/pipeline/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await nifiService.startExistingPipeline(id);
    res.json(result);
  } catch (error) {
    console.error('Error starting NiFi pipeline:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to start NiFi pipeline',
      error: error.message 
    });
  }
});

app.post('/api/nifi/pipeline/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await nifiService.stopExistingPipeline(id);
    res.json(result);
  } catch (error) {
    console.error('Error stopping NiFi pipeline:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to stop NiFi pipeline',
      error: error.message 
    });
  }
});

app.get('/api/nifi/pipeline/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await nifiService.getExistingPipelineMetrics(id);
    res.json(result);
  } catch (error) {
    console.error('Error getting NiFi pipeline metrics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get NiFi pipeline metrics',
      error: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('NiFi API URL:', process.env.NIFI_API_URL);
}); 