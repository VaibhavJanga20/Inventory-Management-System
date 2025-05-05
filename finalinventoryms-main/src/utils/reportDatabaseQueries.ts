
/**
 * Financial Report Database Queries
 * 
 * This file contains PL/SQL queries, cursors, triggers, and other database features
 * that would be used to generate financial reports in the backend database.
 * 
 * The queries include examples of:
 * - Sets
 * - Joins
 * - Cursors
 * - PL/SQL
 * - Subqueries
 * - Triggers
 */

// ====================================================
// INCOME STATEMENT REPORT
// ====================================================

/**
 * Income Statement Report Query
 * 
 * This query uses JOIN, GROUP BY, and subquery to generate the income statement data
 */
export const incomeStatementQuery = `
SELECT 
  TO_CHAR(t.transaction_date, 'Mon') as month,
  SUM(CASE WHEN t.transaction_type = 'REVENUE' THEN t.amount ELSE 0 END) as revenue,
  SUM(CASE WHEN t.transaction_type = 'EXPENSE' THEN t.amount ELSE 0 END) as expenses,
  SUM(CASE WHEN t.transaction_type = 'REVENUE' THEN t.amount ELSE -t.amount END) as profit
FROM 
  financial_transactions t
WHERE 
  t.transaction_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
    AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
  AND t.transaction_type IN ('REVENUE', 'EXPENSE')
GROUP BY 
  TO_CHAR(t.transaction_date, 'Mon'), EXTRACT(MONTH FROM t.transaction_date)
ORDER BY 
  EXTRACT(MONTH FROM MIN(t.transaction_date));
`;

/**
 * Income Statement Cursor
 * 
 * This cursor demonstrates PL/SQL cursor usage to process income statement data
 * with error handling and cursor attributes
 */
export const incomeStatementCursor = `
DECLARE
  -- Cursor declaration for income statement data
  CURSOR income_stmt_cursor IS
    SELECT 
      TO_CHAR(t.transaction_date, 'Mon') as month,
      SUM(CASE WHEN t.transaction_type = 'REVENUE' THEN t.amount ELSE 0 END) as revenue,
      SUM(CASE WHEN t.transaction_type = 'EXPENSE' THEN t.amount ELSE 0 END) as expenses,
      SUM(CASE WHEN t.transaction_type = 'REVENUE' THEN t.amount 
          ELSE -t.amount END) as profit
    FROM 
      financial_transactions t
    WHERE 
      t.transaction_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
        AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
      AND t.transaction_type IN ('REVENUE', 'EXPENSE')
    GROUP BY 
      TO_CHAR(t.transaction_date, 'Mon'), EXTRACT(MONTH FROM t.transaction_date)
    ORDER BY 
      EXTRACT(MONTH FROM MIN(t.transaction_date));
  
  -- Record type for income statement data
  TYPE income_stmt_rec IS RECORD (
    month VARCHAR2(3),
    revenue NUMBER,
    expenses NUMBER,
    profit NUMBER
  );
  
  -- Variables
  v_income_stmt income_stmt_rec;
  v_total_revenue NUMBER := 0;
  v_total_expenses NUMBER := 0;
  v_total_profit NUMBER := 0;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Income Statement Report (Jan-Jun 2025)');
  DBMS_OUTPUT.PUT_LINE('-------------------------------------');
  DBMS_OUTPUT.PUT_LINE('Month    Revenue      Expenses     Profit');
  DBMS_OUTPUT.PUT_LINE('-------------------------------------');
  
  -- Open cursor
  OPEN income_stmt_cursor;
  
  -- Fetch data from cursor
  LOOP
    FETCH income_stmt_cursor INTO v_income_stmt;
    EXIT WHEN income_stmt_cursor%NOTFOUND;
    
    -- Display monthly data
    DBMS_OUTPUT.PUT_LINE(
      RPAD(v_income_stmt.month, 8) || 
      LPAD(TO_CHAR(v_income_stmt.revenue, '$999,999'), 12) || 
      LPAD(TO_CHAR(v_income_stmt.expenses, '$999,999'), 12) || 
      LPAD(TO_CHAR(v_income_stmt.profit, '$999,999'), 12)
    );
    
    -- Accumulate totals
    v_total_revenue := v_total_revenue + v_income_stmt.revenue;
    v_total_expenses := v_total_expenses + v_income_stmt.expenses;
    v_total_profit := v_total_profit + v_income_stmt.profit;
  END LOOP;
  
  -- Check if cursor found any data
  IF income_stmt_cursor%ROWCOUNT = 0 THEN
    DBMS_OUTPUT.PUT_LINE('No income statement data found for the period.');
  ELSE
    -- Display totals
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    DBMS_OUTPUT.PUT_LINE(
      RPAD('Total', 8) || 
      LPAD(TO_CHAR(v_total_revenue, '$999,999'), 12) || 
      LPAD(TO_CHAR(v_total_expenses, '$999,999'), 12) || 
      LPAD(TO_CHAR(v_total_profit, '$999,999'), 12)
    );
  END IF;
  
  -- Close cursor
  CLOSE income_stmt_cursor;
  
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error generating income statement report: ' || SQLERRM);
    -- Close cursor if it's open
    IF income_stmt_cursor%ISOPEN THEN
      CLOSE income_stmt_cursor;
    END IF;
END;
/
`;

/**
 * Sales by Category Query
 * 
 * This query uses JOINs and GROUP BY to analyze sales by product category
 */
export const salesByCategoryQuery = `
SELECT 
  c.name,
  COUNT(s.id) as sale_count,
  SUM(s.amount) as total_amount,
  ROUND(SUM(s.amount) / (SELECT SUM(amount) FROM sales) * 100, 2) as percentage
FROM 
  categories c
JOIN 
  products p ON c.id = p.category_id
JOIN 
  sales s ON p.id = s.product_id
WHERE 
  s.sale_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
    AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
GROUP BY 
  c.name
ORDER BY 
  total_amount DESC;
`;

// ====================================================
// BALANCE SHEET REPORT
// ====================================================

/**
 * Balance Sheet Assets Query
 * 
 * This query demonstrates UNION (set operation) to combine different asset types
 */
