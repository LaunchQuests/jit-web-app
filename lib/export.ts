import * as XLSX from "xlsx";
import { format } from "date-fns";

export function buildFollowUpsWorkbook(
  rows: Array<{
    date: Date;
    salespersonName: string;
    customerName: string;
    phoneNumber: string;
    remarks: string;
    lastFollowupDate: Date | null;
  }>
) {
  const data = rows.map((row) => ({
    Date: format(row.date, "yyyy-MM-dd"),
    "Salesperson Name": row.salespersonName,
    "Customer Name": row.customerName,
    "Phone Number": row.phoneNumber,
    Remarks: row.remarks,
    "Last Follow-Up Date": row.lastFollowupDate ? format(row.lastFollowupDate, "yyyy-MM-dd") : ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "FollowUps");

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });
}