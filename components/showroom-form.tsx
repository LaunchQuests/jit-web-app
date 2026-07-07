"use client";

import { useActionState } from "react";
import { createShowroomAction } from "@/lib/server-actions";
import { Button, Input } from "@/components/ui";
import { useEffect, useState } from "react";

export function ShowroomForm() {
  const [state, action, pending] = useActionState(createShowroomAction, null as { error?: string; success?: string } | null);
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
        <label className="text-sm font-medium">Store Name</label>
        <Input name="storeName" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input name="username" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input name="password" type="password" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <select
          name="status"
          className="min-h-12 w-full rounded-2xl border border-line bg-white/80 px-4 text-base dark:bg-slate-950/40"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <input type="hidden" name="csrfToken" value={csrfToken} />

      <div className="flex flex-col gap-2 md:col-span-2">
        <Button className="w-full bg-primary text-primary-foreground md:w-auto">
          {pending ? "Creating..." : "Create Showroom Login"}
        </Button>

        {state?.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
      </div>
    </form>
  );
}