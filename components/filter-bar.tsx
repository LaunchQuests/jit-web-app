import { Input } from "@/components/ui";

export function FilterBar({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const get = (key: string) => (typeof searchParams[key] === "string" ? String(searchParams[key]) : "");

  return (
    <form className="grid gap-3 md:grid-cols-5">
      <Input name="salespersonName" placeholder="Filter by salesperson" defaultValue={get("salespersonName")} />
      <Input name="date" type="date" defaultValue={get("date")} />
      <Input name="customerName" placeholder="Filter by customer" defaultValue={get("customerName")} />
      <Input name="phoneNumber" inputMode="numeric" placeholder="Filter by phone" defaultValue={get("phoneNumber")} />
      <Input name="search" placeholder="Search name, phone, remarks" defaultValue={get("search")} />
    </form>
  );
}