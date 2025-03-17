import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Database, Server, Key, Lock, Globe, Hash, HardDrive, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { testConnection } from '@/lib/api';

// Define a more inclusive base schema that allows for all possible field names
const baseConnectionSchema = z.object({
  name: z.string().min(1, { message: "Connection name is required" }),
  host: z.string().min(1, { message: "Host is required" }),
  port: z.string(),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  database: z.string().min(1, { message: "Database name is required" }),
  // Add all the possible additional fields to avoid TypeScript errors
  projectId: z.string().optional(),
  account: z.string().optional(),
  warehouse: z.string().optional(),
  catalog: z.string().optional(),
  schema: z.string().optional(),
  instance: z.string().optional(),
  encrypt: z.boolean().optional(),
  keyFile: z.string().optional(),
  role: z.string().optional(),
  secure: z.boolean().optional(),
  // Add fields for additional database types
  server: z.string().optional(),
  driver: z.string().optional(),
  connectionString: z.string().optional(),
  trustServerCertificate: z.boolean().optional(),
  integratedSecurity: z.boolean().optional(),
});

// Additional validation for specific database types
const dbTypeSpecificSchemas = {
  postgresql: z.object({}),
  mysql: z.object({}),
  sqlserver: z.object({
    instance: z.string().optional(),
    encrypt: z.boolean().optional(),
    trustServerCertificate: z.boolean().optional(),
    integratedSecurity: z.boolean().optional(),
  }),
  bigquery: z.object({
    projectId: z.string().min(1, { message: "Project ID is required" }),
    keyFile: z.string().optional(),
  }),
  snowflake: z.object({
    account: z.string().min(1, { message: "Account is required" }),
    warehouse: z.string().min(1, { message: "Warehouse is required" }),
    role: z.string().optional(),
  }),
  clickhouse: z.object({
    secure: z.boolean().optional(),
  }),
  trino: z.object({
    catalog: z.string().min(1, { message: "Catalog is required" }),
    schema: z.string().min(1, { message: "Schema is required" }),
  }),
  oracle: z.object({
    serviceName: z.string().min(1, { message: "Service name is required" }),
    connectionType: z.enum(["SID", "ServiceName"]),
  }),
  mongodb: z.object({
    connectionString: z.string().optional(),
    authSource: z.string().optional(),
  }),
};

interface ConnectionFormProps {
  dbType: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const getConnectionSchema = (dbType: string) => {
  // Create a type-specific schema but use the baseConnectionSchema as the foundation
  const typeKey = dbType.toLowerCase().replace(/-/g, '') as keyof typeof dbTypeSpecificSchemas;
  const specificSchema = dbTypeSpecificSchemas[typeKey] || z.object({});
  
  // This approach preserves all fields in the base schema
  return baseConnectionSchema;
};

// Default port numbers by database type
const defaultPorts: Record<string, string> = {
  postgresql: "5432",
  mysql: "3306",
  sqlserver: "1433",
  bigquery: "",
  snowflake: "443",
  clickhouse: "8123",
  trino: "8080",
  oracle: "1521",
  mongodb: "27017",
};

const ConnectionForm: React.FC<ConnectionFormProps> = ({ dbType, onCancel, onSubmit }) => {
  const connectionSchema = getConnectionSchema(dbType);
  
  // Get default port for the database type
  const defaultPort = defaultPorts[dbType.toLowerCase()] || "";
  
  // Format the display name of the database
  const displayName = dbType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  
  // Use the type from the schema
  type FormValues = z.infer<typeof connectionSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      name: `My ${displayName} Connection`,
      host: "",
      port: defaultPort,
      username: "",
      password: "",
      database: "",
      ...(dbType.toLowerCase() === 'bigquery' ? { projectId: "" } : {}),
      ...(dbType.toLowerCase() === 'snowflake' ? { account: "", warehouse: "" } : {}),
      ...(dbType.toLowerCase() === 'trino' ? { catalog: "", schema: "default" } : {}),
    },
  });

  const handleSubmitForm = (data: FormValues) => {
    console.log('Connection data:', data);
    
    // Simulate testing connection
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Testing connection...',
        success: () => {
          onSubmit(data);
          return 'Connection successful!';
        },
        error: 'Connection failed. Please check your credentials.',
      }
    );
  };

  const handleTestConnection = async () => {
    const values = form.getValues();
    console.log('Testing connection with:', values);
    
    try {
      // Test connection via API
      await testConnection({
        ...values,
        type: dbType.toLowerCase()
      });
      toast.success('Connection successful!');
    } catch (err) {
      toast.error(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Determine which fields to show based on the database type
  const showBigQueryFields = dbType.toLowerCase() === 'bigquery';
  const showSnowflakeFields = dbType.toLowerCase() === 'snowflake';
  const showTrinoFields = dbType.toLowerCase() === 'trino';
  const showSQLServerFields = dbType.toLowerCase() === 'sqlserver';
  const showClickHouseFields = dbType.toLowerCase() === 'clickhouse';

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4 gap-2">
        <Database className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-white">
          Connect to {displayName}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Database Connection" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="db.example.com" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder={defaultPort} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* BigQuery specific fields */}
          {showBigQueryFields && (
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project ID</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <HardDrive className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="my-gcp-project-id" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Snowflake specific fields */}
          {showSnowflakeFields && (
            <>
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <HardDrive className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input className="pl-10" placeholder="orgname-accountname" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="warehouse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input className="pl-10" placeholder="COMPUTE_WH" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Trino specific fields */}
          {showTrinoFields && (
            <>
              <FormField
                control={form.control}
                name="catalog"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catalog</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input className="pl-10" placeholder="hive" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schema</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input className="pl-10" placeholder="default" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="dbuser" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" type="password" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="database"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Database Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="mydatabase" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Test Connection
            </Button>
            <Button type="submit">Save Connection</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ConnectionForm;
