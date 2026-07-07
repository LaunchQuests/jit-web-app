import Link from "next/link";
import { format } from "date-fns";
import { Pencil, Phone, Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { deleteFollowUpAction } from "@/lib/server-actions";
import { formatPhone, telHref } from "@/lib/utils";

export function FollowUpTable({
  rows,
  editBasePath = "/follow-ups"
}: {
  rows: Array<any>;
  editBasePath?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-line text-left text-muted-foreground">
              {["Date", "Salesperson Name", "Customer Name", "Phone Number", "Remarks", "Last Follow-Up Date", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line/70 align-top">
                <td className="px-4 py-4">{format(row.date, "dd MMM yyyy")}</td>
                <td className="px-4 py-4">{row.salespersonName}</td>
                <td className="px-4 py-4 font-medium">{row.customerName}</td>
                <td className="px-4 py-4">
                  <a href={telHref(row.phoneNumber)} className="text-primary hover:underline underline-offset-4">
                    {formatPhone(row.phoneNumber)}
                  </a>
                </td>
                <td className="max-w-sm whitespace-pre-wrap px-4 py-4 text-muted-foreground">{row.remarks}</td>
                <td className="px-4 py-4">
                  {row.lastFollowupDate ? format(row.lastFollowupDate, "dd MMM yyyy") : "-"}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Link href={`${editBasePath}?edit=${row.id}`}>
                      <Button className="border border-line bg-card px-3">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>

                    <form action={deleteFollowUpAction.bind(null, row.id)}>
                      <Button className="border border-line bg-card px-3 text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>

                    <a href={telHref(row.phoneNumber)}>
                      <Button className="bg-primary px-3 text-primary-foreground">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">No follow-ups found for the current filters.</div> : null}
    </Card>
  );
}