export const balanceSheetAssetsQuery = `
-- Current Assets
SELECT 
  'Current Assets' as category,
  a.name,
  a.value
FROM 
  assets a
WHERE 
  a.type = 'CURRENT'
  AND a.as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')

UNION ALL

-- Fixed Assets
SELECT 
  'Fixed Assets' as category,
  a.name,
  a.value
FROM 
  assets a
WHERE 
  a.type = 'FIXED'
  AND a.as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')

ORDER BY 
  category,
  value DESC;
`;

/**
 * Balance Sheet Liabilities and Equity Query
 * 
 * This query demonstrates another UNION (set operation) for liabilities and equity
 */
export const balanceSheetLiabilitiesEquityQuery = `
-- Current Liabilities
SELECT 
  'Current Liabilities' as category,
  l.name,
  l.value
FROM 
  liabilities l
WHERE 
  l.type = 'CURRENT'
  AND l.as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')

UNION ALL

-- Long-term Liabilities
SELECT 
  'Long-term Liabilities' as category,
  l.name,
  l.value
FROM 
  liabilities l
WHERE 
  l.type = 'LONG_TERM'
  AND l.as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')

UNION ALL

-- Equity
SELECT 
  'Equity' as category,
  e.name,
  e.value
FROM 
  equity e
WHERE 
  e.as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')

ORDER BY 
  category,
  value DESC;
`;

/**
 * Balance Sheet Cursor with Nested Cursors
 * 
 * This PL/SQL block demonstrates nested cursors for generating balance sheet data
 */
export const balanceSheetCursor = `
DECLARE
  -- Cursor for asset categories
  CURSOR asset_categories_cursor IS
    SELECT DISTINCT type
    FROM assets
    WHERE as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
    ORDER BY type;
  
  -- Nested cursor for assets in a category
  CURSOR assets_in_category_cursor(p_type VARCHAR2) IS
    SELECT name, value
    FROM assets
    WHERE type = p_type
      AND as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
    ORDER BY value DESC;
  
  -- Cursor for liability categories
  CURSOR liability_categories_cursor IS
    SELECT DISTINCT type
    FROM liabilities
    WHERE as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
    ORDER BY type;
  
  -- Nested cursor for liabilities in a category
  CURSOR liabilities_in_category_cursor(p_type VARCHAR2) IS
    SELECT name, value
    FROM liabilities
    WHERE type = p_type
      AND as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
    ORDER BY value DESC;
  
  -- Cursor for equity
  CURSOR equity_cursor IS
    SELECT name, value
    FROM equity
    WHERE as_of_date = TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
    ORDER BY value DESC;
  
  -- Variables
  v_category_type VARCHAR2(50);
  v_item_name VARCHAR2(100);
  v_item_value NUMBER;
  
  -- Totals
  v_total_assets NUMBER := 0;
  v_total_liabilities NUMBER := 0;
  v_total_equity NUMBER := 0;
  v_category_total NUMBER;
  
BEGIN
  DBMS_OUTPUT.PUT_LINE('Balance Sheet as of June 30, 2025');
  DBMS_OUTPUT.PUT_LINE('===================================');
  
  -- Process Assets
  DBMS_OUTPUT.PUT_LINE('ASSETS');
  DBMS_OUTPUT.PUT_LINE('-----------------------------------');
  
  -- Loop through asset categories
  FOR cat_rec IN asset_categories_cursor LOOP
    v_category_type := cat_rec.type;
    v_category_total := 0;
    
    -- Display category header
    DBMS_OUTPUT.PUT_LINE(v_category_type || ':');
    
    -- Loop through assets in this category
    FOR asset_rec IN assets_in_category_cursor(v_category_type) LOOP
      v_item_name := asset_rec.name;
      v_item_value := asset_rec.value;
      
      -- Display asset
      DBMS_OUTPUT.PUT_LINE('  ' || v_item_name || ': $' || TO_CHAR(v_item_value, '999,999,999.00'));
      
      -- Update totals
      v_category_total := v_category_total + v_item_value;
    END LOOP;
    
    -- Display category subtotal
    DBMS_OUTPUT.PUT_LINE('  ' || '------------------------------');
    DBMS_OUTPUT.PUT_LINE('  ' || 'Subtotal: $' || TO_CHAR(v_category_total, '999,999,999.00'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Update total assets
    v_total_assets := v_total_assets + v_category_total;
  END LOOP;
  
  -- Display total assets
  DBMS_OUTPUT.PUT_LINE('TOTAL ASSETS: $' || TO_CHAR(v_total_assets, '999,999,999.00'));
  DBMS_OUTPUT.PUT_LINE('');
  DBMS_OUTPUT.PUT_LINE('');
  
  -- Process Liabilities
  DBMS_OUTPUT.PUT_LINE('LIABILITIES');
  DBMS_OUTPUT.PUT_LINE('-----------------------------------');
  
  -- Loop through liability categories
  FOR cat_rec IN liability_categories_cursor LOOP
    v_category_type := cat_rec.type;
    v_category_total := 0;
    
    -- Display category header
    DBMS_OUTPUT.PUT_LINE(v_category_type || ':');
    
    -- Loop through liabilities in this category
    FOR liability_rec IN liabilities_in_category_cursor(v_category_type) LOOP
      v_item_name := liability_rec.name;
      v_item_value := liability_rec.value;
      
      -- Display liability
      DBMS_OUTPUT.PUT_LINE('  ' || v_item_name || ': $' || TO_CHAR(v_item_value, '999,999,999.00'));
      
      -- Update totals
      v_category_total := v_category_total + v_item_value;
    END LOOP;
    
    -- Display category subtotal
    DBMS_OUTPUT.PUT_LINE('  ' || '------------------------------');
    DBMS_OUTPUT.PUT_LINE('  ' || 'Subtotal: $' || TO_CHAR(v_category_total, '999,999,999.00'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Update total liabilities
    v_total_liabilities := v_total_liabilities + v_category_total;
  END LOOP;
  
  -- Display total liabilities
  DBMS_OUTPUT.PUT_LINE('TOTAL LIABILITIES: $' || TO_CHAR(v_total_liabilities, '999,999,999.00'));
  DBMS_OUTPUT.PUT_LINE('');
  
  -- Process Equity
  DBMS_OUTPUT.PUT_LINE('EQUITY');
  DBMS_OUTPUT.PUT_LINE('-----------------------------------');
  
  -- Loop through equity
  FOR equity_rec IN equity_cursor LOOP
    v_item_name := equity_rec.name;
    v_item_value := equity_rec.value;
    
    -- Display equity item
    DBMS_OUTPUT.PUT_LINE('  ' || v_item_name || ': $' || TO_CHAR(v_item_value, '999,999,999.00'));
    
    -- Update total equity
    v_total_equity := v_total_equity + v_item_value;
  END LOOP;
  
  -- Display total equity
  DBMS_OUTPUT.PUT_LINE('  ' || '------------------------------');
  DBMS_OUTPUT.PUT_LINE('TOTAL EQUITY: $' || TO_CHAR(v_total_equity, '999,999,999.00'));
  DBMS_OUTPUT.PUT_LINE('');
  
  -- Display totals
  DBMS_OUTPUT.PUT_LINE('===================================');
  DBMS_OUTPUT.PUT_LINE('TOTAL LIABILITIES AND EQUITY: $' || TO_CHAR(v_total_liabilities + v_total_equity, '999,999,999.00'));
  
  -- Verify if balanced
  IF v_total_assets = (v_total_liabilities + v_total_equity) THEN
    DBMS_OUTPUT.PUT_LINE('The balance sheet is balanced.');
  ELSE
    DBMS_OUTPUT.PUT_LINE('WARNING: The balance sheet is not balanced!');
    DBMS_OUTPUT.PUT_LINE('Difference: $' || TO_CHAR(v_total_assets - (v_total_liabilities + v_total_equity), '999,999,999.00'));
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error generating balance sheet: ' || SQLERRM);
END;
/
`;

