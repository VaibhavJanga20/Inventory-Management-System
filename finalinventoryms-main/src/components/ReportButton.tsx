
import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportDialog } from "./ReportDialog";

type ReportButtonProps = {
  title: string;
  type: "products" | "inventory" | "categories" | "suppliers" | "orders" | "warehouses" | "customers";
  data: any[];
};

export function ReportButton({ title, type, data }: ReportButtonProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
        onClick={() => setIsReportOpen(true)}
      >
        <BarChart3 size={18} />
        <span>Reports</span>
      </Button>
      
      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title={title}
        type={type}
        data={data}
      />
    </>
  );
}
