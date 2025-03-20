# Sprint 2: Dynamic NiFi Integration for Database Pipelines

## Overview

This sprint focuses on implementing dynamic configuration of Apache NiFi processors using database connection details provided by users in the frontend. This enables automated ETL pipelines between different database systems without requiring manual configuration of NiFi.

## Design Goals

1. **User-Driven Configuration**: Allow users to configure ETL pipelines through the UI without knowledge of NiFi internals
2. **Dynamic Processor Configuration**: Inject user-provided database details into NiFi processors
3. **Automated Execution**: Enable one-click execution of configured pipelines
4. **Preserve Existing Integration**: Maintain the current "Manage Pipeline" functionality that's critical to the application

## Technical Implementation

### Backend Components

#### NiFi Integration Extensions

1. **Processor Configuration API**:
   - New endpoints to dynamically update NiFi processors with connection parameters
   - Methods to inject SQL queries and transform configurations

2. **Pipeline Management**:
   - APIs to create temporary process groups for ETL operations
   - Functions to wire processors together based on user configuration
   - Pipeline monitoring and cleanup logic

3. **Connection Mapping**:
   - Logic to map frontend connection objects to NiFi processor configurations
   - Dynamic JDBC URL and driver configuration based on database type

#### Key Functions to Implement

1. `createDynamicPipeline(sourceConnection, destinationConnection, transformations)`
   - Creates a new pipeline in NiFi with the specified connections
   - Configures ExtractSQL and PutDatabaseRecord processors with connection details
   - Adds any needed transformation processors

2. `configureSQLProcessor(processorId, connectionDetails, query)`
   - Updates a processor with connection details and SQL query
   - Sets authentication, connection pool settings, and timeout configurations

3. `startPipelineWithConnections(pipelineId, sourceConnectionId, destinationConnectionId)`
   - Gets connection details from stored connections
   - Configures the pipeline processors with those details
   - Starts the pipeline execution

### Frontend Components

1. **Pipeline Configuration UI**:
   - Interface to select source and destination connections
   - SQL query builder/editor for data extraction
   - Schema mapping for destination tables

2. **Execution Controls**:
   - Start/stop buttons for configured pipelines
   - Real-time status monitoring
   - Execution history and logs

3. **Connection Selector**:
   - UI component to choose from existing connections
   - Ability to create new connections inline

## Workflow

1. User selects a source connection from the Connections page
2. User selects a destination connection
3. User configures any transformations or mappings
4. User clicks "Run Pipeline"
5. Backend retrieves connection details and injects them into NiFi processors
6. Pipeline is executed with the provided configuration
7. User sees real-time status of the execution

## API Endpoints

1. `POST /api/workflows/create-dynamic`
   - Creates a new dynamic ETL pipeline between connections
   - Request body: `{ sourceConnectionId, destinationConnectionId, transformations }`

2. `POST /api/workflows/:id/configure`
   - Updates an existing pipeline with new connection details
   - Request body: `{ sourceConnectionId, destinationConnectionId }`

3. `GET /api/workflows/:id/status`
   - Returns the current status of a workflow, including processor states

4. `POST /api/workflows/:id/run-with-connections`
   - Executes a pipeline with the specified connections
   - Request body: `{ sourceConnectionId, destinationConnectionId }`

## NiFi Processor Configuration

### ExecuteSQL Processor

The ExecuteSQL processor will be configured with:
- JDBC Connection URL based on connection details
- Driver name based on database type
- Authentication credentials
- SQL query from user input or generated based on selected tables

### PutDatabaseRecord Processor

The PutDatabaseRecord processor will be configured with:
- JDBC Connection URL for destination database
- Schema name and table name
- Statement type (INSERT, UPDATE, etc.)
- Record reader/writer settings
- Batch size and commit settings

## Security Considerations

1. **Credential Management**:
   - Database credentials are not stored in NiFi configuration
   - Credentials are passed at runtime from secured storage

2. **Isolation**:
   - Each pipeline execution creates isolated processor groups
   - Temporary resources are cleaned up after execution

3. **Authentication**:
   - All API calls to NiFi are authenticated
   - User permissions are respected when creating/executing pipelines

## Testing Strategy

1. **Connection Testing**:
   - Verify connections to source and destination databases
   - Test with various database types and configurations

2. **Pipeline Execution**:
   - Test creating pipelines between different database types
   - Verify data is correctly transferred between systems
   - Monitor performance with different data volumes

3. **Error Handling**:
   - Test behavior when connections fail
   - Verify cleanup when pipelines terminate abruptly
   - Ensure useful error messages are returned to the UI

## Limitations and Future Improvements

1. **Limited Transformation Support**:
   - Initial implementation focuses on basic ETL operations
   - Complex transformations will require future enhancement

2. **Monitoring Depth**:
   - Basic status monitoring is included
   - Detailed monitoring and analytics will be added in future sprints

3. **Connection Types**:
   - Initial focus on SQL databases
   - Future support for NoSQL, file systems, and cloud storage

## Implementation Sequence

1. Develop the backend API for dynamic processor configuration
2. Implement connection mapping logic
3. Create the pipeline configuration UI
4. Develop execution and monitoring components
5. Implement cleanup and error handling
6. Test with real database connections
7. Document and deploy

## Integration with Existing System

The new dynamic configuration will complement the existing "Manage Pipeline" functionality by:
1. Preserving the current direct NiFi integration
2. Adding new capabilities for user-configured connections
3. Maintaining backward compatibility with existing workflows 