import { Card } from "@/components/ui";
import { FollowUpForm } from "@/components/follow-up-from";
import { FollowUpTable } from "@/components/follow-up-table";
import { FilterBar } from "@/components/filter-bar";
import { ShowroomShell } from "@/components/showroom-shell";
import { requireSession } from "@/lib/auth";
import { getShowroomFollowUps } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export default async function FollowUpsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireSession("SHOWROOM");
  const params = await searchParams;

  const filters = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, typeof v === "string" ? v : ""])
  );

  const rows = await getShowroomFollowUps(session.showroomId!, filters);

  const showroom = await prisma.showroom.findUnique({
    where: { id: session.showroomId! }
  });

  const editId = typeof params.edit === "string" ? params.edit : "";
  const editable = editId
    ? await prisma.followUp.findFirst({
        where: { id: editId, showroomId: session.showroomId! }
      })
    : null;

  return (
    <ShowroomShell
      title={showroom?.storeName ?? "Showroom"}
      subtitle="Simple touch-first customer follow-up workspace"
    >
      <Card className="p-5 md:p-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Today’s workflow</p>
          <h2 className="text-lg font-semibold">Add New Follow-Up</h2>
        </div>

        <FollowUpForm
          initial={
            editable
              ? {
                  id: editable.id,
                  date: new Date(editable.date).toISOString().slice(0, 10),
                  salespersonName: editable.salespersonName,
                  customerName: editable.customerName,
                  phoneNumber: editable.phoneNumber,
                  remarks: editable.remarks,
                  lastFollowupDate: editable.lastFollowupDate
                    ? new Date(editable.lastFollowupDate).toISOString().slice(0, 10)
                    : ""
                }
              : undefined
          }
          mode={editable ? "edit" : "create"}
        />
      </Card>

      <Card className="p-5 md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Filters and Search</h2>
          <p className="text-sm text-muted-foreground">
            Filter by salesperson, date, customer, phone number, or search across key fields.
          </p>
        </div>
        <FilterBar searchParams={params} />
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Customer List</h2>
          <p className="text-sm text-muted-foreground">Newest entries appear first.</p>
        </div>
        <FollowUpTable rows={rows} />
      </section>
    </ShowroomShell>
  );
}