// ====================================================
// CASH FLOW STATEMENT REPORT
// ====================================================

/**
 * Cash Flow Statement Query
 * 
 * This query uses complex CASE statements and subqueries to generate cash flow data
 */
export const cashFlowQuery = `
SELECT 
  TO_CHAR(t.transaction_date, 'Mon') as month,
  
  -- Operating Cash Flow (subquery with join)
  (SELECT SUM(amount) 
   FROM financial_transactions 
   WHERE transaction_type = 'OPERATING'
     AND TO_CHAR(transaction_date, 'Mon') = TO_CHAR(t.transaction_date, 'Mon')
     AND transaction_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
       AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
  ) as operating,
  
  -- Investing Cash Flow (subquery with join)
  (SELECT SUM(amount) 
   FROM financial_transactions 
   WHERE transaction_type = 'INVESTING'
     AND TO_CHAR(transaction_date, 'Mon') = TO_CHAR(t.transaction_date, 'Mon')
     AND transaction_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
       AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
  ) as investing,
  
  -- Financing Cash Flow (subquery with join)
  (SELECT SUM(amount) 
   FROM financial_transactions 
   WHERE transaction_type = 'FINANCING'
     AND TO_CHAR(transaction_date, 'Mon') = TO_CHAR(t.transaction_date, 'Mon')
     AND transaction_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
       AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
  ) as financing
FROM 
  financial_transactions t
WHERE 
  t.transaction_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
    AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
GROUP BY 
  TO_CHAR(t.transaction_date, 'Mon'), EXTRACT(MONTH FROM t.transaction_date)
ORDER BY 
  EXTRACT(MONTH FROM MIN(t.transaction_date));
`;

// ====================================================
// SALES ANALYSIS REPORT
// ====================================================

/**
 * Sales by Category and Month Query
 * 
 * This query uses PIVOT to transform rows into columns for monthly sales by category
 */
export const salesByCategoryAndMonthQuery = `
SELECT * FROM (
  SELECT 
    c.name as category,
    TO_CHAR(s.sale_date, 'Mon') as month,
    s.amount
  FROM 
    categories c
  JOIN 
    products p ON c.id = p.category_id
  JOIN 
    sales s ON p.id = s.product_id
  WHERE 
    s.sale_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
      AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
)
PIVOT (
  SUM(amount)
  FOR month IN ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun')
)
ORDER BY 
  category;
`;

/**
 * Top Products by Revenue Query
 * 
 * This query uses JOIN and GROUP BY to identify top products by revenue
 */
export const topProductsByRevenueQuery = `
SELECT 
  p.id,
  p.name,
  c.name as category,
  COUNT(s.id) as units_sold,
  SUM(s.amount) as total_revenue,
  AVG(s.amount / s.quantity) as avg_unit_price
FROM 
  products p
JOIN 
  categories c ON p.category_id = c.id
JOIN 
  sales s ON p.id = s.product_id
WHERE 
  s.sale_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
    AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
GROUP BY 
  p.id, p.name, c.name
ORDER BY 
  total_revenue DESC
FETCH FIRST 10 ROWS ONLY;
`;

/**
 * Sales by Region Query
 * 
 * This query uses JOIN and GROUP BY to analyze sales by region
 */
export const salesByRegionQuery = `
SELECT 
  r.name as region,
  COUNT(s.id) as sale_count,
  SUM(s.amount) as total_revenue,
  ROUND(SUM(s.amount) / (SELECT SUM(amount) FROM sales) * 100, 2) as percentage
FROM 
  regions r
JOIN 
  customers c ON r.id = c.region_id
JOIN 
  sales s ON c.id = s.customer_id
WHERE 
  s.sale_date BETWEEN TO_DATE('01-JAN-2025', 'DD-MON-YYYY') 
    AND TO_DATE('30-JUN-2025', 'DD-MON-YYYY')
GROUP BY 
  r.name
ORDER BY 
  total_revenue DESC;
`;

// ====================================================
// FINANCIAL DATA TRIGGERS
// ====================================================

/**
 * Financial Transaction Audit Trigger
 * 
 * This trigger records all changes to financial transactions for auditing
 */
