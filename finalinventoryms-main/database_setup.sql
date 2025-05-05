-- Create tables first
CREATE TABLE products (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    description VARCHAR(500),
    created_date DATE DEFAULT (CURRENT_DATE),
    last_updated DATE DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB;

CREATE TABLE categories (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    items INT DEFAULT 0,
    created_on DATE DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB;

CREATE TABLE customers (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_date DATE DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB;

CREATE TABLE orders (
    id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    date DATE DEFAULT (CURRENT_DATE),
    status VARCHAR(20) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE order_details (
    id VARCHAR(10) PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL,
    product_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE employees (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    department VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE warehouses (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manager VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(200) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    capacity_total INT NOT NULL,
    capacity_used INT NOT NULL
) ENGINE=InnoDB;

-- Insert Categories
INSERT INTO categories (id, name, description, items, created_on) VALUES
('CAT-001', 'Electronics', 'Electronic devices and accessories', 150, '2024-01-15'),
('CAT-002', 'Furniture', 'Home and office furniture', 75, '2024-01-16'),
('CAT-003', 'Clothing', 'Apparel and accessories', 200, '2024-01-17'),
('CAT-004', 'Books', 'Books and publications', 320, '2024-01-18'),
('CAT-005', 'Sports', 'Sports equipment and gear', 100, '2024-01-19'),
('CAT-006', 'Home Decor', 'Decorative items for home', 120, '2024-01-20'),
('CAT-007', 'Toys', 'Children''s toys and games', 180, '2024-01-21'),
('CAT-008', 'Beauty', 'Beauty and personal care products', 90, '2024-01-22'),
('CAT-009', 'Automotive', 'Car parts and accessories', 60, '2024-01-23'),
('CAT-010', 'Garden', 'Garden tools and supplies', 85, '2024-01-24');

-- Insert Products
INSERT INTO products (id, name, category, price, stock) VALUES
('PRD-001', 'Wireless Headphones', 'Electronics', 99.99, 45),
('PRD-002', 'Office Chair', 'Furniture', 199.95, 12),
('PRD-003', 'Cotton T-shirt', 'Clothing', 19.99, 200),
('PRD-004', 'Smartphone', 'Electronics', 699.99, 28),
('PRD-005', 'Coffee Table', 'Furniture', 149.95, 8),
('PRD-006', 'Denim Jeans', 'Clothing', 39.99, 150),
('PRD-007', 'Bluetooth Speaker', 'Electronics', 79.99, 35),
('PRD-008', 'Bookshelf', 'Furniture', 89.95, 15),
('PRD-009', 'Hooded Sweatshirt', 'Clothing', 49.99, 80),
('PRD-010', 'Tablet', 'Electronics', 349.99, 18),
('PRD-011', 'Desk', 'Furniture', 179.95, 10),
('PRD-012', 'Running Shoes', 'Clothing', 89.99, 60),
('PRD-013', 'Smart Watch', 'Electronics', 199.99, 25),
('PRD-014', 'Dining Chair Set', 'Furniture', 399.95, 6),
('PRD-015', 'Winter Jacket', 'Clothing', 129.99, 40);

-- Insert Customers
INSERT INTO customers (id, name, city, state, zipcode) VALUES
('CUST-001', 'John Doe', 'Los Angeles', 'California', '90001'),
('CUST-002', 'Alice Smith', 'Houston', 'Texas', '77001'),
('CUST-003', 'Robert Brown', 'New York', 'New York', '10001'),
('CUST-004', 'Sarah Johnson', 'Chicago', 'Illinois', '60601'),
('CUST-005', 'Michael Williams', 'Phoenix', 'Arizona', '85001'),
('CUST-006', 'Emily Davis', 'Philadelphia', 'Pennsylvania', '19101'),
('CUST-007', 'David Miller', 'San Antonio', 'Texas', '78205'),
('CUST-008', 'Jennifer Wilson', 'San Diego', 'California', '92101'),
('CUST-009', 'James Taylor', 'Dallas', 'Texas', '75201'),
('CUST-010', 'Elizabeth Anderson', 'San Jose', 'California', '95101'),
('CUST-011', 'Richard Martinez', 'Seattle', 'Washington', '98101'),
('CUST-012', 'Patricia Thomas', 'Denver', 'Colorado', '80201'),
('CUST-013', 'Charles White', 'Boston', 'Massachusetts', '02108'),
('CUST-014', 'Linda Garcia', 'Austin', 'Texas', '73301'),
('CUST-015', 'Joseph Lee', 'Portland', 'Oregon', '97201'),
('CUST-016', 'Mary Rodriguez', 'Miami', 'Florida', '33101'),
('CUST-017', 'Thomas Walker', 'Atlanta', 'Georgia', '30301'),
('CUST-018', 'Karen Hernandez', 'Detroit', 'Michigan', '48201'),
('CUST-019', 'Daniel King', 'Charlotte', 'North Carolina', '28201');

-- Insert Employees
INSERT INTO employees (id, name, position, department, email, phone) VALUES
('EMP-001', 'John Smith', 'Sales Manager', 'Sales', 'john.smith@example.com', '123-456-7890'),
('EMP-002', 'Emily Johnson', 'Marketing Coordinator', 'Marketing', 'emily.johnson@example.com', '987-654-3210'),
('EMP-003', 'Michael Brown', 'Software Engineer', 'IT', 'michael.brown@example.com', '555-123-4567'),
('EMP-004', 'Sarah Williams', 'HR Specialist', 'HR', 'sarah.williams@example.com', '111-222-3333'),
('EMP-005', 'David Miller', 'Accountant', 'Finance', 'david.miller@example.com', '444-555-6666');

-- Insert Warehouses
INSERT INTO warehouses (id, name, manager, phone, address, city, state, zip, capacity_total, capacity_used) VALUES
('WH-001', 'East Distribution Center', 'John Smith', '555-123-4567', '123 Commerce St', 'New York', 'New York', '10001', 50000, 35000),
('WH-002', 'West Distribution Center', 'Sarah Johnson', '555-234-5678', '456 Industry Ave', 'Los Angeles', 'California', '90001', 65000, 42000),
('WH-003', 'Central Warehouse', 'Michael Brown', '555-345-6789', '789 Logistics Blvd', 'Chicago', 'Illinois', '60601', 45000, 38000),
('WH-004', 'South Distribution Center', 'Emily Davis', '555-456-7890', '101 Storage Way', 'Houston', 'Texas', '77001', 70000, 30000),
('WH-005', 'Northwest Facility', 'David Miller', '555-567-8901', '202 Warehouse Rd', 'Seattle', 'Washington', '98101', 35000, 28000),
('WH-006', 'Southeast Facility', 'Jennifer Wilson', '555-678-9012', '303 Freight St', 'Miami', 'Florida', '33101', 40000, 22000);

-- Insert Orders
INSERT INTO orders (id, date, customer_id, status, total) VALUES
('ORD-001', '2025-05-01', 'CUST-001', 'Completed', 350.00),
('ORD-002', '2025-04-30', 'CUST-002', 'Processing', 125.50),
('ORD-003', '2025-04-29', 'CUST-003', 'Pending', 780.00),
('ORD-004', '2025-04-28', 'CUST-004', 'Completed', 92.75),
('ORD-005', '2025-04-27', 'CUST-005', 'Processing', 215.25);

-- Insert Order Details
INSERT INTO order_details (id, order_id, product_id, quantity, price) VALUES
('OD-001', 'ORD-001', 'PRD-001', 1, 99.99),
('OD-002', 'ORD-001', 'PRD-007', 2, 79.99),
('OD-003', 'ORD-001', 'PRD-003', 1, 19.99),
('OD-004', 'ORD-002', 'PRD-003', 2, 19.99),
('OD-005', 'ORD-002', 'PRD-006', 1, 39.99),
('OD-006', 'ORD-002', 'PRD-003', 3, 8.49),
('OD-007', 'ORD-003', 'PRD-002', 1, 199.95),
('OD-008', 'ORD-003', 'PRD-011', 1, 179.95),
('OD-009', 'ORD-003', 'PRD-008', 2, 39.99),
('OD-010', 'ORD-003', 'PRD-008', 1, 89.95),
('OD-011', 'ORD-003', 'PRD-003', 3, 19.99),
('OD-012', 'ORD-004', 'PRD-003', 1, 19.99),
('OD-013', 'ORD-004', 'PRD-003', 1, 24.99),
('OD-014', 'ORD-004', 'PRD-003', 3, 15.99),
('OD-015', 'ORD-005', 'PRD-013', 1, 199.99),
('OD-016', 'ORD-005', 'PRD-003', 1, 15.25); 