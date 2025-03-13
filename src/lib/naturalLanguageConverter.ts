
// Types of SQL queries that can be generated
type QueryType = 
  | 'select_all' 
  | 'filter_equals' 
  | 'filter_contains'
  | 'filter_starts_with'
  | 'filter_greater_than'
  | 'filter_less_than'
  | 'sort_ascending'
  | 'sort_descending'
  | 'aggregate_count'
  | 'aggregate_sum'
  | 'aggregate_avg'
  | 'aggregate_min'
  | 'aggregate_max'
  | 'join_tables'
  | 'select_specific';

interface QueryPattern {
  pattern: RegExp;
  queryType: QueryType;
  generateSQL: (match: RegExpMatchArray, tableName: string | null) => string;
}

// Named entity recognition for tables
const tableNamePatterns: Record<string, RegExp[]> = {
  'customers': [/customer/i, /client/i, /buyer/i, /purchaser/i],
  'orders': [/order/i, /purchase/i, /transaction/i, /sale/i],
  'products': [/product/i, /item/i, /merchandise/i, /good/i],
  'order_items': [/order item/i, /line item/i, /order detail/i, /order line/i],
  'employees': [/employee/i, /staff/i, /worker/i, /personnel/i]
};

// Named entity recognition for columns
const columnNamePatterns: Record<string, Record<string, RegExp[]>> = {
  'customers': {
    'id': [/customer id/i, /customer number/i, /client id/i],
    'name': [/customer name/i, /client name/i, /name/i],
    'email': [/email/i, /mail/i],
    'phone': [/phone/i, /telephone/i, /contact number/i],
    'address': [/address/i, /location/i],
    'orders': [/order count/i, /number of orders/i, /orders/i],
    'total_spent': [/total spent/i, /total purchases/i, /spending/i, /spent/i]
  },
  'orders': {
    'id': [/order id/i, /order number/i],
    'customer_id': [/customer id/i, /client id/i],
    'date': [/order date/i, /date/i, /purchased on/i],
    'status': [/status/i, /order status/i, /state/i],
    'total': [/total/i, /amount/i, /price/i]
  },
  'products': {
    'id': [/product id/i, /item id/i],
    'name': [/product name/i, /item name/i, /name/i],
    'category': [/category/i, /type/i],
    'price': [/price/i, /cost/i],
    'stock': [/stock/i, /inventory/i, /quantity/i, /available/i]
  }
};

// Operator keywords
const operatorKeywords: Record<string, RegExp[]> = {
  'equals': [/equals/i, /equal to/i, /is/i, /=/i],
  'contains': [/contains/i, /include/i, /has/i, /with/i],
  'starts_with': [/starts with/i, /begins with/i],
  'ends_with': [/ends with/i],
  'greater_than': [/greater than/i, /more than/i, /higher than/i, />/i, /over/i, /is greater/i, /greater/i],
  'less_than': [/less than/i, /lower than/i, /under/i, /</i, /below/i]
};

// Aggregate function keywords
const aggregateKeywords: Record<string, RegExp[]> = {
  'count': [/count/i, /how many/i, /number of/i],
  'sum': [/sum/i, /total/i, /add up/i],
  'average': [/average/i, /avg/i, /mean/i],
  'minimum': [/minimum/i, /min/i, /lowest/i, /smallest/i],
  'maximum': [/maximum/i, /max/i, /highest/i, /largest/i]
};

// Sort keywords
const sortKeywords: Record<string, RegExp[]> = {
  'ascending': [/ascending/i, /asc/i, /increasing/i, /smallest first/i, /lowest first/i],
  'descending': [/descending/i, /desc/i, /decreasing/i, /largest first/i, /highest first/i]
};

// Join keywords
const joinKeywords: RegExp[] = [
  /join/i, 
  /combine/i, 
  /merge/i, 
  /connect/i,
  /relationship/i,
  /related/i
];

