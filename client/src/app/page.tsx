import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function HomePage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Component Showcase</h1>

      <Card className="max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Login Form Example</h2>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full">Sign In</Button>
      </Card>
    </div>
  );
}
