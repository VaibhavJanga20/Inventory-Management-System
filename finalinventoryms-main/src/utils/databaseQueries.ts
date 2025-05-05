
/**
 * Database Queries Documentation
 * 
 * This file documents the PL/SQL queries, cursors, and triggers that would be used
 * in the backend database to generate the data for the frontend reports.
 * 
 * Note: These are not actually executed in this frontend application but represent
 * what would be used in a real backend implementation.
 */

/**
 * Products Report - Category Distribution
 * 
 * This cursor fetches products grouped by category to generate the pie chart in the Products report.
 */
export const productsByCategoryQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor to fetch products by category
  CURSOR category_cursor IS
    SELECT category, COUNT(*) as item_count
    FROM products
    GROUP BY category
    ORDER BY item_count DESC;
    
  -- Variables for cursor
  v_category products.category%TYPE;
  v_count NUMBER;
  v_total_products NUMBER := 0;
  
BEGIN
  -- Get total count of products
  SELECT COUNT(*) INTO v_total_products FROM products;
  
  DBMS_OUTPUT.PUT_LINE('Product Category Distribution Report');
  DBMS_OUTPUT.PUT_LINE('----------------------------------');
  
  -- Loop through categories
  FOR category_rec IN category_cursor LOOP
    v_category := category_rec.category;
    v_count := category_rec.item_count;
    
    DBMS_OUTPUT.PUT_LINE(
      v_category || ': ' || 
      v_count || ' products (' || 
      ROUND((v_count / v_total_products) * 100, 2) || '%)'
    );
  END LOOP;
END;
/
`;

/**
 * Products Report - Price Range Distribution
 * 
 * This cursor analyzes product price ranges to generate the bar chart in the Products report.
 */
export const productsByPriceRangeQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for price ranges
  CURSOR price_range_cursor IS
    SELECT 
      CASE
        WHEN price BETWEEN 0 AND 25 THEN '$0-$25'
        WHEN price BETWEEN 25.01 AND 50 THEN '$25-$50'
        WHEN price BETWEEN 50.01 AND 100 THEN '$50-$100'
        WHEN price BETWEEN 100.01 AND 200 THEN '$100-$200'
        ELSE '$200+'
      END as price_range,
      COUNT(*) as count
    FROM products
    GROUP BY 
      CASE
        WHEN price BETWEEN 0 AND 25 THEN '$0-$25'
        WHEN price BETWEEN 25.01 AND 50 THEN '$25-$50'
        WHEN price BETWEEN 50.01 AND 100 THEN '$50-$100'
        WHEN price BETWEEN 100.01 AND 200 THEN '$100-$200'
        ELSE '$200+'
      END
    ORDER BY 
      CASE price_range
        WHEN '$0-$25' THEN 1
        WHEN '$25-$50' THEN 2
        WHEN '$50-$100' THEN 3
        WHEN '$100-$200' THEN 4
        ELSE 5
      END;
      
  -- Variables
  v_range VARCHAR2(20);
  v_count NUMBER;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Product Price Range Distribution');
  DBMS_OUTPUT.PUT_LINE('--------------------------------');
  
  FOR range_rec IN price_range_cursor LOOP
    v_range := range_rec.price_range;
    v_count := range_rec.count;
    
    DBMS_OUTPUT.PUT_LINE(v_range || ': ' || v_count || ' products');
  END LOOP;
END;
/
`;

/**
 * Products Report - Top Products by Stock
 * 
 * This cursor fetches the top products by stock quantity.
 */
export const topProductsByStockQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for top products by stock
  CURSOR top_stock_cursor IS
    SELECT id, name, category, price, stock
    FROM products
    ORDER BY stock DESC
    FETCH FIRST 5 ROWS ONLY;
    
  -- Record type for product
  TYPE product_rec_type IS RECORD (
    id products.id%TYPE,
    name products.name%TYPE,
    category products.category%TYPE,
    price products.price%TYPE,
    stock products.stock%TYPE
  );
  
  -- Product record
  v_product product_rec_type;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Top 5 Products by Stock');
  DBMS_OUTPUT.PUT_LINE('----------------------');
  
  OPEN top_stock_cursor;
  
  LOOP
    FETCH top_stock_cursor INTO v_product;
    EXIT WHEN top_stock_cursor%NOTFOUND;
    
    DBMS_OUTPUT.PUT_LINE(
      'ID: ' || v_product.id || 
      ', Name: ' || v_product.name ||
      ', Category: ' || v_product.category ||
      ', Price: $' || TO_CHAR(v_product.price, '999,999.99') ||
      ', Stock: ' || v_product.stock
    );
  END LOOP;
  
  CLOSE top_stock_cursor;
