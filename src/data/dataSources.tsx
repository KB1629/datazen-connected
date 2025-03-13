
import React from 'react';
import { ShoppingCart, LineChart, BarChart4, Database, Server, TabletSmartphone, BriefcaseBusiness, CreditCard, ShoppingBag, MessageCircle, MapPin, FileSpreadsheet } from 'lucide-react';

export const sampleDatasets = [
  {
    id: 'e-commerce',
    name: 'E-commerce',
    icon: <ShoppingCart className="w-5 h-5 text-orange-400" />,
    description: 'Complete e-commerce dataset with orders, products, customers, and reviews.',
  },
  {
    id: 'analytics',
    name: 'Web Analytics',
    icon: <LineChart className="w-5 h-5 text-blue-400" />,
    description: 'Website traffic, user engagement, and conversion metrics.',
  },
  {
    id: 'saas',
    name: 'SaaS Metrics',
    icon: <BarChart4 className="w-5 h-5 text-green-400" />,
    description: 'Subscription data, churn analysis, and customer lifetime value.',
  }
];

export const dataBoilerplates = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: <TabletSmartphone className="w-5 h-5 text-orange-400" />,
    description: 'Marketing automation and CRM data.',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    icon: <LineChart className="w-5 h-5 text-yellow-400" />,
    description: 'Website traffic and user behavior analytics.',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    icon: <ShoppingCart className="w-5 h-5 text-purple-400" />,
    beta: true,
    description: 'E-commerce platform data for WordPress sites.',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: <CreditCard className="w-5 h-5 text-blue-400" />,
    beta: true,
    description: 'Payment processing and subscription management.',
  },
  {
    id: 'facebook',
    name: 'Facebook Marketing',
    icon: <BriefcaseBusiness className="w-5 h-5 text-blue-500" />,
    beta: true,
    description: 'Social media marketing campaign data.',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    icon: <ShoppingBag className="w-5 h-5 text-blue-400" />,
    beta: true,
    description: 'Advertising metrics and campaign performance.',
  }
];

export const externalDataSources = [
  {
    id: 'bigquery',
    name: 'BigQuery',
    icon: <Database className="w-5 h-5 text-blue-400" />,
    description: 'Google Cloud data warehouse for analytics.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: <Server className="w-5 h-5 text-blue-600" />,
    description: 'Open-source relational database system.',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: <Database className="w-5 h-5 text-blue-500" />,
    description: 'Popular open-source relational database.',
  },
  {
    id: 'sql-server',
    name: 'SQL Server',
    icon: <Database className="w-5 h-5 text-red-400" />,
    description: 'Microsoft's enterprise database solution.',
  },
  {
    id: 'clickhouse',
    name: 'ClickHouse',
    icon: <FileSpreadsheet className="w-5 h-5 text-yellow-400" />,
    description: 'Column-oriented database for analytics.',
  },
  {
    id: 'trino',
    name: 'Trino',
    icon: <Database className="w-5 h-5 text-purple-400" />,
    description: 'Distributed SQL query engine for big data.',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    icon: <Server className="w-5 h-5 text-blue-300" />,
    description: 'Cloud data platform.',
  }
];