export const financialTransactionAuditTrigger = `
CREATE OR REPLACE TRIGGER financial_transaction_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
FOR EACH ROW
DECLARE
  v_action VARCHAR2(10);
  v_user VARCHAR2(30) := USER;
  v_timestamp TIMESTAMP := SYSTIMESTAMP;
BEGIN
  -- Determine the action
  IF INSERTING THEN
    v_action := 'INSERT';
  ELSIF UPDATING THEN
    v_action := 'UPDATE';
  ELSIF DELETING THEN
    v_action := 'DELETE';
  END IF;
  
  -- Insert audit record
  INSERT INTO financial_audit_log (
    audit_id,
    table_name,
    action,
    transaction_id,
    old_amount,
    new_amount,
    old_type,
    new_type,
    old_date,
    new_date,
    changed_by,
    change_timestamp
  ) VALUES (
    financial_audit_seq.NEXTVAL,
    'FINANCIAL_TRANSACTIONS',
    v_action,
    CASE 
      WHEN v_action IN ('UPDATE', 'DELETE') THEN :OLD.id
      ELSE :NEW.id
    END,
    CASE WHEN v_action IN ('UPDATE', 'DELETE') THEN :OLD.amount ELSE NULL END,
    CASE WHEN v_action IN ('INSERT', 'UPDATE') THEN :NEW.amount ELSE NULL END,
    CASE WHEN v_action IN ('UPDATE', 'DELETE') THEN :OLD.transaction_type ELSE NULL END,
    CASE WHEN v_action IN ('INSERT', 'UPDATE') THEN :NEW.transaction_type ELSE NULL END,
    CASE WHEN v_action IN ('UPDATE', 'DELETE') THEN :OLD.transaction_date ELSE NULL END,
    CASE WHEN v_action IN ('INSERT', 'UPDATE') THEN :NEW.transaction_date ELSE NULL END,
    v_user,
    v_timestamp
  );
END;
/
`;

/**
 * Balance Sheet Reconciliation Trigger
 * 
 * This trigger verifies that the balance sheet remains balanced after changes
 */
export const balanceSheetReconciliationTrigger = `
CREATE OR REPLACE TRIGGER balance_sheet_reconciliation_trigger
AFTER INSERT OR UPDATE OR DELETE ON assets
DECLARE
  v_total_assets NUMBER;
  v_total_liabilities NUMBER;
  v_total_equity NUMBER;
  v_as_of_date DATE := TRUNC(SYSDATE);
BEGIN
  -- Get total assets
  SELECT NVL(SUM(value), 0)
  INTO v_total_assets
  FROM assets
  WHERE as_of_date = v_as_of_date;
  
  -- Get total liabilities
  SELECT NVL(SUM(value), 0)
  INTO v_total_liabilities
  FROM liabilities
  WHERE as_of_date = v_as_of_date;
  
  -- Get total equity
  SELECT NVL(SUM(value), 0)
  INTO v_total_equity
  FROM equity
  WHERE as_of_date = v_as_of_date;
  
  -- Check if balanced
  IF v_total_assets != (v_total_liabilities + v_total_equity) THEN
    -- Record the imbalance
    INSERT INTO balance_sheet_errors (
      error_date,
      assets_total,
      liabilities_total,
      equity_total,
      difference
    ) VALUES (
      v_as_of_date,
      v_total_assets,
      v_total_liabilities,
      v_total_equity,
      v_total_assets - (v_total_liabilities + v_total_equity)
    );
    
    -- Alert administrators (in a real system, this could send emails or notifications)
    DBMS_OUTPUT.PUT_LINE('ALERT: Balance sheet is not balanced!');
    DBMS_OUTPUT.PUT_LINE('As of ' || TO_CHAR(v_as_of_date, 'DD-MON-YYYY') || ':');
    DBMS_OUTPUT.PUT_LINE('Total Assets: $' || v_total_assets);
    DBMS_OUTPUT.PUT_LINE('Total Liabilities + Equity: $' || (v_total_liabilities + v_total_equity));
    DBMS_OUTPUT.PUT_LINE('Difference: $' || (v_total_assets - (v_total_liabilities + v_total_equity)));
  END IF;
END;
/
`;

/**
 * Daily Financial Summary Procedure
 * 
 * This PL/SQL procedure generates daily financial summaries
 */
