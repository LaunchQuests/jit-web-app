import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { FilterBar } from "@/components/filter-bar";
import { FollowUpTable } from "@/components/follow-up-table";
import { ShowroomShell } from "@/components/showroom-shell";
import { requireSession } from "@/lib/auth";
import { getShowroomFollowUps } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export default async function ShowroomDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireSession("SUPER_ADMIN");

  const { id } = await params;
  const showroom = await prisma.showroom.findUnique({ where: { id } });

  if (!showroom) notFound();

  const filtersRaw = await searchParams;
  const filters = Object.fromEntries(
    Object.entries(filtersRaw).map(([k, v]) => [k, typeof v === "string" ? v : ""])
  );

  const rows = await getShowroomFollowUps(id, filters);

  return (
    <ShowroomShell
      title={showroom.storeName}
      subtitle="View follow-up activity, apply filters, and export showroom data"
    >
      <Card className="p-5 md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Filters and Search</h2>
          <p className="text-sm text-muted-foreground">
            Use the same filters available to showroom users.
          </p>
        </div>
        <FilterBar searchParams={filtersRaw} />
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Showroom Entries</h2>
          <p className="text-sm text-muted-foreground">Entries appear in reverse chronological order.</p>
        </div>
        <FollowUpTable rows={rows} editBasePath={`/admin/showrooms/${id}`} />
      </section>
    </ShowroomShell>
  );
}