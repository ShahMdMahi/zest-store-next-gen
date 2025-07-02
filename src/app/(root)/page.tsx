import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function Home() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Zest Store</h1>
          <p className="text-xl text-muted-foreground">Your one-stop shop for everything amazing</p>
        </div>

        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Authentication Demo</CardTitle>
            <CardDescription>A demonstration of the login and registration system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {isAuthenticated ? `You are currently logged in as ${session.user.name || session.user.email}.` : "You are currently not logged in. Please sign in or register for an account."}
            </p>

            {isAuthenticated && (
              <div className="flex items-center gap-2 rounded-md border p-4">
                <div className="flex-1">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
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
              <div className="w-full flex justify-between items-center">
                <Link href="/profile">
                  <Button variant="outline">My Profile</Button>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="w-full flex justify-between items-center">
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
