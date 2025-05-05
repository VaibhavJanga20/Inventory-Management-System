
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BarChart3, PieChart, LineChart, Table, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Financial Report Types
type FinancialReportType = 
  | "income-statement" 
  | "balance-sheet" 
  | "cash-flow" 
  | "sales-analysis" 
  | "expense-breakdown"
  | "profit-margin" 
  | "budget-comparison"
  | "tax-summary";

// Inventory Report Types
type InventoryReportType = 
  | "stock-levels" 
  | "category-distribution" 
  | "low-stock-items" 
  | "inventory-value" 
  | "turnover-analysis";

// Customer Report Types
type CustomerReportType = 
  | "customer-acquisition" 
  | "retention-rate" 
  | "lifetime-value" 
  | "geographic-distribution" 
  | "order-history";

type ReportNavigationProps = {
  onReportSelect: (reportCategory: string, reportType: string) => void;
};

export function ReportNavigationMenu({ onReportSelect }: ReportNavigationProps) {
  const navigate = useNavigate();

  return (
    <NavigationMenu className="mb-6">
      <NavigationMenuList>
        {/* Financial Reports */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-purple-50 text-purple-800 hover:bg-purple-100">
            <BarChart3 className="mr-2 h-4 w-4" />
            Financial Reports
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-50 to-purple-100 p-6 no-underline outline-none focus:shadow-md"
                    onClick={() => onReportSelect("financial", "overview")}
                  >
                    <div className="mb-2 mt-4 text-lg font-medium text-purple-900">
                      Financial Overview
                    </div>
                    <p className="text-sm leading-tight text-purple-700">
                      Comprehensive summary of the company's financial performance, including key metrics and trends.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem 
                title="Income Statement" 
                icon={<FileText className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("financial", "income-statement")}
              >
                Revenue, expenses, and profit over a specific period.
              </ListItem>
              <ListItem 
                title="Balance Sheet" 
                icon={<Table className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("financial", "balance-sheet")}
              >
                Assets, liabilities, and equity at a specific point in time.
              </ListItem>
              <ListItem 
                title="Cash Flow" 
                icon={<LineChart className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("financial", "cash-flow")}
              >
                Cash inflows and outflows during a specific period.
              </ListItem>
              <ListItem 
                title="Sales Analysis" 
                icon={<BarChart3 className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("financial", "sales-analysis")}
              >
                Detailed breakdown of sales performance by various metrics.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Inventory Reports */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-blue-50 text-blue-800 hover:bg-blue-100">
            <PieChart className="mr-2 h-4 w-4" />
            Inventory Reports
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem 
                title="Stock Levels" 
                icon={<BarChart3 className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("inventory", "stock-levels")}
              >
                Current inventory levels across all products and categories.
              </ListItem>
              <ListItem 
                title="Category Distribution" 
                icon={<PieChart className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("inventory", "category-distribution")}
              >
                Distribution of inventory items across different categories.
              </ListItem>
              <ListItem 
                title="Low Stock Items" 
                icon={<Table className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("inventory", "low-stock-items")}
              >
                Items that are running low and need replenishment.
              </ListItem>
              <ListItem 
                title="Inventory Value" 
                icon={<FileText className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("inventory", "inventory-value")}
              >
                Total value of current inventory holdings.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Customer Reports */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-green-50 text-green-800 hover:bg-green-100">
            <LineChart className="mr-2 h-4 w-4" />
            Customer Reports
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem 
                title="Customer Acquisition" 
                icon={<LineChart className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("customer", "customer-acquisition")}
              >
                New customers acquired over different time periods.
              </ListItem>
              <ListItem 
                title="Retention Rate" 
                icon={<PieChart className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("customer", "retention-rate")}
              >
                Customer retention metrics and analysis.
              </ListItem>
              <ListItem 
                title="Lifetime Value" 
                icon={<BarChart3 className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("customer", "lifetime-value")}
              >
                Estimated total value of customers over their lifetime.
              </ListItem>
              <ListItem 
                title="Geographic Distribution" 
                icon={<PieChart className="h-4 w-4 mr-2" />}
                onClick={() => onReportSelect("customer", "geographic-distribution")}
              >
                Distribution of customers across different regions.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none flex items-center">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
