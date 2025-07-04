import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function Home() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Welcome to Zest Store</h1>
          <p className="text-muted-foreground text-xl">Your one-stop shop for everything amazing</p>
        </div>

        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Authentication Demo</CardTitle>
            <CardDescription>A demonstration of the login and registration system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              {isAuthenticated
                ? `You are currently logged in as ${session.user.name || session.user.email}.`
                : "You are currently not logged in. Please sign in or register for an account."}
            </p>

            {isAuthenticated && (
              <div className="flex items-center gap-2 rounded-md border p-4">
                <div className="flex-1">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-muted-foreground text-sm">{session.user.email}</p>
                </div>
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {isAuthenticated ? (
              <div className="flex w-full items-center justify-between">
                <Link href="/profile">
                  <Button variant="outline">My Profile</Button>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <Link href="/auth/login">
                  <Button>Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline">Create Account</Button>
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