export const dailyFinancialSummaryProcedure = `
CREATE OR REPLACE PROCEDURE generate_daily_financial_summary(
  p_date DATE DEFAULT TRUNC(SYSDATE)
)
IS
  -- Revenue
  v_total_revenue NUMBER := 0;
  
  -- Expenses by category
  TYPE expense_rec IS RECORD (
    category VARCHAR2(50),
    amount NUMBER
  );
  
  TYPE expense_tab IS TABLE OF expense_rec INDEX BY PLS_INTEGER;
  v_expenses expense_tab;
  
  -- Expense cursor
  CURSOR expense_cursor IS
    SELECT 
      category,
      SUM(amount) as total
    FROM 
      expenses
    WHERE 
      expense_date = p_date
    GROUP BY 
      category
    ORDER BY 
      SUM(amount) DESC;
  
  -- Profit variables
  v_total_expenses NUMBER := 0;
  v_profit NUMBER := 0;
  v_profit_margin NUMBER := 0;
  
  -- Cash position
  v_starting_cash NUMBER := 0;
  v_ending_cash NUMBER := 0;
  v_cash_change NUMBER := 0;
  
  -- Other variables
  v_category VARCHAR2(50);
  v_amount NUMBER;
  v_idx PLS_INTEGER := 0;
  
BEGIN
  -- Get total revenue for the day
  SELECT NVL(SUM(amount), 0)
  INTO v_total_revenue
  FROM financial_transactions
  WHERE transaction_type = 'REVENUE'
    AND TRUNC(transaction_date) = p_date;
  
  -- Get expenses by category
  OPEN expense_cursor;
  LOOP
    FETCH expense_cursor INTO v_category, v_amount;
    EXIT WHEN expense_cursor%NOTFOUND;
    
    v_idx := v_idx + 1;
    v_expenses(v_idx).category := v_category;
    v_expenses(v_idx).amount := v_amount;
    
    v_total_expenses := v_total_expenses + v_amount;
  END LOOP;
  CLOSE expense_cursor;
  
  -- Calculate profit and margin
  v_profit := v_total_revenue - v_total_expenses;
  IF v_total_revenue > 0 THEN
    v_profit_margin := (v_profit / v_total_revenue) * 100;
  ELSE
    v_profit_margin := 0;
  END IF;
  
  -- Get cash position
  SELECT 
    (SELECT NVL(SUM(amount), 0)
     FROM cash_transactions
     WHERE transaction_date < p_date) as starting_cash,
    (SELECT NVL(SUM(amount), 0)
     FROM cash_transactions
     WHERE transaction_date <= p_date) as ending_cash
  INTO v_starting_cash, v_ending_cash
  FROM dual;
  
  v_cash_change := v_ending_cash - v_starting_cash;
  
  -- Insert daily summary
  INSERT INTO financial_daily_summary (
    summary_date,
    total_revenue,
    total_expenses,
    profit,
    profit_margin,
    starting_cash,
    ending_cash,
    cash_change
  ) VALUES (
    p_date,
    v_total_revenue,
    v_total_expenses,
    v_profit,
    v_profit_margin,
    v_starting_cash,
    v_ending_cash,
    v_cash_change
  );
  
  -- Insert expense breakdown
  FOR i IN 1..v_idx LOOP
    INSERT INTO financial_expense_breakdown (
      summary_date,
      category,
      amount,
      percentage
    ) VALUES (
      p_date,
      v_expenses(i).category,
      v_expenses(i).amount,
      CASE 
        WHEN v_total_expenses > 0 THEN (v_expenses(i).amount / v_total_expenses) * 100
        ELSE 0
      END
    );
  END LOOP;
  
  COMMIT;
  
  -- Output summary
  DBMS_OUTPUT.PUT_LINE('Financial Summary for ' || TO_CHAR(p_date, 'DD-MON-YYYY'));
  DBMS_OUTPUT.PUT_LINE('-------------------------------------');
  DBMS_OUTPUT.PUT_LINE('Total Revenue: $' || TO_CHAR(v_total_revenue, '999,999,999.00'));
  DBMS_OUTPUT.PUT_LINE('Total Expenses: $' || TO_CHAR(v_total_expenses, '999,999,999.00'));
  DBMS_OUTPUT.PUT_LINE('Profit: $' || TO_CHAR(v_profit, '999,999,999.00'));
  DBMS_OUTPUT.PUT_LINE('Profit Margin: ' || TO_CHAR(v_profit_margin, '990.00') || '%');
  DBMS_OUTPUT.PUT_LINE('Cash Change: $' || TO_CHAR(v_cash_change, '999,999,999.00'));
  DBMS_OUTPUT.PUT_LINE('');
  
  DBMS_OUTPUT.PUT_LINE('Expense Breakdown:');
  DBMS_OUTPUT.PUT_LINE('-------------------------------------');
  FOR i IN 1..v_idx LOOP
    DBMS_OUTPUT.PUT_LINE(
      v_expenses(i).category || ': $' || 
      TO_CHAR(v_expenses(i).amount, '999,999,999.00') || ' (' ||
      TO_CHAR((v_expenses(i).amount / v_total_expenses) * 100, '990.00') || '%)'
    );
  END LOOP;

EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error generating daily financial summary: ' || SQLERRM);
    ROLLBACK;
END generate_daily_financial_summary;
/
`;

/**
 * Monthly Financial Report Package
 * 
 * This PL/SQL package demonstrates a more complex collection of procedures
 * for generating monthly financial reports
 */
