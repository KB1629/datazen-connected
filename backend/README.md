# NiFi Integration Service

This service provides an API layer between the DataZen frontend and Apache NiFi for ETL operations.

## Overview

The NiFi Integration Service acts as a middleware between the DataZen frontend and Apache NiFi. It provides RESTful APIs for:

1. Managing ETL workflows (NiFi process groups)
2. Managing database connections
3. Transforming schemas using Google Gemini Flash 2.2 API

## Setup

### Prerequisites

- Node.js 14+ and npm
- Apache NiFi instance running
- Access to Google Gemini Flash 2.2 API (for schema transformation)

### Installation

1. Clone this repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file with the following variables:

```
PORT=3001
NIFI_API_URL=http://your-nifi-instance:8080/nifi-api
# Add your NiFi authentication details if needed
# NIFI_USERNAME=admin
# NIFI_PASSWORD=password
```

5. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Workflows

- `GET /api/workflows` - Get all workflows
- `POST /api/workflows` - Create a new workflow
- `POST /api/workflows/:id/run` - Run a workflow
- `POST /api/workflows/:id/pause` - Pause a workflow
- `DELETE /api/workflows/:id` - Delete a workflow

### Connections

- `GET /api/connections` - Get all database connections
- `POST /api/connections` - Create a new database connection
- `POST /api/connections/test` - Test a database connection
- `DELETE /api/connections/:id` - Delete a database connection

### Schema Transformation

- `POST /api/transform/schema` - Transform a schema using Google Gemini Flash 2.2 API

## Database Support

This service supports the following database types:

- PostgreSQL
- MySQL
- Microsoft SQL Server
- Oracle
- MongoDB

## NiFi Integration

The service communicates with NiFi using its REST API. It creates and manages:

1. Process Groups for workflows
2. Controller Services for database connections
3. Processors for ETL operations

## Schema Transformation

Schema transformation is handled by a NiFi pipeline that uses the Google Gemini Flash 2.2 API via the InvokeHTTP processor. The pipeline:

1. Extracts data from the source database using ExecuteSQL
2. Transforms the schema using Gemini Flash 2.2 API
3. Loads the transformed data to the destination database using PutDatabaseRecord

## Security Considerations

- Store database credentials securely
- Use HTTPS for production deployments
- Implement proper authentication and authorization
- Validate and sanitize all inputs

## Troubleshooting

- Check NiFi logs for errors
- Ensure NiFi API is accessible
- Verify database connection parameters
- Check network connectivity between services 