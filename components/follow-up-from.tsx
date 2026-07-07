"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import { createFollowUpAction, updateFollowUpAction } from "@/lib/server-actions";
import { Button, Input, Textarea } from "@/components/ui";

type Props = {
  initial?: {
    id: string;
    date: string;
    salespersonName: string;
    customerName: string;
    phoneNumber: string;
    remarks: string;
    lastFollowupDate: string;
  };
  mode?: "create" | "edit";
};

export function FollowUpForm({ initial, mode = "create" }: Props) {
  const actionFn = mode === "edit" && initial ? updateFollowUpAction.bind(null, initial.id) : createFollowUpAction;
  const [state, action, pending] = useActionState(actionFn as never, null as { error?: string; success?: string } | null);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.token))
      .catch(() => undefined);
  }, []);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Input name="date" type="date" required defaultValue={initial?.date ?? new Date().toISOString().slice(0, 10)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Salesperson Name</label>
        <Input name="salespersonName" placeholder="Rahul" required defaultValue={initial?.salespersonName} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Customer Name</label>
        <Input name="customerName" required defaultValue={initial?.customerName} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Customer Phone Number</label>
        <Input
          name="phoneNumber"
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          required
          defaultValue={initial?.phoneNumber}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Remarks</label>
        <Textarea name="remarks" required defaultValue={initial?.remarks} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Last Follow-Up Date</label>
        <Input name="lastFollowupDate" type="date" defaultValue={initial?.lastFollowupDate} />
      </div>

      <input type="hidden" name="csrfToken" value={csrfToken} />

      <div className="flex items-end">
        <Button type="submit" className="w-full bg-success text-success-foreground md:w-auto md:min-w-44">
          {pending ? "Saving..." : mode === "edit" ? "Update Follow-Up" : "Save Follow-Up"}
        </Button>
      </div>

      {state?.error ? <p className="text-sm text-rose-600 md:col-span-2">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-emerald-700 md:col-span-2">{state.success}</p> : null}
    </form>
  );
}