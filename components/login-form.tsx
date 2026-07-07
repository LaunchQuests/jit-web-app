"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/server-actions";
import { Button, Input } from "@/components/ui";
import { useEffect, useState } from "react";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null as { error?: string } | null);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.token))
      .catch(() => undefined);
  }, []);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input name="username" placeholder="store.username" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input name="password" type="password" placeholder="••••••••" required />
      </div>

      <input type="hidden" name="csrfToken" value={csrfToken} />

      {state?.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}

      <Button type="submit" className="w-full bg-primary text-primary-foreground">
        {pending ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}