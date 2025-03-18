
export class SQLQueryEngine {
  private tableData: Record<string, any[]>;

  constructor(tableData: Record<string, any[]>) {
    this.tableData = tableData;
  }

  executeQuery(query: string): { data: any[], count: number } {
    console.log('Executing query:', query);
    const queryLower = query.toLowerCase().trim();
    
    try {
      if (queryLower.includes('select')) {
        if (queryLower.includes('join')) {
          return this.handleJoinQuery(queryLower);
        }
        
        const fromMatch = queryLower.match(/from\s+(\w+)/i);
        if (!fromMatch) {
          throw new Error('Invalid query: Missing FROM clause or table name');
        }
        
        const tableName = fromMatch[1];
        
        if (!this.tableData[tableName]) {
          throw new Error(`Table "${tableName}" not found`);
        }
        
        let result = [...this.tableData[tableName]];
        const totalCount = result.length;
        
        if (queryLower.includes('where')) {
          result = this.applyWhereClause(result, queryLower);
        }
        
        if (queryLower.includes('group by')) {
          result = this.applyGroupByClause(result, queryLower);
        }
        
        if (queryLower.includes('having')) {
          result = this.applyHavingClause(result, queryLower);
        }
        
        if (queryLower.includes('order by')) {
          result = this.applyOrderByClause(result, queryLower);
        }
        
        const limitMatch = queryLower.match(/limit\s+(\d+)/i);
        if (limitMatch) {
          const limit = parseInt(limitMatch[1], 10);
          if (!isNaN(limit)) {
            result = result.slice(0, limit);
          }
        }
        
        return { data: result, count: totalCount };
      }
      
      throw new Error('Only SELECT queries are supported in this demo');
      
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }
  
  applyWhereClause(data: any[], query: string) {
    const whereMatch = query.match(/where\s+(.*?)(?:group by|having|order by|limit|$)/i);
    if (!whereMatch) return data;
    
    const whereClause = whereMatch[1].trim();
    
    return data.filter(row => {
      if (whereClause.includes('like')) {
        const likeMatch = whereClause.match(/(\w+)\s+like\s+'([^']*)'|(\w+)\s+like\s+"([^"]*)"/i);
        if (likeMatch) {
          const fieldName = likeMatch[1] || likeMatch[3];
          const pattern = likeMatch[2] || likeMatch[4];
          const rowValue = String(row[fieldName] || '').toLowerCase();
          
          if (pattern.startsWith('%') && pattern.endsWith('%')) {
            return rowValue.includes(pattern.slice(1, -1).toLowerCase());
          } else if (pattern.startsWith('%')) {
            return rowValue.endsWith(pattern.slice(1).toLowerCase());
          } else if (pattern.endsWith('%')) {
            return rowValue.startsWith(pattern.slice(0, -1).toLowerCase());
          } else {
            return rowValue === pattern.toLowerCase();
          }
        }
      }
      
      if (whereClause.includes('>')) {
        const gtMatch = whereClause.match(/(\w+)\s*>\s*(\d+(?:\.\d+)?)/i);
        if (gtMatch) {
          const [_, fieldName, value] = gtMatch;
          return parseFloat(String(row[fieldName])) > parseFloat(value);
        }
      }
      
      if (whereClause.includes('<')) {
        const ltMatch = whereClause.match(/(\w+)\s*<\s*(\d+(?:\.\d+)?)/i);
        if (ltMatch) {
          const [_, fieldName, value] = ltMatch;
          return parseFloat(String(row[fieldName])) < parseFloat(value);
        }
      }
      
      if (whereClause.includes('=')) {
        const eqMatch = whereClause.match(/(\w+)\s*=\s*'([^']*)'|(\w+)\s*=\s*"([^"]*)"|(\w+)\s*=\s*(\d+(?:\.\d+)?)/i);
        if (eqMatch) {
          const fieldName = eqMatch[1] || eqMatch[3] || eqMatch[5];
          const value = eqMatch[2] || eqMatch[4] || eqMatch[6];
          
          if (eqMatch[6]) { // Numeric comparison
            return parseFloat(String(row[fieldName])) === parseFloat(value);
          }
          
          return String(row[fieldName]).toLowerCase() === value.toLowerCase();
        }
      }
      
      return true;
    });
  }
  
  applyOrderByClause(data: any[], query: string) {
    const orderByMatch = query.match(/order by\s+(\w+)\s*(asc|desc)?/i);
    if (!orderByMatch) return data;
    
    const [_, fieldName, direction] = orderByMatch;
    const isDescending = direction && direction.toLowerCase() === 'desc';
    
    return [...data].sort((a, b) => {
      const valueA = a[fieldName];
      const valueB = b[fieldName];
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isDescending ? valueB - valueA : valueA - valueB;
      }
      
      const strA = String(valueA || '');
      const strB = String(valueB || '');
      
      return isDescending ? strB.localeCompare(strA) : strA.localeCompare(strB);
    });
  }
  
  applyGroupByClause(data: any[], query: string): any[] {
    const groupByMatch = query.match(/group by\s+(.*?)(?:having|order by|limit|$)/i);
    if (!groupByMatch) return data;
    
    const groupByFields = groupByMatch[1].split(',').map(f => f.trim());
    const groupedData: Record<string, any[]> = {};
    
    // Create groups based on the groupBy fields
    data.forEach(row => {
      const groupKey = groupByFields.map(field => row[field]).join('|');
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }
      groupedData[groupKey].push(row);
    });
    
    // Extract aggregation functions from the SELECT clause
    const selectMatch = query.match(/select\s+(.*?)\s+from/i);
    if (!selectMatch) return Object.values(groupedData).map(group => group[0]);
    
    const selectItems = selectMatch[1].split(',').map(item => item.trim());
    const result: any[] = [];
    
    Object.values(groupedData).forEach(group => {
      const resultRow: Record<string, any> = {};
      
      // For each item in the SELECT clause
      selectItems.forEach(item => {
        if (item === '*') {
          // For SELECT *, just use the first row of the group
          Object.assign(resultRow, group[0]);
        } else if (item.toLowerCase().includes('count(')) {
          // Handle COUNT aggregation
          const fieldMatch = item.match(/count\(\s*(.*?)\s*\)(?:\s+as\s+(\w+))?/i);
          if (fieldMatch) {
            const countField = fieldMatch[1] === '*' ? '*' : fieldMatch[1];
            const alias = fieldMatch[2] || `count_${countField}`;
            resultRow[alias] = countField === '*' ? group.length : group.filter(row => row[countField] !== undefined && row[countField] !== null).length;
          }
        } else if (item.toLowerCase().includes('sum(')) {
          // Handle SUM aggregation
          const fieldMatch = item.match(/sum\(\s*(.*?)\s*\)(?:\s+as\s+(\w+))?/i);
          if (fieldMatch) {
            const sumField = fieldMatch[1];
            const alias = fieldMatch[2] || `sum_${sumField}`;
            resultRow[alias] = group.reduce((sum, row) => sum + (parseFloat(row[sumField]) || 0), 0);
          }
        } else if (item.toLowerCase().includes('avg(')) {
          // Handle AVG aggregation
          const fieldMatch = item.match(/avg\(\s*(.*?)\s*\)(?:\s+as\s+(\w+))?/i);
          if (fieldMatch) {
            const avgField = fieldMatch[1];
            const alias = fieldMatch[2] || `avg_${avgField}`;
            const values = group.map(row => parseFloat(row[avgField])).filter(val => !isNaN(val));
            resultRow[alias] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
          }
        } else if (item.toLowerCase().includes('min(')) {
          // Handle MIN aggregation
          const fieldMatch = item.match(/min\(\s*(.*?)\s*\)(?:\s+as\s+(\w+))?/i);
          if (fieldMatch) {
            const minField = fieldMatch[1];
            const alias = fieldMatch[2] || `min_${minField}`;
            const values = group.map(row => parseFloat(row[minField])).filter(val => !isNaN(val));
            resultRow[alias] = values.length > 0 ? Math.min(...values) : null;
          }
        } else if (item.toLowerCase().includes('max(')) {
          // Handle MAX aggregation
          const fieldMatch = item.match(/max\(\s*(.*?)\s*\)(?:\s+as\s+(\w+))?/i);
          if (fieldMatch) {
            const maxField = fieldMatch[1];
            const alias = fieldMatch[2] || `max_${maxField}`;
            const values = group.map(row => parseFloat(row[maxField])).filter(val => !isNaN(val));
            resultRow[alias] = values.length > 0 ? Math.max(...values) : null;
          }
        } else {
          // For regular fields (non-aggregated), use the value from the first row
          const asMatch = item.match(/(\w+)(?:\s+as\s+(\w+))?/i);
          if (asMatch) {
            const field = asMatch[1];
            const alias = asMatch[2] || field;
            if (groupByFields.includes(field)) {
              resultRow[alias] = group[0][field];
            }
          }
        }
      });
      
      result.push(resultRow);
    });
    
    return result;
  }
  
  applyHavingClause(data: any[], query: string): any[] {
    const havingMatch = query.match(/having\s+(.*?)(?:order by|limit|$)/i);
    if (!havingMatch) return data;
    
    const havingClause = havingMatch[1].trim();
    
    return data.filter(row => {
      if (havingClause.includes('>')) {
        const gtMatch = havingClause.match(/(\w+)\s*>\s*(\d+(?:\.\d+)?)/i);
        if (gtMatch) {
          const [_, fieldName, value] = gtMatch;
          return parseFloat(String(row[fieldName])) > parseFloat(value);
        }
      }
      
      if (havingClause.includes('<')) {
        const ltMatch = havingClause.match(/(\w+)\s*<\s*(\d+(?:\.\d+)?)/i);
        if (ltMatch) {
          const [_, fieldName, value] = ltMatch;
          return parseFloat(String(row[fieldName])) < parseFloat(value);
        }
      }
      
      if (havingClause.includes('=')) {
        const eqMatch = havingClause.match(/(\w+)\s*=\s*(\d+(?:\.\d+)?)/i);
        if (eqMatch) {
          const [_, fieldName, value] = eqMatch;
          return parseFloat(String(row[fieldName])) === parseFloat(value);
        }
      }
      
      return true;
    });
  }
  
  handleJoinQuery(query: string): { data: any[], count: number } {
    // Extract table names from the JOIN clause
    const joinMatch = query.match(/from\s+(\w+)(?:\s+(?:as\s+)?(\w+))?.*?join\s+(\w+)(?:\s+(?:as\s+)?(\w+))?/i);
    
    if (!joinMatch) {
      throw new Error('Invalid JOIN syntax');
    }
    
    const table1 = joinMatch[1];
    const table1Alias = joinMatch[2] || table1;
    const table2 = joinMatch[3];
    const table2Alias = joinMatch[4] || table2;
    
    if (!this.tableData[table1] || !this.tableData[table2]) {
      throw new Error(`One or more tables in JOIN not found: ${table1}, ${table2}`);
    }
    
    // Extract the join condition
    const onMatch = query.match(/on\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i);
    if (!onMatch) {
      throw new Error('Invalid JOIN syntax: Missing ON clause');
    }
    
    const leftAlias = onMatch[1];
    const leftField = onMatch[2];
    const rightAlias = onMatch[3];
    const rightField = onMatch[4];
    
    // Determine which table is which in the join condition
    let leftTable, rightTable, leftTableName, rightTableName;
    
    if (leftAlias === table1Alias) {
      leftTable = this.tableData[table1];
      rightTable = this.tableData[table2];
      leftTableName = table1;
      rightTableName = table2;
    } else {
      leftTable = this.tableData[table2];
      rightTable = this.tableData[table1];
      leftTableName = table2;
      rightTableName = table1;
    }
    
    // Perform the join
    const results: any[] = [];
    
    for (const leftRow of leftTable) {
      for (const rightRow of rightTable) {
        if (leftRow[leftField] === rightRow[rightField]) {
          const joinedRow: Record<string, any> = {};
          
          // Add fields from both tables with appropriate aliases to avoid column name conflicts
          for (const key in leftRow) {
            joinedRow[`${leftTableName}_${key}`] = leftRow[key];
          }
          
          for (const key in rightRow) {
            joinedRow[`${rightTableName}_${key}`] = rightRow[key];
          }
          
          results.push(joinedRow);
        }
      }
    }
    
    const totalCount = results.length;
    
    // Apply WHERE clause if it exists
    let filteredResults = results;
    if (query.includes('where')) {
      filteredResults = this.applyWhereClause(results, query);
    }
    
    // Apply ORDER BY if it exists
    if (query.includes('order by')) {
      filteredResults = this.applyOrderByClause(filteredResults, query);
    }
    
    // Apply LIMIT if it exists
    const limitMatch = query.match(/limit\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      if (!isNaN(limit)) {
        filteredResults = filteredResults.slice(0, limit);
      }
    }
    
    return { data: filteredResults, count: totalCount };
  }
}
