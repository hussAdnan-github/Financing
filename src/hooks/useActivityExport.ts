import { useCallback } from "react";
import { roleLabels, stageLabels, type UserRole, type ClientStage } from "@/mocks/dashboardData";

export interface ActivityEntry {
  id: string;
  clientId: string;
  clientName: string;
  clientService: string;
  clientCity: string;
  action: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
  note?: string;
  fromStage?: ClientStage;
  toStage?: ClientStage;
}

function formatDateTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString("ar-SA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stageChange(entry: ActivityEntry): string {
  if (entry.fromStage && entry.toStage) {
    return `${stageLabels[entry.fromStage]} ← ${stageLabels[entry.toStage]}`;
  }
  return "—";
}

// ─── Excel Export ─────────────────────────────────────────────────────────────
async function exportToExcel(entries: ActivityEntry[], filename: string) {
  const XLSX = await import("xlsx");

  const headers = [
    "التاريخ والوقت",
    "رقم الملف",
    "اسم العميل",
    "نوع الخدمة",
    "المدينة",
    "الإجراء",
    "المنفذ",
    "الدور",
    "تغيير المرحلة",
    "الملاحظة",
  ];

  const rows = entries.map((e) => [
    formatDateTime(e.timestamp),
    e.clientId,
    e.clientName,
    e.clientService,
    e.clientCity,
    e.action,
    e.performedBy,
    roleLabels[e.role],
    stageChange(e),
    e.note ?? "—",
  ]);

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = [
    { wch: 20 }, { wch: 12 }, { wch: 22 }, { wch: 16 }, { wch: 14 },
    { wch: 20 }, { wch: 18 }, { wch: 10 }, { wch: 30 }, { wch: 40 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "سجل الأنشطة");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ─── PDF Export ───────────────────────────────────────────────────────────────
async function exportToPDF(entries: ActivityEntry[], filename: string, filterSummary: string) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header bar
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 297, 18, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Activity Log Report", 148, 11, { align: "center" });

  // Sub-header info
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  const exportDate = new Date().toLocaleDateString("en-SA", { year: "numeric", month: "long", day: "numeric" });
  doc.text(`Export Date: ${exportDate}   |   Total Records: ${entries.length}   |   Filters: ${filterSummary}`, 148, 24, { align: "center" });

  // Table
  const tableRows = entries.map((e) => [
    formatDateTime(e.timestamp),
    `${e.clientName}\n${e.clientId}`,
    e.action,
    `${e.performedBy}\n(${roleLabels[e.role]})`,
    stageChange(e),
    e.note ?? "—",
  ]);

  autoTable(doc, {
    startY: 28,
    head: [["Date & Time", "Client", "Action", "Performed By", "Stage Change", "Note"]],
    body: tableRows,
    styles: {
      fontSize: 7.5,
      cellPadding: 3,
      overflow: "linebreak",
      halign: "left",
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 255],
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 38 },
      2: { cellWidth: 32 },
      3: { cellWidth: 30 },
      4: { cellWidth: 45 },
      5: { cellWidth: "auto" },
    },
    margin: { left: 10, right: 10 },
    didDrawPage: (data) => {
      // Footer
      const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        148,
        doc.internal.pageSize.height - 5,
        { align: "center" }
      );
    },
  });

  doc.save(`${filename}.pdf`);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useActivityExport() {
  const exportExcel = useCallback(async (entries: ActivityEntry[], filterSummary: string) => {
    const date = new Date().toISOString().slice(0, 10);
    await exportToExcel(entries, `activity-log-${date}`);
  }, []);

  const exportPDF = useCallback(async (entries: ActivityEntry[], filterSummary: string) => {
    const date = new Date().toISOString().slice(0, 10);
    await exportToPDF(entries, `activity-log-${date}`, filterSummary);
  }, []);

  return { exportExcel, exportPDF };
}