// Pattern matching for different types of natural language queries
const queryPatterns: QueryPattern[] = [
  // Pattern for selecting specific fields
  {
    pattern: /(?:select|show|get|list|find) (?:the |)(?:customer |)(?:name|names)(?:s|) (?:of |from |in |)(?:all |)(?:the |)(?:customer|customers|client|clients)(?:s|) (?:where |with |that |who |)(?:have |has |)(?:the |)(?:number of |)order(?:s|) (?:is |are |)(?:greater than|more than|over|above|>=|>|equal to|=) (\d+)(?:\s|$|\.)/i,
    queryType: 'select_specific',
    generateSQL: (match, tableName) => {
      const detectedTable = tableName || 'customers';
      const value = match[1];
      
      return `SELECT name FROM ${detectedTable} WHERE orders >= ${value}`;
    }
  },

  // Pattern for selecting all records from a table
  {
    pattern: /show (?:me |all |)(?:the |)(.+?)(?:\s|$)/i,
    queryType: 'select_all',
    generateSQL: (match, tableName) => {
      const detectedTable = tableName || detectTableName(match[1]) || 'customers';
      return `SELECT * FROM ${detectedTable} LIMIT 100`;
    }
  },
  
  // Pattern for filtering where column value equals something
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(.+?) (?:where|with) (.+?) (?:is|=|equals|equal to) ['"]?(.+?)['"]?(?:\s|$|\.)/i,
    queryType: 'filter_equals',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const columnHint = match[2];
      const column = detectColumnName(detectedTable, columnHint) || columnHint;
      const value = match[3];
      
      return `SELECT * FROM ${detectedTable} WHERE ${column} = '${value}' LIMIT 100`;
    }
  },
  
  // Pattern for filtering with LIKE for contains
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(.+?) (?:where|with) (.+?) (?:contains|includes|has) ['"]?(.+?)['"]?(?:\s|$|\.)/i,
    queryType: 'filter_contains',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const columnHint = match[2];
      const column = detectColumnName(detectedTable, columnHint) || columnHint;
      const value = match[3];
      
      return `SELECT * FROM ${detectedTable} WHERE ${column} LIKE '%${value}%' LIMIT 100`;
    }
  },
  
  // Pattern for filtering with LIKE for starts with
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(.+?) (?:where|with) (.+?) (?:starts with|begins with) ['"]?(.+?)['"]?(?:\s|$|\.)/i,
    queryType: 'filter_starts_with',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const columnHint = match[2];
      const column = detectColumnName(detectedTable, columnHint) || columnHint;
      const value = match[3];
      
      return `SELECT * FROM ${detectedTable} WHERE ${column} LIKE '${value}%' LIMIT 100`;
    }
  },
  
  // Pattern for filtering where column value is greater than something
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(.+?) (?:where|with) (.+?) (?:is |)(?:greater than|more than|over|above|>|higher than) (\d+(?:\.\d+)?)(?:\s|$|\.)/i,
    queryType: 'filter_greater_than',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const columnHint = match[2];
      const column = detectColumnName(detectedTable, columnHint) || columnHint;
      const value = match[3];
      
      return `SELECT * FROM ${detectedTable} WHERE ${column} > ${value} ORDER BY ${column} DESC LIMIT 100`;
    }
  },
  
  // Pattern for filtering where column value is less than something
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(.+?) (?:where|with) (.+?) (?:is |)(?:less than|under|below|<|lower than) (\d+(?:\.\d+)?)(?:\s|$|\.)/i,
    queryType: 'filter_less_than',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const columnHint = match[2];
      const column = detectColumnName(detectedTable, columnHint) || columnHint;
      const value = match[3];
      
      return `SELECT * FROM ${detectedTable} WHERE ${column} < ${value} ORDER BY ${column} ASC LIMIT 100`;
    }
  },
  
  // Pattern for ordering results
  {
    pattern: /(?:find|show|get|list|sort|order) (?:me |all |)(.+?) (?:by|ordered by|sorted by) (.+?) (?:in |)(?:ascending|asc|increasing)(?:\s|$|\.)/i,
    queryType: 'sort_ascending',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const columnHint = match[2];
      const column = detectColumnName(detectedTable, columnHint) || columnHint;
      
      return `SELECT * FROM ${detectedTable} ORDER BY ${column} ASC LIMIT 100`;
    }
  },
  
  // Pattern for ordering results in descending order
  {
    pattern: /(?:find|show|get|list|sort|order) (?:me |all |)(.+?) (?:by|ordered by|sorted by) (.+?) (?:in |)(?:descending|desc|decreasing)(?:\s|$|\.)/i,
    queryType: 'sort_descending',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const columnHint = match[2];
      const column = detectColumnName(detectedTable, columnHint) || columnHint;
      
      return `SELECT * FROM ${detectedTable} ORDER BY ${column} DESC LIMIT 100`;
    }
  },
  
  // Pattern for customers with orders greater than a value
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(?:the |)(.+?) (?:where|with) (?:number of |)orders(?: is| are|) (?:greater than|more than|over|above|>|at least) (\d+)(?:\s|$|\.)/i,
    queryType: 'filter_greater_than',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const value = match[2];
      
      return `SELECT * FROM ${detectedTable} WHERE orders >= ${value} ORDER BY orders DESC LIMIT 100`;
    }
  },
  
  // Pattern for name searches (special case for common query)
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(.+?) (?:with|where) (?:the |)name (?:is|=|equals|contains|includes|has|starts with|begins with) ['"]?(.+?)['"]?(?:\s|$|\.)/i,
    queryType: 'filter_contains',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      const value = match[2];
      
      // Check if the match suggests "starts with" or "contains"
      if (match[0].includes('starts with') || match[0].includes('begins with')) {
        return `SELECT * FROM ${detectedTable} WHERE name LIKE '${value}%' LIMIT 100`;
      }
      
      // Default to "contains" search for name
      return `SELECT * FROM ${detectedTable} WHERE name LIKE '%${value}%' LIMIT 100`;
    }
  },
  
  // Pattern for status searches (special case for common query)
  {
    pattern: /(?:find|show|get|list) (?:me |all |)(.+?) (?:with|where) (?:the |)status (?:is|=|equals) ['"]?(.+?)['"]?(?:\s|$|\.)/i,
    queryType: 'filter_equals',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'orders';
      const value = match[2];
      
      return `SELECT * FROM ${detectedTable} WHERE status = '${value}' ORDER BY date DESC LIMIT 100`;
    }
  },
  
  // Pattern for counting records
  {
    pattern: /(?:count|how many) (.+?) (?:are there|do we have|exist)(?:\s|$|\.)/i,
    queryType: 'aggregate_count',
    generateSQL: (match, tableName) => {
      const tableHint = match[1];
      const detectedTable = tableName || detectTableName(tableHint) || 'customers';
      
      return `SELECT COUNT(*) as count FROM ${detectedTable}`;
    }
  }
];

