-- Supabase Report Generation Commands
-- This file contains PostgreSQL queries and functions that will be used to generate
-- the data displayed in the application's reports.

-- ====================================================================================
-- FINANCIAL REPORTS - QUERIES AND FUNCTIONS
-- ====================================================================================

-- Income Statement Data Query
CREATE OR REPLACE FUNCTION get_income_statement_data(start_date DATE, end_date DATE)
RETURNS TABLE (
    month TEXT,
    revenue DECIMAL(10,2),
    expenses DECIMAL(10,2),
    profit DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(transaction_date, 'Mon') AS month,
        COALESCE(SUM(CASE WHEN transaction_type = 'revenue' THEN amount ELSE 0 END), 0) AS revenue,
        COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) AS expenses,
        COALESCE(SUM(CASE WHEN transaction_type = 'revenue' THEN amount ELSE -amount END), 0) AS profit
    FROM financial_transactions
    WHERE transaction_date BETWEEN start_date AND end_date
    GROUP BY TO_CHAR(transaction_date, 'Mon'), EXTRACT(MONTH FROM transaction_date)
    ORDER BY EXTRACT(MONTH FROM transaction_date);
END;
$$ LANGUAGE plpgsql;

-- Sales by Category Query
CREATE OR REPLACE FUNCTION get_sales_by_category(start_date DATE, end_date DATE)
RETURNS TABLE (
    name TEXT,
    value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.category AS name,
        ROUND((SUM(od.price * od.quantity) / NULLIF((
            SELECT SUM(price * quantity) 
            FROM order_details 
            JOIN orders o ON order_details.order_id = o.id
            WHERE o.date BETWEEN start_date AND end_date
        ), 0)) * 100, 2) AS value
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    JOIN orders o ON od.order_id = o.id
    WHERE o.date BETWEEN start_date AND end_date
    GROUP BY p.category
    ORDER BY value DESC;
END;
$$ LANGUAGE plpgsql;

-- Sales Analysis Data Query
CREATE OR REPLACE FUNCTION get_sales_analysis_by_month(start_date DATE, end_date DATE)
RETURNS TABLE (
    month TEXT,
    electronics DECIMAL(10,2),
    furniture DECIMAL(10,2),
    clothing DECIMAL(10,2),
    books DECIMAL(10,2),
    other DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(o.date, 'Mon') AS month,
        COALESCE(SUM(CASE WHEN p.category = 'Electronics' THEN od.price * od.quantity ELSE 0 END), 0) AS electronics,
        COALESCE(SUM(CASE WHEN p.category = 'Furniture' THEN od.price * od.quantity ELSE 0 END), 0) AS furniture,
        COALESCE(SUM(CASE WHEN p.category = 'Clothing' THEN od.price * od.quantity ELSE 0 END), 0) AS clothing,
        COALESCE(SUM(CASE WHEN p.category = 'Books' THEN od.price * od.quantity ELSE 0 END), 0) AS books,
        COALESCE(SUM(CASE WHEN p.category NOT IN ('Electronics', 'Furniture', 'Clothing', 'Books') THEN od.price * od.quantity ELSE 0 END), 0) AS other
    FROM orders o
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.date BETWEEN start_date AND end_date
    GROUP BY TO_CHAR(o.date, 'Mon'), EXTRACT(MONTH FROM o.date)
    ORDER BY EXTRACT(MONTH FROM o.date);
END;
$$ LANGUAGE plpgsql;

-- Top Products By Revenue
CREATE OR REPLACE FUNCTION get_top_products_by_revenue(start_date DATE, end_date DATE, limit_count INT)
RETURNS TABLE (
    name TEXT,
    category TEXT,
    revenue DECIMAL(10,2),
    units INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name,
        p.category,
        COALESCE(SUM(od.price * od.quantity), 0) AS revenue,
        COALESCE(SUM(od.quantity), 0) AS units
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    JOIN orders o ON od.order_id = o.id
    WHERE o.date BETWEEN start_date AND end_date
    GROUP BY p.id, p.name, p.category
    ORDER BY revenue DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Views for Common Reports
CREATE OR REPLACE VIEW monthly_sales_summary AS
SELECT 
    TO_CHAR(o.date, 'YYYY-MM') AS month,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(od.quantity) AS total_items,
    SUM(od.price * od.quantity) AS total_revenue
FROM orders o
JOIN order_details od ON o.id = od.order_id
GROUP BY TO_CHAR(o.date, 'YYYY-MM')
ORDER BY month;

CREATE OR REPLACE VIEW product_performance AS
SELECT 
    p.id,
    p.name,
    p.category,
    COALESCE(SUM(od.quantity), 0) AS total_sold,
    COALESCE(SUM(od.price * od.quantity), 0) AS total_revenue,
    p.stock AS current_stock
FROM products p
LEFT JOIN order_details od ON p.id = od.product_id
LEFT JOIN orders o ON od.order_id = o.id
GROUP BY p.id, p.name, p.category, p.stock;

CREATE OR REPLACE VIEW customer_insights AS
SELECT 
    c.id,
    c.name,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(o.total) AS total_spent,
    MAX(o.date) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;

CREATE OR REPLACE VIEW inventory_status AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.stock,
    p.price,
    CASE 
        WHEN p.stock <= 10 THEN 'Low'
        WHEN p.stock <= 20 THEN 'Medium'
        ELSE 'High'
    END AS stock_level
FROM products p; 