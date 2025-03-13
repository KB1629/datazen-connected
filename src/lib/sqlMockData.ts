
// Mock database tables with row counts
export const mockTables = [
  { name: 'customers', rowCount: 1243 },
  { name: 'orders', rowCount: 5210 },
  { name: 'products', rowCount: 487 },
  { name: 'order_items', rowCount: 18652 },
  { name: 'employees', rowCount: 42 },
];

// Mock table schema data
export const mockTableSchemas = {
  customers: [
    { column: 'id', type: 'integer', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'name', type: 'varchar(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'email', type: 'varchar(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'phone', type: 'varchar(50)', primary: false, nullable: true, default: 'NULL' },
    { column: 'address', type: 'text', primary: false, nullable: true, default: 'NULL' },
    { column: 'orders', type: 'integer', primary: false, nullable: false, default: '0' },
    { column: 'total_spent', type: 'numeric', primary: false, nullable: false, default: '0.00' },
  ],
  orders: [
    { column: 'id', type: 'integer', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'customer_id', type: 'integer', primary: false, nullable: false, default: 'NULL' },
    { column: 'date', type: 'timestamp', primary: false, nullable: false, default: 'CURRENT_TIMESTAMP' },
    { column: 'status', type: 'varchar(50)', primary: false, nullable: false, default: "'pending'" },
    { column: 'total', type: 'numeric', primary: false, nullable: false, default: '0.00' },
  ],
  products: [
    { column: 'id', type: 'integer', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'name', type: 'varchar(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'category', type: 'varchar(100)', primary: false, nullable: true, default: 'NULL' },
    { column: 'price', type: 'numeric', primary: false, nullable: false, default: '0.00' },
    { column: 'stock', type: 'integer', primary: false, nullable: false, default: '0' },
  ],
  order_items: [
    { column: 'id', type: 'integer', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'order_id', type: 'integer', primary: false, nullable: false, default: 'NULL' },
    { column: 'product_id', type: 'integer', primary: false, nullable: false, default: 'NULL' },
    { column: 'quantity', type: 'integer', primary: false, nullable: false, default: '1' },
    { column: 'price', type: 'numeric', primary: false, nullable: false, default: '0.00' },
  ],
  employees: [
    { column: 'id', type: 'integer', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'name', type: 'varchar(50)', primary: false, nullable: false, default: 'NULL' },
    { column: 'position', type: 'varchar(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'department', type: 'varchar(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'hire_date', type: 'date', primary: false, nullable: false, default: 'NULL' },
  ],
};

// Mock data for tables
export const mockTableData = {
  customers: [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', orders: 5, total_spent: 529.95 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', orders: 3, total_spent: 129.85 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', address: '789 Pine Rd', orders: 12, total_spent: 1045.20 },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '555-3456', address: '101 Elm St', orders: 8, total_spent: 839.50 },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-7890', address: '202 Maple Dr', orders: 1, total_spent: 49.99 },
    { id: 6, name: 'James Wilson', email: 'james@example.com', phone: '555-2468', address: '303 Cedar St', orders: 7, total_spent: 678.45 },
    { id: 7, name: 'Jennifer Lee', email: 'jennifer@example.com', phone: '555-1357', address: '404 Birch Ln', orders: 4, total_spent: 312.75 },
    { id: 8, name: 'Michael Clark', email: 'michael@example.com', phone: '555-3690', address: '505 Walnut Ave', orders: 9, total_spent: 942.30 },
    { id: 9, name: 'Jessica Parker', email: 'jessica@example.com', phone: '555-8024', address: '606 Cherry St', orders: 2, total_spent: 87.50 },
    { id: 10, name: 'Daniel Wright', email: 'daniel@example.com', phone: '555-4713', address: '707 Pine Ave', orders: 6, total_spent: 421.60 },
  ],
  orders: [
    { id: 1, customer_id: 1, date: '2023-05-15', status: 'completed', total: 129.99 },
    { id: 2, customer_id: 3, date: '2023-05-16', status: 'shipped', total: 259.99 },
    { id: 3, customer_id: 2, date: '2023-05-17', status: 'processing', total: 59.99 },
    { id: 4, customer_id: 1, date: '2023-05-18', status: 'completed', total: 399.96 },
    { id: 5, customer_id: 4, date: '2023-05-19', status: 'shipped', total: 839.50 },
    { id: 6, customer_id: 3, date: '2023-05-20', status: 'completed', total: 129.99 },
    { id: 7, customer_id: 5, date: '2023-05-21', status: 'pending', total: 49.99 },
    { id: 8, customer_id: 6, date: '2023-05-22', status: 'completed', total: 189.97 },
    { id: 9, customer_id: 3, date: '2023-05-23', status: 'shipped', total: 299.99 },
    { id: 10, customer_id: 7, date: '2023-05-24', status: 'processing', total: 159.98 },
  ],
  products: [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 45 },
    { id: 2, name: 'Smartphone', category: 'Electronics', price: 599.99, stock: 120 },
    { id: 3, name: 'Coffee Maker', category: 'Kitchen', price: 79.99, stock: 32 },
    { id: 4, name: 'Running Shoes', category: 'Apparel', price: 89.99, stock: 65 },
    { id: 5, name: 'Bluetooth Speaker', category: 'Electronics', price: 49.99, stock: 80 },
    { id: 6, name: 'Gaming Console', category: 'Electronics', price: 499.99, stock: 15 },
    { id: 7, name: 'Blender', category: 'Kitchen', price: 69.99, stock: 28 },
    { id: 8, name: 'Winter Jacket', category: 'Apparel', price: 129.99, stock: 42 },
    { id: 9, name: 'Wireless Earbuds', category: 'Electronics', price: 129.99, stock: 95 },
    { id: 10, name: 'Smart Watch', category: 'Electronics', price: 249.99, stock: 53 },
  ],
  order_items: [
    { id: 1, order_id: 1, product_id: 2, quantity: 1, price: 599.99 },
    { id: 2, order_id: 1, product_id: 3, quantity: 1, price: 79.99 },
    { id: 3, order_id: 2, product_id: 1, quantity: 1, price: 999.99 },
    { id: 4, order_id: 3, product_id: 5, quantity: 2, price: 99.98 },
    { id: 5, order_id: 4, product_id: 4, quantity: 1, price: 89.99 },
    { id: 6, order_id: 4, product_id: 7, quantity: 1, price: 69.99 },
    { id: 7, order_id: 5, product_id: 6, quantity: 1, price: 499.99 },
    { id: 8, order_id: 5, product_id: 9, quantity: 1, price: 129.99 },
    { id: 9, order_id: 6, product_id: 3, quantity: 1, price: 79.99 },
    { id: 10, order_id: 7, product_id: 5, quantity: 1, price: 49.99 },
  ],
  employees: [
    { id: 1, name: 'Michael Scott', position: 'Regional Manager', department: 'Management', hire_date: '2005-03-24' },
    { id: 2, name: 'Jim Halpert', position: 'Sales Representative', department: 'Sales', hire_date: '2006-01-15' },
    { id: 3, name: 'Pam Beesly', position: 'Receptionist', department: 'Administration', hire_date: '2005-05-10' },
    { id: 4, name: 'Dwight Schrute', position: 'Assistant Regional Manager', department: 'Sales', hire_date: '2005-04-01' },
    { id: 5, name: 'Angela Martin', position: 'Accountant', department: 'Finance', hire_date: '2005-06-12' },
    { id: 6, name: 'Kevin Malone', position: 'Accountant', department: 'Finance', hire_date: '2006-03-15' },
    { id: 7, name: 'Oscar Martinez', position: 'Accountant', department: 'Finance', hire_date: '2005-09-22' },
    { id: 8, name: 'Stanley Hudson', position: 'Sales Representative', department: 'Sales', hire_date: '2005-05-05' },
    { id: 9, name: 'Phyllis Vance', position: 'Sales Representative', department: 'Sales', hire_date: '2006-02-14' },
    { id: 10, name: 'Meredith Palmer', position: 'Supplier Relations', department: 'Operations', hire_date: '2007-01-10' },
  ]
};
