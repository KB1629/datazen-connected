# DataZen Backend

This directory contains the backend server for the DataZen ETL platform. It provides the API endpoints for the frontend and integrates with Apache NiFi for ETL pipeline management.

## Components

- **server.js**: Main Express server that handles API requests
- **nifiService.js**: Service that communicates with Apache NiFi API
- **start.js**: Entry point for the server
- **test-nifi.js**: Script to test NiFi connectivity

## Features

### NiFi Integration

The backend server integrates with Apache NiFi to:
- Fetch and manage process groups (workflows)
- Start and stop pipelines
- Monitor pipeline status
- Create and configure processors

### Database Connection Management

The server provides APIs to:
- Test connections to various database types (PostgreSQL, MySQL, SQL Server)
- Retrieve database schema information
- Store and manage connection details

## Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=3001
JWT_SECRET=your_secret_key
NIFI_API_URL=https://localhost:8443/nifi-api
NIFI_USERNAME=your_nifi_username
NIFI_PASSWORD=your_nifi_password
NIFI_SSL_VERIFY=false
NIFI_AUTH_METHOD=password
MOCK_NIFI_API=false
```

- `PORT`: Port for the backend server
- `JWT_SECRET`: Secret for JWT authentication
- `NIFI_API_URL`: URL of the NiFi API
- `NIFI_USERNAME`: Username for NiFi authentication
- `NIFI_PASSWORD`: Password for NiFi authentication
- `NIFI_SSL_VERIFY`: Whether to verify SSL certificates
- `NIFI_AUTH_METHOD`: Authentication method (password, certificate)
- `MOCK_NIFI_API`: Use mock API responses for testing

## API Endpoints

### Workflows API
- GET `/api/workflows`: Get all workflows
- POST `/api/workflows`: Create a new workflow
- GET `/api/workflows/:id`: Get a specific workflow
- POST `/api/workflows/:id/run`: Run a workflow
- POST `/api/workflows/:id/pause`: Pause a workflow
- DELETE `/api/workflows/:id`: Delete a workflow

### Connections API
- GET `/api/connections`: Get all database connections
- POST `/api/connections`: Create a new connection
- POST `/api/connections/test`: Test a database connection
- DELETE `/api/connections/:id`: Delete a connection

### NiFi API
- GET `/api/nifi/test`: Test connection to NiFi
- GET `/api/nifi/process-groups`: Get all process groups
- GET `/api/nifi/process-groups/:id`: Get a specific process group
- GET `/api/nifi/process-groups/:id/status`: Get status of a process group
- POST `/api/nifi/process-groups/:id/start`: Start a process group
- POST `/api/nifi/process-groups/:id/stop`: Stop a process group

## Running the Server

```
npm install
node server.js
```

The server will run on port 3001 (or the port specified in the .env file).

## Database Drivers

The server includes drivers for:
- PostgreSQL (`pg` package)
- MySQL (`mysql2` package)
- SQL Server (`mssql` package)

These are used for testing connections and retrieving schema information.

## NiFi Configuration

The backend expects Apache NiFi to be running and accessible. It can be configured to work with:
- Password-based authentication
- Certificate-based authentication
- Kerberos authentication

For development and testing, you can set `MOCK_NIFI_API=true` to use mock responses without a real NiFi instance. 