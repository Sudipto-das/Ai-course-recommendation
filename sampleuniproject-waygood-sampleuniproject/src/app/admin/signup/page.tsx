"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Compass, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Passwords do not match.",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Password must be at least 6 characters.",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signup(email, password);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSignup}>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Compass className="h-10 w-10 text-accent" />
              <h1 className="font-headline text-3xl font-bold text-primary">Course Compass</h1>
            </div>
            <CardTitle className="text-2xl font-headline">Admin Signup</CardTitle>
            <CardDescription>Create an admin account to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <a href="/admin/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
