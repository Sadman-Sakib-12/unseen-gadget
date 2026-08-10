"use client";
import { Download } from "lucide-react";

export function ExportButtons({ onExportCSV, onExportPDF }: { onExportCSV: () => void; onExportPDF: () => void }) {
  return (
    <div className="flex gap-2">
      <button onClick={onExportCSV} className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
        <Download size={16} />
        Export CSV
      </button>
      <button onClick={onExportPDF} className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
        <Download size={16} />
        Export PDF
      </button>
    </div>
  );
}