// Function to detect table name from natural language
function detectTableName(text: string): string | null {
  for (const [tableName, patterns] of Object.entries(tableNamePatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return tableName;
      }
    }
  }
  return null;
}

// Function to detect column name from natural language
function detectColumnName(tableName: string, text: string): string | null {
  const columnPatterns = columnNamePatterns[tableName];
  if (!columnPatterns) return null;
  
  for (const [columnName, patterns] of Object.entries(columnPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return columnName;
      }
    }
  }
  return null;
}

// Function to convert natural language to SQL
export function convertNaturalLanguageToSQL(query: string, selectedTable: string | null = null): string {
  // Special case for customers with orders greater than or equal to a value
  const ordersGreaterThanMatch = query.match(/(?:select|show|get|list|find) (?:the |)(?:customer |)(?:name|names)(?:s|) (?:from |of |in |)(?:all |)(?:the |)(?:customer|customers|client|clients)(?:s|) (?:where |with |that |who |)(?:have |has |)(?:the |)(?:number of |)order(?:s|) (?:is |are |)(?:greater than|more than|over|above|>=|>|equal to|=) (\d+)(?:\s|$|\.)/i);
  if (ordersGreaterThanMatch) {
    const value = ordersGreaterThanMatch[1];
    return `SELECT name FROM customers WHERE orders >= ${value}`;
  }
  
  // Check for specific patterns
  for (const patternObj of queryPatterns) {
    const match = query.match(patternObj.pattern);
    if (match) {
      return patternObj.generateSQL(match, selectedTable);
    }
  }
  
  // Special case pattern: show customers with name starting with J
  const startsWithNameMatch = query.match(/(?:show|find|get|list) (?:me |all |)(.+?) (?:with|where) (?:the |)name (?:starts with|beginning with) ['"]?(.+?)['"]?(?:\s|$|\.)/i);
  if (startsWithNameMatch) {
    const tableHint = startsWithNameMatch[1];
    const detectedTable = selectedTable || detectTableName(tableHint) || 'customers';
    const value = startsWithNameMatch[2];
    return `SELECT * FROM ${detectedTable} WHERE name LIKE '${value}%' LIMIT 100`;
  }
  
  // Simple fallback patterns for specific tables
  if (query.toLowerCase().includes('customer') && query.toLowerCase().includes('spent')) {
    // Infer query about customers who spent more than a certain amount
    const spentMatch = query.match(/(\d+(?:\.\d+)?)/);
    const amount = spentMatch ? spentMatch[1] : '100';
    return `SELECT * FROM customers WHERE total_spent > ${amount} ORDER BY total_spent DESC LIMIT 10`;
  }
  
  if (query.toLowerCase().includes('product') && query.toLowerCase().includes('stock')) {
    // Infer query about products with low stock
    return `SELECT * FROM products WHERE stock < 50 ORDER BY stock ASC LIMIT 100`;
  }
  
  if (query.toLowerCase().includes('completed') && query.toLowerCase().includes('order')) {
    // Infer query about completed orders
    return `SELECT * FROM orders WHERE status = 'completed' ORDER BY date DESC LIMIT 100`;
  }
  
  if (query.toLowerCase().includes('electronics')) {
    // Infer query about electronics products
    return `SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 100`;
  }
  
  // If no pattern matches but we have a selected table, use a default query for that table
  if (selectedTable) {
    return `SELECT * FROM ${selectedTable} LIMIT 100`;
  }
  
  // Default fallback
  return `SELECT * FROM customers LIMIT 100`;
}
