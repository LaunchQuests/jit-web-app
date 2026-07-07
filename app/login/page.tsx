import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Retail CRM</p>
            <h1 className="text-2xl font-semibold">Just-In-Time Follow-Up Portal</h1>
          </div>
          <ThemeToggle />
        </div>

        <Card className="p-6 md:p-8">
          <div className="mb-6 space-y-2">
            <p className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Secure showroom access
            </p>
            <h2 className="text-xl font-semibold">Login</h2>
            <p className="text-sm text-muted-foreground">
              Use the showroom username and password created by the super admin.
            </p>
          </div>

          <LoginForm />
        </Card>
      </div>
    </main>
  );
}