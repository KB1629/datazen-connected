# Sprint 1: Functional Database Connections

## Overview

This sprint focuses on implementing real database connectivity for the DataZen platform. The feature allows users to define, test, and save database connections in the UI, which can later be used for ETL workflows.

## Features Implemented

1. **Real Database Connection Testing**: The system can now test connections to actual databases using the provided credentials.
2. **Schema Information Retrieval**: Upon successful connection, the system retrieves and displays table schemas from the database.
3. **Connection Storage**: Successful connections are stored for later use in ETL workflows.
4. **Multi-Database Support**: The implementation supports PostgreSQL, MySQL, and SQL Server.

## Technical Implementation

### Backend Components

1. **Database Connection Logic**: 
   - Implemented database-specific connection testing in `nifiService.js`
   - Added functions to retrieve schema information from each database type
   - Enhanced error handling for better user feedback

2. **API Endpoints**:
   - `/api/connections` - GET: Retrieve all saved connections
   - `/api/connections` - POST: Create a new connection
   - `/api/connections/test` - POST: Test a database connection
   - `/api/connections/:id` - DELETE: Remove a saved connection

3. **In-Memory Storage**:
   - Implemented temporary storage for database connections
   - In a production environment, this would be replaced with a database

### Database Drivers

Added the following Node.js packages to enable database connections:
- `pg`: PostgreSQL driver
- `mysql2`: MySQL driver
- `mssql`: SQL Server driver

### Connection Testing Logic

For each database type, the system:
1. Attempts to establish a connection using the provided credentials
2. Runs a simple test query to verify connectivity
3. Retrieves schema information (tables and columns)
4. Returns the result to the frontend

### Schema Retrieval Logic

For each database type, we query the database's system catalogs to extract:
- Table names
- Column names
- Data types

This information is formatted consistently across database types to provide a unified schema view in the UI.

## Testing Instructions

### PostgreSQL Connection

```
Host: 13.201.78.11
Port: 5432
Username: postgres
Password: H3!d!sql
Database: postgres
```

### SQL Server Connection

```
Host: 13.201.78.11
Port: 1433
Username: SA
Password: Str0ngP@ssw0rd
Database: master
```

### Testing Process

1. Navigate to the Connections page
2. Click "New Connection"
3. Select the database type (PostgreSQL or SQL Server)
4. Enter the credentials provided above
5. Click "Test Connection"
6. Upon successful connection, the UI will display available tables and columns
7. Click "Save Connection" to store the connection for later use

## Next Steps

After implementing database connections, the next sprint will focus on:
1. Dynamic configuration of NiFi processors using these connections
2. Creating a workflow to execute data pipelines between connected databases
3. Implementing monitoring and feedback for pipeline execution

## Known Limitations

1. Connection credentials are stored in memory and will be lost when the server restarts
2. SSL connections require additional configuration
3. Advanced connection properties are not yet supported
4. Connection pooling is not yet implemented for performance optimization 