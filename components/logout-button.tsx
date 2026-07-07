"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui";
import { logoutAction } from "@/lib/server-actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      className="bg-slate-900 text-white dark:bg-white dark:text-slate-900"
      onClick={() => startTransition(() => logoutAction())}
    >
      {pending ? "Signing out..." : "Logout"}
    </Button>
  );
}