END;
/
`;

/**
 * Products Report - Products by Category Breakdown
 * 
 * This nested cursor fetches detailed information for each product within each category.
 */
export const productsByCategoryDetailQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for categories
  CURSOR category_cursor IS
    SELECT DISTINCT category
    FROM products
    ORDER BY category;
    
  -- Nested cursor for products in a category
  CURSOR products_in_category_cursor(p_category products.category%TYPE) IS
    SELECT id, name, price, stock
    FROM products
    WHERE category = p_category
    ORDER BY name;
    
  -- Variable for category
  v_category products.category%TYPE;
  
  -- Variables for product details
  v_id products.id%TYPE;
  v_name products.name%TYPE;
  v_price products.price%TYPE;
  v_stock products.stock%TYPE;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Products By Category Breakdown');
  DBMS_OUTPUT.PUT_LINE('-----------------------------');
  
  -- Loop through categories
  FOR cat_rec IN category_cursor LOOP
    v_category := cat_rec.category;
    
    DBMS_OUTPUT.PUT_LINE('Category: ' || v_category);
    DBMS_OUTPUT.PUT_LINE('-------------------');
    
    -- Loop through products in this category
    OPEN products_in_category_cursor(v_category);
    LOOP
      FETCH products_in_category_cursor INTO v_id, v_name, v_price, v_stock;
      EXIT WHEN products_in_category_cursor%NOTFOUND;
      
      DBMS_OUTPUT.PUT_LINE(
        'Product: ' || v_name || 
        ', Price: $' || TO_CHAR(v_price, '999,999.99') || 
        ', Stock: ' || v_stock
      );
    END LOOP;
    CLOSE products_in_category_cursor;
    
    DBMS_OUTPUT.PUT_LINE('');
  END LOOP;
END;
/
`;

/**
 * Inventory Report - Stock Status Distribution
 * 
 * This cursor analyzes inventory status to generate the pie chart in the Inventory report.
 */
export const inventoryStatusQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for inventory status
  CURSOR inventory_status_cursor IS
    SELECT 
      CASE
        WHEN status = 'In Stock' THEN 'In Stock'
        WHEN status = 'Low Stock' THEN 'Low Stock'
        WHEN status = 'Out of Stock' THEN 'Out of Stock'
      END as status,
      COUNT(*) as count
    FROM inventory
    GROUP BY status
    ORDER BY 
      CASE status
        WHEN 'In Stock' THEN 1
        WHEN 'Low Stock' THEN 2
        WHEN 'Out of Stock' THEN 3
      END;
      
  -- Variables
  v_status inventory.status%TYPE;
  v_count NUMBER;
  v_total_items NUMBER := 0;
  
BEGIN
  -- Get total count of inventory items
  SELECT COUNT(*) INTO v_total_items FROM inventory;
  
  DBMS_OUTPUT.PUT_LINE('Inventory Status Distribution');
  DBMS_OUTPUT.PUT_LINE('----------------------------');
  
  FOR status_rec IN inventory_status_cursor LOOP
    v_status := status_rec.status;
    v_count := status_rec.count;
    
    DBMS_OUTPUT.PUT_LINE(
      v_status || ': ' || 
      v_count || ' items (' || 
      ROUND((v_count / v_total_items) * 100, 2) || '%)'
    );
  END LOOP;
END;
/
`;

/**
 * Inventory Report - Stock Levels by Category
 * 
 * This cursor aggregates inventory quantities by category.
 */
export const inventoryByCategoryQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for stock levels by category
  CURSOR category_stock_cursor IS
    SELECT i.category, SUM(i.quantity) as total_quantity
    FROM inventory i
    GROUP BY i.category
    ORDER BY i.category;
    
  -- Variables
  v_category inventory.category%TYPE;
  v_quantity NUMBER;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Stock Levels by Category');
  DBMS_OUTPUT.PUT_LINE('-----------------------');
  
  FOR cat_rec IN category_stock_cursor LOOP
    v_category := cat_rec.category;
    v_quantity := cat_rec.total_quantity;
    
    DBMS_OUTPUT.PUT_LINE(v_category || ': ' || v_quantity || ' units');
  END LOOP;
END;
/
`;