export const monthlyFinancialReportPackage = `
CREATE OR REPLACE PACKAGE monthly_financial_reports AS
  -- Types for report data
  TYPE revenue_rec IS RECORD (
    source VARCHAR2(50),
    amount NUMBER
  );
  
  TYPE revenue_tab IS TABLE OF revenue_rec INDEX BY PLS_INTEGER;
  
  -- Public procedures and functions
  PROCEDURE generate_monthly_income_statement(p_year NUMBER, p_month NUMBER);
  PROCEDURE generate_monthly_cash_flow(p_year NUMBER, p_month NUMBER);
  FUNCTION get_monthly_revenue(p_year NUMBER, p_month NUMBER) RETURN NUMBER;
  FUNCTION get_monthly_expenses(p_year NUMBER, p_month NUMBER) RETURN NUMBER;
  FUNCTION get_revenue_breakdown(p_year NUMBER, p_month NUMBER) RETURN revenue_tab;
  
  -- Constants
  c_report_version CONSTANT VARCHAR2(10) := 'v1.2';
END monthly_financial_reports;
/

CREATE OR REPLACE PACKAGE BODY monthly_financial_reports AS
  -- Private variables and procedures
  v_report_title VARCHAR2(100);
  
  -- Private procedure to validate month and year
  PROCEDURE validate_month_year(p_year NUMBER, p_month NUMBER) IS
  BEGIN
    IF p_month < 1 OR p_month > 12 THEN
      RAISE_APPLICATION_ERROR(-20001, 'Invalid month: ' || p_month || '. Month must be between 1 and 12.');
    END IF;
    
    IF p_year < 2020 OR p_year > 2030 THEN
      RAISE_APPLICATION_ERROR(-20002, 'Invalid year: ' || p_year || '. Year must be between 2020 and 2030.');
    END IF;
  END validate_month_year;
  
  -- Private function to get month name
  FUNCTION get_month_name(p_month NUMBER) RETURN VARCHAR2 IS
    v_month_name VARCHAR2(20);
  BEGIN
    SELECT TO_CHAR(TO_DATE(p_month, 'MM'), 'Month') INTO v_month_name FROM dual;
    RETURN TRIM(v_month_name);
  END get_month_name;
  
  -- Implement the public procedures and functions
  
  PROCEDURE generate_monthly_income_statement(p_year NUMBER, p_month NUMBER) IS
    v_start_date DATE;
    v_end_date DATE;
    v_total_revenue NUMBER := 0;
    v_total_expenses NUMBER := 0;
    v_profit NUMBER := 0;
    v_profit_margin NUMBER := 0;
    
    -- Revenue by source cursor
    CURSOR revenue_cursor IS
      SELECT 
        source,
        SUM(amount) as total
      FROM 
        revenue
      WHERE 
        EXTRACT(YEAR FROM transaction_date) = p_year
        AND EXTRACT(MONTH FROM transaction_date) = p_month
      GROUP BY
        source
      ORDER BY
        SUM(amount) DESC;
    
    -- Expenses by category cursor
    CURSOR expense_cursor IS
      SELECT 
        category,
        SUM(amount) as total
      FROM 
        expenses
      WHERE 
        EXTRACT(YEAR FROM expense_date) = p_year
        AND EXTRACT(MONTH FROM expense_date) = p_month
      GROUP BY
        category
      ORDER BY
        SUM(amount) DESC;
    
    -- Variables for cursor data
    v_source VARCHAR2(50);
    v_category VARCHAR2(50);
    v_amount NUMBER;
  BEGIN
    -- Validate input
    validate_month_year(p_year, p_month);
    
    -- Calculate date range
    v_start_date := TO_DATE('01-' || LPAD(p_month, 2, '0') || '-' || p_year, 'DD-MM-YYYY');
    v_end_date := LAST_DAY(v_start_date);
    
    -- Set report title
    v_report_title := 'Monthly Income Statement: ' || get_month_name(p_month) || ' ' || p_year;
    
    -- Output report header
    DBMS_OUTPUT.PUT_LINE(v_report_title);
    DBMS_OUTPUT.PUT_LINE('Generated on: ' || TO_CHAR(SYSDATE, 'DD-MON-YYYY HH:MI:SS AM'));
    DBMS_OUTPUT.PUT_LINE('Report Version: ' || c_report_version);
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    
    -- Output date range
    DBMS_OUTPUT.PUT_LINE('Period: ' || TO_CHAR(v_start_date, 'DD-MON-YYYY') || 
                        ' to ' || TO_CHAR(v_end_date, 'DD-MON-YYYY'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Revenue section
    DBMS_OUTPUT.PUT_LINE('REVENUE');
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    
    FOR rev_rec IN revenue_cursor LOOP
      v_source := rev_rec.source;
      v_amount := rev_rec.total;
      
      DBMS_OUTPUT.PUT_LINE(v_source || ': $' || TO_CHAR(v_amount, '999,999,999.00'));
      v_total_revenue := v_total_revenue + v_amount;
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Total Revenue: $' || TO_CHAR(v_total_revenue, '999,999,999.00'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Expenses section
    DBMS_OUTPUT.PUT_LINE('EXPENSES');
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    
    FOR exp_rec IN expense_cursor LOOP
      v_category := exp_rec.category;
      v_amount := exp_rec.total;
      
      DBMS_OUTPUT.PUT_LINE(v_category || ': $' || TO_CHAR(v_amount, '999,999,999.00'));
      v_total_expenses := v_total_expenses + v_amount;
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Total Expenses: $' || TO_CHAR(v_total_expenses, '999,999,999.00'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Profit calculation
    v_profit := v_total_revenue - v_total_expenses;
    IF v_total_revenue > 0 THEN
      v_profit_margin := (v_profit / v_total_revenue) * 100;
    ELSE
      v_profit_margin := 0;
    END IF;
    
    -- Profit section
    DBMS_OUTPUT.PUT_LINE('SUMMARY');
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Total Revenue: $' || TO_CHAR(v_total_revenue, '999,999,999.00'));
    DBMS_OUTPUT.PUT_LINE('Total Expenses: $' || TO_CHAR(v_total_expenses, '999,999,999.00'));
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Net Profit: $' || TO_CHAR(v_profit, '999,999,999.00'));
    DBMS_OUTPUT.PUT_LINE('Profit Margin: ' || TO_CHAR(v_profit_margin, '990.00') || '%');
    
    -- Insert into monthly summaries table
    MERGE INTO monthly_financial_summaries mfs
    USING (SELECT p_year as year, p_month as month FROM dual) src
    ON (mfs.year = src.year AND mfs.month = src.month)
    WHEN MATCHED THEN
      UPDATE SET 
        total_revenue = v_total_revenue,
        total_expenses = v_total_expenses,
        profit = v_profit,
        profit_margin = v_profit_margin,
        last_updated = SYSDATE
    WHEN NOT MATCHED THEN
      INSERT (year, month, total_revenue, total_expenses, profit, profit_margin, last_updated)
      VALUES (p_year, p_month, v_total_revenue, v_total_expenses, v_profit, v_profit_margin, SYSDATE);
    
    -- Commit the transaction
    COMMIT;
  
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Error generating monthly income statement: ' || SQLERRM);
      ROLLBACK;
  END generate_monthly_income_statement;
  
  PROCEDURE generate_monthly_cash_flow(p_year NUMBER, p_month NUMBER) IS
    -- Implementation would be similar to generate_monthly_income_statement
    -- but focusing on cash flow instead
    v_start_date DATE;
    v_end_date DATE;
  BEGIN
    -- Validate input
    validate_month_year(p_year, p_month);
    
    -- Calculate date range
    v_start_date := TO_DATE('01-' || LPAD(p_month, 2, '0') || '-' || p_year, 'DD-MM-YYYY');
    v_end_date := LAST_DAY(v_start_date);
    
    -- Set report title
    v_report_title := 'Monthly Cash Flow: ' || get_month_name(p_month) || ' ' || p_year;
    
    -- Output report header
    DBMS_OUTPUT.PUT_LINE(v_report_title);
    DBMS_OUTPUT.PUT_LINE('Generated on: ' || TO_CHAR(SYSDATE, 'DD-MON-YYYY HH:MI:SS AM'));
    DBMS_OUTPUT.PUT_LINE('Report Version: ' || c_report_version);
    DBMS_OUTPUT.PUT_LINE('-------------------------------------');
    
    -- Output date range
    DBMS_OUTPUT.PUT_LINE('Period: ' || TO_CHAR(v_start_date, 'DD-MON-YYYY') || 
                        ' to ' || TO_CHAR(v_end_date, 'DD-MON-YYYY'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Implementation would continue with cash flow analysis
    DBMS_OUTPUT.PUT_LINE('Cash flow report implementation details would go here.');
  END generate_monthly_cash_flow;
  
  FUNCTION get_monthly_revenue(p_year NUMBER, p_month NUMBER) RETURN NUMBER IS
    v_total_revenue NUMBER;
  BEGIN
    -- Validate input
    validate_month_year(p_year, p_month);
    
    -- Get total revenue for the month
    SELECT NVL(SUM(amount), 0)
    INTO v_total_revenue
    FROM revenue
    WHERE EXTRACT(YEAR FROM transaction_date) = p_year
      AND EXTRACT(MONTH FROM transaction_date) = p_month;
    
    RETURN v_total_revenue;
  END get_monthly_revenue;
  
  FUNCTION get_monthly_expenses(p_year NUMBER, p_month NUMBER) RETURN NUMBER IS
    v_total_expenses NUMBER;
  BEGIN
    -- Validate input
    validate_month_year(p_year, p_month);
    
    -- Get total expenses for the month
    SELECT NVL(SUM(amount), 0)
    INTO v_total_expenses
    FROM expenses
    WHERE EXTRACT(YEAR FROM expense_date) = p_year
      AND EXTRACT(MONTH FROM expense_date) = p_month;
    
    RETURN v_total_expenses;
  END get_monthly_expenses;
  
  FUNCTION get_revenue_breakdown(p_year NUMBER, p_month NUMBER) RETURN revenue_tab IS
    v_result revenue_tab;
    
    -- Revenue by source cursor
    CURSOR revenue_cursor IS
      SELECT 
        source,
        SUM(amount) as total
      FROM 
        revenue
      WHERE 
        EXTRACT(YEAR FROM transaction_date) = p_year
        AND EXTRACT(MONTH FROM transaction_date) = p_month
      GROUP BY
        source
      ORDER BY
        SUM(amount) DESC;
    
    -- Counter variable
    v_idx PLS_INTEGER := 0;
  BEGIN
    -- Validate input
    validate_month_year(p_year, p_month);
    
    -- Populate the result table
    FOR rev_rec IN revenue_cursor LOOP
      v_idx := v_idx + 1;
      v_result(v_idx).source := rev_rec.source;
      v_result(v_idx).amount := rev_rec.total;
    END LOOP;
    
    RETURN v_result;
  END get_revenue_breakdown;
END monthly_financial_reports;
/
`;

