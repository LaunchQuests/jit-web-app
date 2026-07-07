import Link from "next/link";
import { Download, Eye, Trash2 } from "lucide-react";
import { ShowroomShell } from "@/components/showroom-shell";
import { Card, Button } from "@/components/ui";
import { ShowroomForm } from "@/components/showroom-form";
import { deleteShowroomAction } from "@/lib/server-actions";
import { requireSession } from "@/lib/auth";
import { getAllShowrooms } from "@/lib/queries";

export default async function AdminPage() {
  await requireSession("SUPER_ADMIN");
  const showrooms = await getAllShowrooms();

  return (
    <ShowroomShell
      title="Super Admin"
      subtitle="Manage showrooms and view follow-up activity across the network"
    >
      <Card className="p-5 md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Create Showroom Login</h2>
          <p className="text-sm text-muted-foreground">Only one login is issued per showroom.</p>
        </div>
        <ShowroomForm />
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">Showroom Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[820px] text-sm">
            <thead className="bg-card">
              <tr className="border-b border-line text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Store Name</th>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Entries</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {showrooms.map((showroom) => {
                const user = showroom.users[0];

                return (
                  <tr key={showroom.id} className="border-b border-line/70">
                    <td className="px-4 py-4 font-medium">{showroom.storeName}</td>
                    <td className="px-4 py-4">{user?.username}</td>
                    <td className="px-4 py-4">{showroom.status}</td>
                    <td className="px-4 py-4">{showroom._count.followUps}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/showrooms/${showroom.id}`}>
                          <Button className="border border-line bg-card px-3">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <a href={`/api/export/${showroom.id}`}>
                          <Button className="bg-primary px-3 text-primary-foreground">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>

                        <form action={deleteShowroomAction.bind(null, showroom.id)}>
                          <Button className="border border-line bg-card px-3 text-rose-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </ShowroomShell>
  );
}