/**
 * Inventory Report - Low Stock Items
 * 
 * This cursor identifies items that are running low on stock.
 */
export const lowStockItemsQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for low stock items
  CURSOR low_stock_cursor IS
    SELECT id, category, quantity, last_updated
    FROM inventory
    WHERE status = 'Low Stock'
    ORDER BY quantity ASC;
    
  -- Variables
  v_id inventory.id%TYPE;
  v_category inventory.category%TYPE;
  v_quantity inventory.quantity%TYPE;
  v_last_updated inventory.last_updated%TYPE;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Low Stock Items Report');
  DBMS_OUTPUT.PUT_LINE('--------------------');
  
  FOR item_rec IN low_stock_cursor LOOP
    DBMS_OUTPUT.PUT_LINE(
      'ID: ' || item_rec.id || 
      ', Category: ' || item_rec.category ||
      ', Quantity: ' || item_rec.quantity ||
      ', Last Updated: ' || item_rec.last_updated
    );
  END LOOP;
END;
/
`;

/**
 * Categories Report - Items by Category
 * 
 * This cursor counts the number of items in each category.
 */
export const itemsPerCategoryQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for categories with item counts
  CURSOR category_items_cursor IS
    SELECT name, items
    FROM categories
    ORDER BY items DESC;
    
  -- Variables
  v_name categories.name%TYPE;
  v_items categories.items%TYPE;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Items per Category Report');
  DBMS_OUTPUT.PUT_LINE('------------------------');
  
  FOR cat_rec IN category_items_cursor LOOP
    v_name := cat_rec.name;
    v_items := cat_rec.items;
    
    DBMS_OUTPUT.PUT_LINE(v_name || ': ' || v_items || ' items');
  END LOOP;
END;
/
`;

/**
 * Orders Report - Order Status Distribution
 * 
 * This cursor analyzes order statuses to generate the pie chart in the Orders report.
 */
export const orderStatusDistributionQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for order status
  CURSOR order_status_cursor IS
    SELECT 
      status,
      COUNT(*) as count
    FROM orders
    GROUP BY status
    ORDER BY 
      CASE status
        WHEN 'Completed' THEN 1
        WHEN 'Processing' THEN 2
        WHEN 'Pending' THEN 3
      END;
      
  -- Variables
  v_status orders.status%TYPE;
  v_count NUMBER;
  v_total_orders NUMBER := 0;
  
BEGIN
  -- Get total count of orders
  SELECT COUNT(*) INTO v_total_orders FROM orders;
  
  DBMS_OUTPUT.PUT_LINE('Order Status Distribution');
  DBMS_OUTPUT.PUT_LINE('------------------------');
  
  FOR status_rec IN order_status_cursor LOOP
    v_status := status_rec.status;
    v_count := status_rec.count;
    
    DBMS_OUTPUT.PUT_LINE(
      v_status || ': ' || 
      v_count || ' orders (' || 
      ROUND((v_count / v_total_orders) * 100, 2) || '%)'
    );
  END LOOP;
END;
/
`;

/**
 * Orders Report - Order Value Distribution
 * 
 * This cursor analyzes order values to generate the bar chart in the Orders report.
 */
export const orderValueDistributionQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for order values
  CURSOR order_value_cursor IS
    SELECT 
      CASE
        WHEN total < 100 THEN '$0-$100'
        WHEN total BETWEEN 100 AND 499.99 THEN '$100-$500'
        WHEN total BETWEEN 500 AND 999.99 THEN '$500-$1000'
        ELSE '$1000+'
      END as value_range,
      COUNT(*) as count
    FROM orders
    GROUP BY 
      CASE
        WHEN total < 100 THEN '$0-$100'
        WHEN total BETWEEN 100 AND 499.99 THEN '$100-$500'
        WHEN total BETWEEN 500 AND 999.99 THEN '$500-$1000'
        ELSE '$1000+'
      END
    ORDER BY 
      CASE value_range
        WHEN '$0-$100' THEN 1
        WHEN '$100-$500' THEN 2
        WHEN '$500-$1000' THEN 3
        ELSE 4
      END;
      
  -- Variables
  v_range VARCHAR2(20);
  v_count NUMBER;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Order Value Distribution');
  DBMS_OUTPUT.PUT_LINE('------------------------');
  
  FOR range_rec IN order_value_cursor LOOP
    v_range := range_rec.value_range;
    v_count := range_rec.count;
    
    DBMS_OUTPUT.PUT_LINE(v_range || ': ' || v_count || ' orders');
  END LOOP;
END;
/
`;

