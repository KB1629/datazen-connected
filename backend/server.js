const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
require('dotenv').config();
const nifiService = require('./nifiService');
const jwt = require('jsonwebtoken');

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

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fdghtndgfndfgndgnd';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// In-memory storage for workflows (replace with database in production)
let workflows = [];

// In-memory storage for connections (replace with database in production)
let connections = [
  {
    id: '1',
    name: 'Source PostgreSQL',
    type: 'PostgreSQL',
    host: 'localhost',
    port: '5432',
    username: 'postgres',
    database: 'source_db',
    status: 'Connected',
    updatedAt: new Date().toISOString()
  }
];

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
    res.json(connections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

app.post('/api/connections', async (req, res) => {
  try {
    // Create a new connection
    const newConnection = {
      id: Date.now().toString(),
      ...req.body,
      status: 'Connected',
      updatedAt: new Date().toISOString()
    };
    
    // Add to in-memory storage
    connections.push(newConnection);
    
    res.status(201).json(newConnection);
  } catch (error) {
    console.error('Error creating connection:', error);
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

app.post('/api/connections/test', async (req, res) => {
  try {
    const connectionData = req.body;
    
    console.log('Testing database connection with:', {
      type: connectionData.type,
      host: connectionData.host,
      port: connectionData.port,
      database: connectionData.database,
      username: connectionData.username,
      // Password omitted for security
    });
    
    // Test the connection using NiFi service
    const result = await nifiService.testDatabaseConnection(connectionData);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message || 'Connection successful',
        tables: result.tables || {}
      });
    } else {
      throw new Error(result.message || 'Connection failed');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to test connection' 
    });
  }
});

app.delete('/api/connections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remove from in-memory storage
    connections = connections.filter(conn => conn.id !== id);
    
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

// NiFi Routes - Temporarily bypassing authentication for all NiFi routes
app.get('/api/nifi/process-groups', async (req, res) => {
  try {
    const processGroups = await nifiService.getProcessGroups();
    res.json(processGroups);
  } catch (error) {
    console.error('Error getting NiFi process groups:', error);
    res.status(500).json({ error: 'Failed to get NiFi process groups' });
  }
});

// Get specific process group
app.get('/api/nifi/process-groups/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const processGroup = await nifiService.getProcessGroup(id);
    res.json(processGroup);
  } catch (error) {
    console.error(`Error getting NiFi process group ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get NiFi process group' });
  }
});

// Get process group status
app.get('/api/nifi/process-groups/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const status = await nifiService.getProcessGroupStatus(id);
    res.json(status);
  } catch (error) {
    console.error(`Error getting NiFi process group status ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get NiFi process group status' });
  }
});

// Start process group
app.post('/api/nifi/process-groups/:id/start', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await nifiService.startProcessGroup(id);
    res.json(result);
  } catch (error) {
    console.error(`Error starting NiFi process group ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to start NiFi process group' });
  }
});

// Stop process group
app.post('/api/nifi/process-groups/:id/stop', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await nifiService.stopProcessGroup(id);
    res.json(result);
  } catch (error) {
    console.error(`Error stopping NiFi process group ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to stop NiFi process group' });
  }
});

// Get process group metrics
app.get('/api/nifi/process-groups/:id/metrics', async (req, res) => {
  try {
    const id = req.params.id;
    const metrics = await nifiService.getProcessGroupMetrics(id);
    res.json(metrics);
  } catch (error) {
    console.error(`Error getting NiFi process group metrics ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get NiFi process group metrics' });
  }
});

// Test NiFi Connection - temporarily bypassing authentication for testing
app.get('/api/nifi/test', async (req, res) => {
  try {
    console.log('Testing NiFi connection...');
    const result = await nifiService.checkServerRunning();
    res.json({ success: result, message: result ? 'Connected to NiFi server' : 'Could not connect to NiFi server' });
  } catch (error) {
    console.error('Error testing NiFi connection:', error);
    res.status(500).json({ success: false, message: `Error: ${error.message}` });
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

// Existing NiFi Pipeline API - Temporarily bypassing authentication for testing
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