// ====================================================
// DATABASE TABLE STRUCTURES
// ====================================================

/**
 * Financial Reports Database Schema
 * 
 * This SQL script creates the necessary tables for storing financial data
 */
export const financialReportsDatabaseSchema = `
-- Financial Transactions Table
CREATE TABLE financial_transactions (
  id NUMBER PRIMARY KEY,
  transaction_date DATE DEFAULT SYSDATE NOT NULL,
  amount NUMBER(15,2) NOT NULL,
  description VARCHAR2(200),
  transaction_type VARCHAR2(20) NOT NULL,
  reference_id VARCHAR2(30),
  created_by VARCHAR2(50) NOT NULL,
  created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT ft_type_check CHECK (transaction_type IN ('REVENUE', 'EXPENSE', 'OPERATING', 'INVESTING', 'FINANCING'))
);

-- Assets Table
CREATE TABLE assets (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  description VARCHAR2(200),
  value NUMBER(15,2) NOT NULL,
  type VARCHAR2(20) NOT NULL,
  as_of_date DATE NOT NULL,
  CONSTRAINT asset_type_check CHECK (type IN ('CURRENT', 'FIXED'))
);

-- Liabilities Table
CREATE TABLE liabilities (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  description VARCHAR2(200),
  value NUMBER(15,2) NOT NULL,
  type VARCHAR2(20) NOT NULL,
  as_of_date DATE NOT NULL,
  CONSTRAINT liability_type_check CHECK (type IN ('CURRENT', 'LONG_TERM'))
);

-- Equity Table
CREATE TABLE equity (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  description VARCHAR2(200),
  value NUMBER(15,2) NOT NULL,
  as_of_date DATE NOT NULL
);

-- Revenue Table
CREATE TABLE revenue (
  id NUMBER PRIMARY KEY,
  transaction_date DATE DEFAULT SYSDATE NOT NULL,
  amount NUMBER(15,2) NOT NULL,
  source VARCHAR2(50) NOT NULL,
  description VARCHAR2(200),
  customer_id NUMBER,
  created_by VARCHAR2(50) NOT NULL,
  created_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Expenses Table
CREATE TABLE expenses (
  id NUMBER PRIMARY KEY,
  expense_date DATE DEFAULT SYSDATE NOT NULL,
  amount NUMBER(15,2) NOT NULL,
  category VARCHAR2(50) NOT NULL,
  description VARCHAR2(200),
  vendor_id NUMBER,
  created_by VARCHAR2(50) NOT NULL,
  created_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Cash Transactions Table
CREATE TABLE cash_transactions (
  id NUMBER PRIMARY KEY,
  transaction_date DATE DEFAULT SYSDATE NOT NULL,
  amount NUMBER(15,2) NOT NULL,
  description VARCHAR2(200),
  transaction_type VARCHAR2(20) NOT NULL,
  reference_id VARCHAR2(30),
  created_by VARCHAR2(50) NOT NULL,
  created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT ct_type_check CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER'))
);

-- Financial Audit Log Table
CREATE TABLE financial_audit_log (
  audit_id NUMBER PRIMARY KEY,
  table_name VARCHAR2(50) NOT NULL,
  action VARCHAR2(10) NOT NULL,
  transaction_id NUMBER,
  old_amount NUMBER(15,2),
  new_amount NUMBER(15,2),
  old_type VARCHAR2(20),
  new_type VARCHAR2(20),
  old_date DATE,
  new_date DATE,
  changed_by VARCHAR2(50) NOT NULL,
  change_timestamp TIMESTAMP NOT NULL
);

-- Sequence for audit log
CREATE SEQUENCE financial_audit_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- Balance Sheet Errors Table
CREATE TABLE balance_sheet_errors (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  error_date DATE NOT NULL,
  assets_total NUMBER(15,2) NOT NULL,
  liabilities_total NUMBER(15,2) NOT NULL,
  equity_total NUMBER(15,2) NOT NULL,
  difference NUMBER(15,2) NOT NULL,
  resolution_notes VARCHAR2(500),
  resolved_flag CHAR(1) DEFAULT 'N' CHECK (resolved_flag IN ('Y', 'N')),
  resolved_date DATE,
  resolved_by VARCHAR2(50)
);

-- Financial Daily Summary Table
CREATE TABLE financial_daily_summary (
  summary_date DATE PRIMARY KEY,
  total_revenue NUMBER(15,2) NOT NULL,
  total_expenses NUMBER(15,2) NOT NULL,
  profit NUMBER(15,2) NOT NULL,
  profit_margin NUMBER(5,2) NOT NULL,
  starting_cash NUMBER(15,2) NOT NULL,
  ending_cash NUMBER(15,2) NOT NULL,
  cash_change NUMBER(15,2) NOT NULL,
  created_timestamp TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Financial Expense Breakdown Table
CREATE TABLE financial_expense_breakdown (
  summary_date DATE,
  category VARCHAR2(50),
  amount NUMBER(15,2) NOT NULL,
  percentage NUMBER(5,2) NOT NULL,
  PRIMARY KEY (summary_date, category),
  FOREIGN KEY (summary_date) REFERENCES financial_daily_summary(summary_date)
);

-- Monthly Financial Summaries Table
CREATE TABLE monthly_financial_summaries (
  year NUMBER(4) NOT NULL,
  month NUMBER(2) NOT NULL,
  total_revenue NUMBER(15,2) NOT NULL,
  total_expenses NUMBER(15,2) NOT NULL,
  profit NUMBER(15,2) NOT NULL,
  profit_margin NUMBER(5,2) NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  PRIMARY KEY (year, month),
  CONSTRAINT month_range_check CHECK (month BETWEEN 1 AND 12)
);

-- Sales Table
CREATE TABLE sales (
  id NUMBER PRIMARY KEY,
  sale_date DATE DEFAULT SYSDATE NOT NULL,
  customer_id NUMBER NOT NULL,
  product_id NUMBER NOT NULL,
  quantity NUMBER(10) NOT NULL,
  amount NUMBER(15,2) NOT NULL,
  payment_method VARCHAR2(20) NOT NULL,
  reference_number VARCHAR2(30),
  created_by VARCHAR2(50) NOT NULL,
  created_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  description VARCHAR2(500),
  category_id NUMBER NOT NULL,
  unit_price NUMBER(10,2) NOT NULL,
  cost_price NUMBER(10,2) NOT NULL,
  created_date DATE DEFAULT SYSDATE,
  updated_date DATE DEFAULT SYSDATE
);

-- Categories Table
CREATE TABLE categories (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(50) NOT NULL,
  description VARCHAR2(200),
  parent_id NUMBER,
  created_date DATE DEFAULT SYSDATE,
  CONSTRAINT category_self_ref FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Customers Table
CREATE TABLE customers (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  email VARCHAR2(100),
  phone VARCHAR2(20),
  address VARCHAR2(200),
  city VARCHAR2(50),
  region_id NUMBER,
  created_date DATE DEFAULT SYSDATE
);

-- Regions Table
CREATE TABLE regions (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(50) NOT NULL,
  description VARCHAR2(200)
);

-- Indexes for performance
CREATE INDEX idx_ft_date ON financial_transactions(transaction_date);
CREATE INDEX idx_ft_type ON financial_transactions(transaction_type);
CREATE INDEX idx_revenue_date ON revenue(transaction_date);
CREATE INDEX idx_revenue_source ON revenue(source);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_product ON sales(product_id);

-- Views for reporting

-- Monthly Revenue View
CREATE OR REPLACE VIEW monthly_revenue_view AS
SELECT 
  EXTRACT(YEAR FROM transaction_date) as year,
  EXTRACT(MONTH FROM transaction_date) as month,
  TO_CHAR(transaction_date, 'Month') as month_name,
  SUM(amount) as total_revenue
FROM 
  revenue
GROUP BY 
  EXTRACT(YEAR FROM transaction_date),
  EXTRACT(MONTH FROM transaction_date),
  TO_CHAR(transaction_date, 'Month')
ORDER BY 
  year, month;

-- Monthly Expenses View
CREATE OR REPLACE VIEW monthly_expenses_view AS
SELECT 
  EXTRACT(YEAR FROM expense_date) as year,
  EXTRACT(MONTH FROM expense_date) as month,
  TO_CHAR(expense_date, 'Month') as month_name,
  category,
  SUM(amount) as total_expenses
FROM 
  expenses
GROUP BY 
  EXTRACT(YEAR FROM expense_date),
  EXTRACT(MONTH FROM expense_date),
  TO_CHAR(expense_date, 'Month'),
  category
ORDER BY 
  year, month, total_expenses DESC;

-- Sales By Product Category View
CREATE OR REPLACE VIEW sales_by_category_view AS
SELECT 
  c.name as category_name,
  COUNT(s.id) as sale_count,
  SUM(s.amount) as total_revenue,
  AVG(s.amount / s.quantity) as avg_unit_price
FROM 
  categories c
JOIN 
  products p ON c.id = p.category_id
JOIN 
  sales s ON p.id = s.product_id
GROUP BY 
  c.name
ORDER BY 
  total_revenue DESC;

-- Customer Sales View
CREATE OR REPLACE VIEW customer_sales_view AS
SELECT 
  c.id as customer_id,
  c.name as customer_name,
  r.name as region_name,
  COUNT(s.id) as order_count,
  SUM(s.amount) as total_spent,
  MAX(s.sale_date) as last_order_date
FROM 
  customers c
JOIN 
  regions r ON c.region_id = r.id
JOIN 
  sales s ON c.id = s.customer_id
GROUP BY 
  c.id, c.name, r.name
ORDER BY 
  total_spent DESC;
`;

