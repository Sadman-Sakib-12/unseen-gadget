"use client";
import { FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButtons({
  onExportCSV,
  onExportPDF,
}: {
  onExportCSV: () => void;
  onExportPDF: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={onExportCSV}>
        <FileDown className="h-4 w-4" />
        Export CSV
      </Button>
      <Button variant="outline" onClick={onExportPDF}>
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}