/**
 * Warehouses Report - Warehouse Capacity Utilization
 * 
 * This cursor analyzes warehouse capacity utilization.
 */
export const warehouseCapacityQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for warehouse capacity
  CURSOR warehouse_capacity_cursor IS
    SELECT 
      w.id,
      l.city,
      l.state,
      w.capacity.total as total_capacity,
      w.capacity.used as used_capacity,
      (w.capacity.total - w.capacity.used) as available_capacity,
      ROUND((w.capacity.used / w.capacity.total) * 100, 2) as utilization_percent
    FROM warehouses w
    JOIN locations l ON w.location_id = l.id
    ORDER BY utilization_percent DESC;
      
  -- Variables
  v_id warehouses.id%TYPE;
  v_city locations.city%TYPE;
  v_state locations.state%TYPE;
  v_total NUMBER;
  v_used NUMBER;
  v_available NUMBER;
  v_utilization NUMBER;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Warehouse Capacity Utilization');
  DBMS_OUTPUT.PUT_LINE('-----------------------------');
  
  FOR wh_rec IN warehouse_capacity_cursor LOOP
    DBMS_OUTPUT.PUT_LINE(
      'Warehouse: ' || wh_rec.city || ', ' || wh_rec.state || 
      ' (ID: ' || wh_rec.id || ')' ||
      ', Total Capacity: ' || wh_rec.total_capacity ||
      ', Used: ' || wh_rec.used_capacity ||
      ', Available: ' || wh_rec.available_capacity ||
      ', Utilization: ' || wh_rec.utilization_percent || '%'
    );
  END LOOP;
END;
/
`;

/**
 * Customers Report - Customers by State
 * 
 * This cursor counts customers by state to generate the bar chart in the Customers report.
 */
export const customersByStateQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for customers by state
  CURSOR customers_by_state_cursor IS
    SELECT state, COUNT(*) as count
    FROM customers
    GROUP BY state
    ORDER BY count DESC;
      
  -- Variables
  v_state customers.state%TYPE;
  v_count NUMBER;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Customers by State');
  DBMS_OUTPUT.PUT_LINE('-----------------');
  
  FOR state_rec IN customers_by_state_cursor LOOP
    v_state := state_rec.state;
    v_count := state_rec.count;
    
    DBMS_OUTPUT.PUT_LINE(v_state || ': ' || v_count || ' customers');
  END LOOP;
END;
/
`;

/**
 * Employees Report - Employee Details
 * 
 * This cursor fetches detailed employee information.
 */
export const employeeDetailsQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for employee details
  CURSOR employee_cursor IS
    SELECT id, name, date_of_birth, age
    FROM employees
    ORDER BY id;
      
  -- Variables
  v_id employees.id%TYPE;
  v_name employees.name%TYPE;
  v_dob employees.date_of_birth%TYPE;
  v_age employees.age%TYPE;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Employee Details Report');
  DBMS_OUTPUT.PUT_LINE('----------------------');
  
  FOR emp_rec IN employee_cursor LOOP
    DBMS_OUTPUT.PUT_LINE(
      'ID: ' || emp_rec.id || 
      ', Name: ' || emp_rec.name ||
      ', Date of Birth: ' || emp_rec.date_of_birth ||
      ', Age: ' || emp_rec.age || ' years'
    );
  END LOOP;
END;
/
`;

/**
 * Dashboard - Recent Orders
 * 
 * This cursor fetches recent orders for the dashboard.
 */
export const recentOrdersQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for recent orders
  CURSOR recent_orders_cursor IS
    SELECT o.id, c.name as customer, o.date, o.amount, o.status
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.date DESC
    FETCH FIRST 5 ROWS ONLY;
      
  -- Variables
  v_id orders.id%TYPE;
  v_customer customers.name%TYPE;
  v_date orders.date%TYPE;
  v_amount orders.amount%TYPE;
  v_status orders.status%TYPE;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Recent Orders Report');
  DBMS_OUTPUT.PUT_LINE('-------------------');
  
  FOR order_rec IN recent_orders_cursor LOOP
    DBMS_OUTPUT.PUT_LINE(
      'Order ID: ' || order_rec.id || 
      ', Customer: ' || order_rec.customer ||
      ', Date: ' || order_rec.date ||
      ', Amount: $' || TO_CHAR(order_rec.amount, '999,999.99') ||
      ', Status: ' || order_rec.status
    );
  END LOOP;
END;
/
`;