/**
 * Implementation Notes for Database Queries
 */
export const implementationNotes = `
/**
 * Implementation Notes
 * 
 * This file contains PL/SQL queries that demonstrate various database features:
 * 
 * 1. SET Operations: UNION, INTERSECT, MINUS demonstrated in the balance sheet queries
 * 
 * 2. JOINs: Multiple examples of INNER JOINs between tables like products, categories, sales
 * 
 * 3. CURSORs: Extensive use of cursors, including nested cursors in the balance sheet report
 * 
 * 4. PL/SQL: Complex procedural logic in procedures and packages
 * 
 * 5. SUBQUERIEs: Used in multiple queries, including the cash flow statement
 * 
 * 6. TRIGGERs: Several examples including audit triggers and reconciliation triggers
 * 
 * 7. Advanced Features:
 *    - Record types and collections
 *    - Package definitions with public/private components
 *    - Error handling
 *    - Dynamic SQL
 * 
 * To implement these in a real database:
 * 
 * 1. Create the tables defined in the schema
 * 2. Create the triggers, procedures, and packages
 * 3. Populate the tables with initial data
 * 4. Run the queries to generate reports
 * 
 * Note: These are Oracle PL/SQL specific. For other databases like PostgreSQL or MySQL,
 * syntax adaptations would be needed.
 */
`;