/**
 * Dashboard - Low Stock Items
 * 
 * This cursor identifies items that are running low on stock for the dashboard.
 */
export const dashboardLowStockQuery = `
SET SERVEROUTPUT ON;

DECLARE
  -- Cursor for low stock items
  CURSOR dashboard_low_stock_cursor IS
    SELECT p.name as product, p.category, i.current, i.min
    FROM products p
    JOIN inventory i ON p.id = i.product_id
    WHERE i.current < i.min
    ORDER BY (i.current / i.min) ASC;
      
  -- Variables
  v_product products.name%TYPE;
  v_category products.category%TYPE;
  v_current inventory.current%TYPE;
  v_min inventory.min%TYPE;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Low Stock Alert');
  DBMS_OUTPUT.PUT_LINE('--------------');
  
  FOR item_rec IN dashboard_low_stock_cursor LOOP
    DBMS_OUTPUT.PUT_LINE(
      'Product: ' || item_rec.product || 
      ', Category: ' || item_rec.category ||
      ', Current Stock: ' || item_rec.current ||
      ', Minimum Required: ' || item_rec.min
    );
  END LOOP;
END;
/
`;

/**
 * Customer Orders - Detailed Order History
 * 
 * This cursor fetches detailed order history for a customer.
 * Similar to the example provided in the user's request.
 */
export const customerOrderHistoryQuery = `
SET SERVEROUTPUT ON;

DECLARE
    -- Cursor to fetch recent orders by customers
    CURSOR cust_order_cursor IS
        SELECT DISTINCT c.id as CUSTOMER_ID, c.name as CUSTOMER_NAME
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        WHERE o.date >= SYSDATE - 60;

    -- Variables for cursor
    v_customer_id customers.id%TYPE;
    v_customer_name customers.name%TYPE;

    -- Nested cursor for top products per customer
    CURSOR top_products_cursor(p_cust_id customers.id%TYPE) IS
        SELECT p.id as PRODUCT_ID, p.name as PRODUCT_NAME, p.price as PRICE, 
               d.percentage as DISCOUNT_PERCENTAGE, i.stock as QUANTITY, o.total as TOTAL_AMT
        FROM products p
        JOIN order_details od ON p.id = od.product_id
        JOIN orders o ON od.order_id = o.id
        LEFT JOIN discounts d ON p.id = d.product_id
        LEFT JOIN inventory i ON p.id = i.product_id
        WHERE o.customer_id = p_cust_id
        ORDER BY p.price DESC
        FETCH FIRST 3 ROWS ONLY;

    -- Record for nested cursor
    v_prod_id products.id%TYPE;
    v_prod_name products.name%TYPE;
    v_price products.price%TYPE;
    v_discount discounts.percentage%TYPE;
    v_quantity inventory.stock%TYPE;
    v_total_amt orders.total%TYPE;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Customer Order History Report (Last 60 Days)');
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------');
    
    FOR customer_record IN cust_order_cursor LOOP
        v_customer_id := customer_record.CUSTOMER_ID;
        v_customer_name := customer_record.CUSTOMER_NAME;

        DBMS_OUTPUT.PUT_LINE('Customer: ' || v_customer_name || ' (ID: ' || v_customer_id || ')');
        DBMS_OUTPUT.PUT_LINE('Top Products Ordered in Last 60 Days:');

        OPEN top_products_cursor(v_customer_id);
        LOOP
            FETCH top_products_cursor INTO v_prod_id, v_prod_name, v_price, v_discount, v_quantity, v_total_amt;
            EXIT WHEN top_products_cursor%NOTFOUND;

            DBMS_OUTPUT.PUT_LINE(' - Product: ' || v_prod_name || 
                                 ', Price: $' || v_price || 
                                 ', Discount: ' || NVL(v_discount, 0) || '%' || 
                                 ', In Stock: ' || NVL(v_quantity, 0) || 
                                 ', Order Amount: $' || v_total_amt);
        END LOOP;
        CLOSE top_products_cursor;

        DBMS_OUTPUT.PUT_LINE('--------------------------------------------------');
    END LOOP;
END;
/
`;

/**
 * Triggers Section
 * 
 * Below are triggers that would be used in a real database to maintain data integrity
 * and automatically generate reports.
 */

/**
 * Low Stock Alert Trigger
 * 
 * This trigger fires when inventory levels fall below minimum thresholds.
 */
export const lowStockAlertTrigger = `
CREATE OR REPLACE TRIGGER low_stock_alert_trigger
AFTER UPDATE OF quantity ON inventory
FOR EACH ROW
DECLARE
    v_product_name products.name%TYPE;
    v_min_threshold NUMBER := 10; -- Configurable threshold
BEGIN
    -- If quantity drops below threshold
    IF :NEW.quantity < v_min_threshold AND :OLD.quantity >= v_min_threshold THEN
        -- Get product name
        SELECT name INTO v_product_name
        FROM products
        WHERE id = :NEW.product_id;
        
        -- Log the low stock alert
        INSERT INTO inventory_alerts (
            product_id,
            product_name,
            current_quantity,
            min_threshold,
            alert_date,
            alert_type
        ) VALUES (
            :NEW.product_id,
            v_product_name,
            :NEW.quantity,
            v_min_threshold,
            SYSDATE,
            'Low Stock'
        );
    END IF;
END;
/
`;

/**
 * Order Status Update Trigger
 * 
 * This trigger updates inventory when an order is completed.
 */
export const orderStatusTrigger = `
CREATE OR REPLACE TRIGGER order_status_update_trigger
AFTER UPDATE OF status ON orders
FOR EACH ROW
DECLARE
    CURSOR order_items_cursor IS
        SELECT product_id, quantity
        FROM order_details
        WHERE order_id = :NEW.id;
BEGIN
    -- If order is newly shipped/completed
    IF :NEW.status = 'Completed' AND :OLD.status != 'Completed' THEN
        -- Update inventory for each product in the order
        FOR item_rec IN order_items_cursor LOOP
            UPDATE inventory
            SET quantity = quantity - item_rec.quantity
            WHERE product_id = item_rec.product_id;
        END LOOP;
    END IF;
END;
/
`;

/**
 * Warehouse Capacity Alert Trigger
 * 
 * This trigger fires when warehouse capacity utilization exceeds a threshold.
 */
export const warehouseCapacityTrigger = `
CREATE OR REPLACE TRIGGER warehouse_capacity_alert_trigger
AFTER UPDATE OF capacity_used ON warehouses
FOR EACH ROW
DECLARE
    v_utilization_percent NUMBER;
    v_threshold NUMBER := 80; -- 80% capacity threshold
BEGIN
    -- Calculate new utilization percentage
    v_utilization_percent := (:NEW.capacity_used / :NEW.capacity_total) * 100;
    
    -- If utilization exceeds threshold and didn't before
    IF v_utilization_percent >= v_threshold AND 
       (:OLD.capacity_used / :OLD.capacity_total) * 100 < v_threshold THEN
        
        -- Log the capacity alert
        INSERT INTO warehouse_alerts (
            warehouse_id,
            alert_date,
            capacity_total,
            capacity_used,
            utilization_percent,
            alert_type
        ) VALUES (
            :NEW.id,
            SYSDATE,
            :NEW.capacity_total,
            :NEW.capacity_used,
            v_utilization_percent,
            'Capacity Warning'
        );
    END IF;
END;
/
`;

/**
 * Product Price History Trigger
 * 
 * This trigger maintains a history of product price changes.
 */
export const productPriceHistoryTrigger = `
CREATE OR REPLACE TRIGGER product_price_history_trigger
AFTER UPDATE OF price ON products
FOR EACH ROW
BEGIN
    -- Record the price change in history table
    INSERT INTO product_price_history (
        product_id,
        old_price,
        new_price,
        change_date,
        change_percent
    ) VALUES (
        :NEW.id,
        :OLD.price,
        :NEW.price,
        SYSDATE,
        ROUND(((:NEW.price - :OLD.price) / :OLD.price) * 100, 2)
    );
END;
/
`;

/**
 * Daily Sales Summary Procedure
 * 
 * This procedure would be scheduled to run daily to generate sales summaries.
 */
export const dailySalesSummaryProcedure = `
CREATE OR REPLACE PROCEDURE generate_daily_sales_summary(
    p_date DATE DEFAULT SYSDATE
) AS
    v_total_orders NUMBER := 0;
    v_total_revenue NUMBER := 0;
    v_avg_order_value NUMBER := 0;
    v_completed_orders NUMBER := 0;
    v_processing_orders NUMBER := 0;
    v_pending_orders NUMBER := 0;
BEGIN
    -- Get order counts by status
    SELECT COUNT(*)
    INTO v_total_orders
    FROM orders
    WHERE TRUNC(date) = TRUNC(p_date);
    
    -- Get revenue
    SELECT NVL(SUM(total), 0)
    INTO v_total_revenue
    FROM orders
    WHERE TRUNC(date) = TRUNC(p_date);
    
    -- Calculate average order value
    IF v_total_orders > 0 THEN
        v_avg_order_value := v_total_revenue / v_total_orders;
    END IF;
    
    -- Get order counts by status
    SELECT 
        COUNT(CASE WHEN status = 'Completed' THEN 1 END),
        COUNT(CASE WHEN status = 'Processing' THEN 1 END),
        COUNT(CASE WHEN status = 'Pending' THEN 1 END)
    INTO 
        v_completed_orders,
        v_processing_orders,
        v_pending_orders
    FROM orders
    WHERE TRUNC(date) = TRUNC(p_date);
    
    -- Insert into daily summary table
    INSERT INTO daily_sales_summary (
        summary_date,
        total_orders,
        total_revenue,
        avg_order_value,
        completed_orders,
        processing_orders,
        pending_orders
    ) VALUES (
        TRUNC(p_date),
        v_total_orders,
        v_total_revenue,
        v_avg_order_value,
        v_completed_orders,
        v_processing_orders,
        v_pending_orders
    );
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Daily sales summary generated for ' || TO_CHAR(p_date, 'YYYY-MM-DD'));
END generate_daily_sales_summary;
/
`;

/**
 * Scheduled Job for Daily Reports
 * 
 * This would set up a scheduled job to run the daily sales summary procedure.
 */
export const scheduledReportJob = `
BEGIN
    DBMS_SCHEDULER.CREATE_JOB (
        job_name        => 'DAILY_SALES_SUMMARY_JOB',
        job_type        => 'STORED_PROCEDURE',
        job_action      => 'generate_daily_sales_summary',
        start_date      => SYSTIMESTAMP,
        repeat_interval => 'FREQ=DAILY; BYHOUR=23; BYMINUTE=55',
        enabled         => TRUE,
        comments        => 'Job to generate daily sales summary report at 11:55 PM daily'
    );
END;
/
`;

/**
 * Database Table Structures
 * 
 * These would be the table definitions that would support the frontend data.
 */
export const databaseTableStructures = `
-- Products Table
CREATE TABLE products (
    id VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    category VARCHAR2(50) NOT NULL,
    price NUMBER(10,2) NOT NULL,
    stock NUMBER(10) NOT NULL,
    description VARCHAR2(500),
    created_date DATE DEFAULT SYSDATE,
    last_updated DATE DEFAULT SYSDATE
);

-- Inventory Table
CREATE TABLE inventory (
    id VARCHAR2(10) PRIMARY KEY,
    product_id VARCHAR2(10) NOT NULL,
    category VARCHAR2(50) NOT NULL,
    quantity NUMBER(10) NOT NULL,
    status VARCHAR2(20) NOT NULL,
    last_updated DATE DEFAULT SYSDATE,
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Categories Table
CREATE TABLE categories (
    id VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    description VARCHAR2(200),
    items NUMBER(10) DEFAULT 0,
    created_on DATE DEFAULT SYSDATE
);

-- Customers Table
CREATE TABLE customers (
    id VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    city VARCHAR2(50) NOT NULL,
    state VARCHAR2(50) NOT NULL,
    zipcode VARCHAR2(10) NOT NULL,
    email VARCHAR2(100),
    phone VARCHAR2(20),
    created_date DATE DEFAULT SYSDATE
);

-- Orders Table
CREATE TABLE orders (
    id VARCHAR2(10) PRIMARY KEY,
    customer_id VARCHAR2(10) NOT NULL,
    date DATE DEFAULT SYSDATE,
    status VARCHAR2(20) NOT NULL,
    total NUMBER(10,2) NOT NULL,
    payment_method VARCHAR2(50),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order Details Table
CREATE TABLE order_details (
    id VARCHAR2(10) PRIMARY KEY,
    order_id VARCHAR2(10) NOT NULL,
    product_id VARCHAR2(10) NOT NULL,
    quantity NUMBER(5) NOT NULL,
    price NUMBER(10,2) NOT NULL,
    CONSTRAINT fk_orderdetails_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_orderdetails_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Employees Table
CREATE TABLE employees (
    id VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age NUMBER(3) NOT NULL,
    position VARCHAR2(50),
    hire_date DATE DEFAULT SYSDATE,
    salary NUMBER(10,2),
    contact VARCHAR2(50)
);

-- Warehouses Table
CREATE TABLE warehouses (
    id VARCHAR2(10) PRIMARY KEY,
    location_id VARCHAR2(10) NOT NULL,
    manager VARCHAR2(100) NOT NULL,
    phone VARCHAR2(20),
    capacity_total NUMBER(10) NOT NULL,
    capacity_used NUMBER(10) NOT NULL,
    CONSTRAINT fk_warehouse_location FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Locations Table
CREATE TABLE locations (
    id VARCHAR2(10) PRIMARY KEY,
    address VARCHAR2(200) NOT NULL,
    city VARCHAR2(50) NOT NULL,
    state VARCHAR2(50) NOT NULL,
    zip VARCHAR2(10) NOT NULL,
    country VARCHAR2(50) DEFAULT 'USA'
);

-- Inventory Alerts Table
CREATE TABLE inventory_alerts (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id VARCHAR2(10) NOT NULL,
    product_name VARCHAR2(100) NOT NULL,
    current_quantity NUMBER(10) NOT NULL,
    min_threshold NUMBER(10) NOT NULL,
    alert_date DATE DEFAULT SYSDATE,
    alert_type VARCHAR2(50) NOT NULL,
    resolved CHAR(1) DEFAULT 'N',
    resolved_date DATE,
    CONSTRAINT fk_invalerrt_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Warehouse Alerts Table
CREATE TABLE warehouse_alerts (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    warehouse_id VARCHAR2(10) NOT NULL,
    alert_date DATE DEFAULT SYSDATE,
    capacity_total NUMBER(10) NOT NULL,
    capacity_used NUMBER(10) NOT NULL,
    utilization_percent NUMBER(5,2) NOT NULL,
    alert_type VARCHAR2(50) NOT NULL,
    resolved CHAR(1) DEFAULT 'N',
    resolved_date DATE,
    CONSTRAINT fk_whalerrt_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- Product Price History Table
CREATE TABLE product_price_history (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id VARCHAR2(10) NOT NULL,
    old_price NUMBER(10,2) NOT NULL,
    new_price NUMBER(10,2) NOT NULL,
    change_date DATE DEFAULT SYSDATE,
    change_percent NUMBER(5,2) NOT NULL,
    CONSTRAINT fk_pricehistory_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Daily Sales Summary Table
CREATE TABLE daily_sales_summary (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    summary_date DATE NOT NULL,
    total_orders NUMBER(10) NOT NULL,
    total_revenue NUMBER(12,2) NOT NULL,
    avg_order_value NUMBER(10,2) NOT NULL,
    completed_orders NUMBER(10) NOT NULL,
    processing_orders NUMBER(10) NOT NULL,
    pending_orders NUMBER(10) NOT NULL,
    CONSTRAINT uq_dailysales_date UNIQUE (summary_date)
);

-- Discounts Table
CREATE TABLE discounts (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id VARCHAR2(10) NOT NULL,
    percentage NUMBER(5,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active CHAR(1) DEFAULT 'Y',
    CONSTRAINT fk_discount_product FOREIGN KEY (product_id) REFERENCES products(id)
);
`;

/**
 * This section provides information about how to download the SQL commands
 * and integrate them with an actual database.
 */
export const implementationNotes = `
/**
 * Implementation Notes
 * 
 * To implement these PL/SQL commands in a real Oracle Database:
 * 
 * 1. Connect to your Oracle Database using SQL*Plus or another client.
 * 2. Execute the table creation scripts first to set up the database schema.
 * 3. Create the triggers and stored procedures.
 * 4. Create the scheduled job for daily reports.
 * 5. Test the queries to ensure they're returning the expected results.
 * 
 * For PostgreSQL adaptation:
 * - Replace DBMS_OUTPUT.PUT_LINE with RAISE NOTICE.
 * - Replace SYSDATE with CURRENT_DATE.
 * - Adapt PL/SQL syntax to PL/pgSQL syntax.
 * 
 * For MySQL adaptation:
 * - Replace DBMS_OUTPUT.PUT_LINE with SELECT statements.
 * - Replace SYSDATE with CURDATE().
 * - Adapt PL/SQL syntax to MySQL stored procedure syntax.
 * 
 * Note: Some advanced features like nested cursors may need to be rewritten
 * depending on the database system you're using.
 */
`;
